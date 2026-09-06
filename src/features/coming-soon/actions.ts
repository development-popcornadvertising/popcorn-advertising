"use server";

import { getClientIp } from "@/lib/clientIp";
import { renderLaunchNotification } from "@/lib/email/templates/launchNotification";
import { env } from "@/lib/env";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import { rateLimit } from "@/lib/rateLimit";
import { resend } from "@/lib/resend";
import { siteConfig } from "@/lib/siteConfig";
import { toFieldErrors } from "@/lib/zodErrors";

import { notifySchema, type NotifyFormState } from "./schema";

const SUCCESS_MESSAGE = "You're on the list. We'll email you the moment we launch.";

const failure = (email: string): NotifyFormState => ({
  status: "error",
  message: `Something went wrong on our end. Email us at ${siteConfig.contact.email} and we'll add you manually.`,
  values: { email },
});

/**
 * Records a launch-notify signup by emailing it to the team.
 *
 * Takes FormData rather than a typed object so the form still works before
 * hydration and with JavaScript disabled. Reachable by direct POST like
 * every Server Action, so the checks here are the only checks.
 *
 * Nothing is persisted. If a real mailing list is wanted later, add the
 * write here — no caller changes.
 */
export async function subscribeToLaunch(
  _prevState: NotifyFormState,
  formData: FormData,
): Promise<NotifyFormState> {
  // formData.get returns string | File | null. Passing null to z.string()
  // yields a confusing "expected string, received null", so normalise first.
  const email = String(formData.get("email") ?? "");
  const decoy = String(formData.get(HONEYPOT_FIELD) ?? "");

  // Honeypot before validation and before any network call: a bot that fills
  // in everything gets an indistinguishable success and costs us nothing.
  // Returning an error instead would teach its operator to fix the bot.
  if (decoy.length > 0) return { status: "success", message: SUCCESS_MESSAGE };

  // Before validation: a flood of malformed posts should cost us as little
  // as a flood of valid ones. In-memory, so it holds within one warm
  // instance only. See src/lib/rateLimit.ts for exactly what that is worth.
  const limit = rateLimit(`notify:${await getClientIp()}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return {
      status: "error",
      message: "That is a lot of attempts in a short time. Try again in a few minutes.",
      values: { email },
    };
  }

  const parsed = notifySchema.safeParse({ email });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted field.",
      fieldErrors: toFieldErrors(parsed.error),
      values: { email },
    };
  }

  const notification = renderLaunchNotification({
    email: parsed.data.email,
    receivedAt: new Date(),
  });

  try {
    const { error } = await resend.emails.send(
      {
        from: `${siteConfig.name} <${env.CONTACT_FROM_EMAIL}>`,
        to: env.CONTACT_TO_EMAIL,
        replyTo: parsed.data.email,
        subject: notification.subject,
        html: notification.html,
        // Alongside the HTML, not instead of it: an HTML-only message is a
        // measurable spam signal, and some clients only render text.
        text: notification.text,
      },
      // Suppresses a duplicate email if the same address is submitted twice
      // in quick succession, or if the request is retried.
      { idempotencyKey: `notify:${parsed.data.email}` },
    );

    if (error) {
      console.error("Resend rejected the notify signup:", error, "Email was:", parsed.data.email);
      return failure(parsed.data.email);
    }

    return { status: "success", message: SUCCESS_MESSAGE };
  } catch (cause) {
    console.error("subscribeToLaunch failed:", cause, "Email was:", parsed.data.email);
    return failure(parsed.data.email);
  }
}
