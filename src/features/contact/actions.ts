"use server";

import { getClientIp } from "@/lib/clientIp";
import { renderEnquiryAutoReply } from "@/lib/email/templates/enquiryAutoReply";
import { renderEnquiryNotification } from "@/lib/email/templates/enquiryNotification";
import { env } from "@/lib/env";
import { HONEYPOT_FIELD, STARTED_AT_FIELD } from "@/lib/honeypot";
import { rateLimit } from "@/lib/rateLimit";
import { resend } from "@/lib/resend";
import { siteConfig } from "@/lib/siteConfig";
import { toFieldErrors } from "@/lib/zodErrors";

import { contactSchema, type ContactFormState } from "./schema";

const SUCCESS_MESSAGE = "Thanks. Your message is in, and we'll come back to you within a day.";

/**
 * Minimum plausible time to fill in four fields, in milliseconds.
 *
 * Generous on purpose. This is meant to catch a script that posts the
 * instant the page parses, not to police fast typists or someone pasting
 * from a prepared brief.
 */
const MIN_FILL_MS = 3000;

/** Enquiries permitted per IP per window. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const failure = (values: Record<string, string>): ContactFormState => ({
  status: "error",
  message: `Something went wrong on our end. Email us at ${siteConfig.contact.email} and we'll pick it up from there.`,
  values,
});

/**
 * Rejects a submission that arrived implausibly fast after the form mounted.
 *
 * FAILS OPEN, BY DESIGN. The timestamp is written by the client on mount,
 * because this route is statically prerendered: a value stamped during
 * render would be frozen at *build* time and every submission would look
 * hours old. That means it is absent with JavaScript off, and a form that
 * rejected every no-JS submission would be far worse than no check at all.
 * Anything missing or unparseable is therefore waved through.
 *
 * It is also client-supplied, so a bot that forges an old timestamp walks
 * straight past it. Same class of defence as the honeypot: free,
 * frictionless, catches the naive majority. It is not rate limiting and
 * should not be mistaken for it.
 */
function isSuspiciouslyFast(raw: string): boolean {
  const startedAt = Number(raw);
  if (!Number.isFinite(startedAt) || startedAt <= 0) return false;

  const elapsed = Date.now() - startedAt;
  // A negative elapsed means clock skew between the two machines, not a bot.
  return elapsed >= 0 && elapsed < MIN_FILL_MS;
}

/**
 * Emails a project enquiry to the team, and confirms it to the sender.
 *
 * Takes FormData rather than a typed object so the form still works before
 * hydration and with JavaScript disabled. Reachable by direct POST like
 * every Server Action, so the checks here are the only checks.
 *
 * Nothing is persisted. Deliberately: Resend keeps a searchable log of
 * every message it accepts, so the only enquiry a database would rescue is
 * one where the API call itself failed, and that case is covered by
 * logging the full payload below. Storing it ourselves would add a
 * dependency, a hosted instance and a PII retention obligation to buy very
 * little. Revisit if lead status, assignment or analytics are ever wanted.
 */
export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // formData.get returns string | File | null. Passing null to z.string()
  // yields a confusing "expected string, received null", so normalise first.
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
  const decoy = String(formData.get(HONEYPOT_FIELD) ?? "");
  const startedAt = String(formData.get(STARTED_AT_FIELD) ?? "");

  // Both bot checks run before validation and before any network call, and
  // both return an indistinguishable success. Returning an error instead
  // would teach the operator exactly what to fix.
  if (decoy.length > 0 || isSuspiciouslyFast(startedAt)) {
    return { status: "success", message: SUCCESS_MESSAGE };
  }

  // Before validation too: a flood of malformed posts should cost us as
  // little as a flood of valid ones.
  const limit = rateLimit(`contact:${await getClientIp()}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.ok) {
    return {
      status: "error",
      message: "That is a lot of messages in a short time. Try again in a few minutes.",
      values,
    };
  }

  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
      // Every field, not just the invalid one: React 19 resets uncontrolled
      // inputs once an action completes, so anything not echoed back is
      // wiped from a form the user has already filled in.
      values,
    };
  }

  const enquiry = { ...parsed.data, receivedAt: new Date() };
  const notification = renderEnquiryNotification(enquiry);

  try {
    const { error } = await resend.emails.send(
      {
        from: `${siteConfig.name} <${env.CONTACT_FROM_EMAIL}>`,
        to: env.CONTACT_TO_EMAIL,
        // So hitting reply in the inbox answers the person, not the site.
        replyTo: enquiry.email,
        subject: notification.subject,
        html: notification.html,
        // Sent alongside the HTML, not instead of it. An HTML-only message
        // is a measurable spam signal, and some clients only render text.
        text: notification.text,
      },
      // Suppresses a duplicate if the same person submits twice in quick
      // succession, or if the request is retried. Keyed on the message too,
      // so a genuine second enquiry from the same address still arrives.
      { idempotencyKey: `contact:${enquiry.email}:${enquiry.message.length}` },
    );

    if (error) {
      console.error("Resend rejected the contact enquiry:", error, "Enquiry was:", enquiry);
      return failure(values);
    }
  } catch (cause) {
    // The enquiry itself goes into the log, not just the error. Without it
    // a Resend outage loses the lead outright, with nothing to recover
    // from. This is the cheap half of what a database would have bought.
    console.error("submitContact failed:", cause, "Enquiry was:", enquiry);
    return failure(values);
  }

  await sendAutoReply(enquiry);

  return { status: "success", message: SUCCESS_MESSAGE };
}

/**
 * Confirms receipt to the person who wrote in. Best effort, never fatal.
 *
 * ORDER MATTERS, AND SO DOES SWALLOWING THE ERROR. The studio notification
 * has already been sent by the time this runs, so the enquiry has
 * genuinely succeeded. Telling someone their message failed because their
 * own confirmation bounced would be a lie, and would probably make them
 * send it again.
 *
 * ⚠️ This is EXPECTED to fail right now. On the Resend test domain
 * (onboarding@resend.dev) only the account owner's own address is a valid
 * recipient, so every real enquirer is a 403. The log line says so, to keep
 * a genuine future failure distinguishable from the known one. It starts
 * working the day popcornadvertising.com is verified, with no code change.
 */
async function sendAutoReply(enquiry: Parameters<typeof renderEnquiryAutoReply>[0]): Promise<void> {
  const reply = renderEnquiryAutoReply(enquiry);

  try {
    const { error } = await resend.emails.send(
      {
        from: `${siteConfig.name} <${env.CONTACT_FROM_EMAIL}>`,
        to: enquiry.email,
        replyTo: siteConfig.contact.email,
        subject: reply.subject,
        html: reply.html,
        text: reply.text,
      },
      // Distinct from the notification's key, or Resend would treat the
      // second send as a duplicate of the first and drop it.
      { idempotencyKey: `contact-reply:${enquiry.email}:${enquiry.message.length}` },
    );

    if (error) {
      console.warn(
        "Auto-reply not delivered (expected until popcornadvertising.com is verified in Resend):",
        error,
      );
    }
  } catch (cause) {
    console.warn("Auto-reply threw (the enquiry itself was delivered):", cause);
  }
}
