"use server";

import { env } from "@/lib/env";
import { HONEYPOT_FIELD, STARTED_AT_FIELD } from "@/lib/honeypot";
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
 * Emails a project enquiry to the team.
 *
 * Takes FormData rather than a typed object so the form still works before
 * hydration and with JavaScript disabled. Reachable by direct POST like
 * every Server Action, so the checks here are the only checks.
 *
 * Nothing is persisted. If a CRM is wanted later, add the write here and no
 * caller changes.
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

  const { name, email, company, message } = parsed.data;

  try {
    const { error } = await resend.emails.send(
      {
        from: `${siteConfig.name} <${env.CONTACT_FROM_EMAIL}>`,
        to: env.CONTACT_TO_EMAIL,
        // So hitting reply in the inbox answers the person, not the site.
        replyTo: email,
        subject: `New enquiry: ${company}`,
        text: [
          "New project enquiry from the website.",
          "",
          `Name:    ${name}`,
          `Email:   ${email}`,
          `Company: ${company}`,
          `When:    ${new Date().toISOString()}`,
          "",
          "Message:",
          message,
        ].join("\n"),
      },
      // Suppresses a duplicate if the same person submits twice in quick
      // succession, or if the request is retried. Keyed on the message too,
      // so a genuine second enquiry from the same address still arrives.
      { idempotencyKey: `contact:${email}:${message.length}` },
    );

    if (error) {
      console.error("Resend rejected the contact enquiry:", error);
      return failure(values);
    }

    return { status: "success", message: SUCCESS_MESSAGE };
  } catch (cause) {
    console.error("submitContact failed:", cause);
    return failure(values);
  }
}
