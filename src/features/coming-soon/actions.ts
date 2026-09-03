"use server";

import { env } from "@/lib/env";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
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

  const parsed = notifySchema.safeParse({ email });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted field.",
      fieldErrors: toFieldErrors(parsed.error),
      values: { email },
    };
  }

  try {
    const { error } = await resend.emails.send(
      {
        from: `${siteConfig.name} <${env.CONTACT_FROM_EMAIL}>`,
        to: env.CONTACT_TO_EMAIL,
        replyTo: parsed.data.email,
        subject: `Launch list signup: ${parsed.data.email}`,
        text: [
          "New launch-notify signup.",
          "",
          `Email: ${parsed.data.email}`,
          `When:  ${new Date().toISOString()}`,
        ].join("\n"),
      },
      // Suppresses a duplicate email if the same address is submitted twice
      // in quick succession, or if the request is retried.
      { idempotencyKey: `notify:${parsed.data.email}` },
    );

    if (error) {
      console.error("Resend rejected the notify signup:", error);
      return failure(parsed.data.email);
    }

    return { status: "success", message: SUCCESS_MESSAGE };
  } catch (cause) {
    console.error("subscribeToLaunch failed:", cause);
    return failure(parsed.data.email);
  }
}
