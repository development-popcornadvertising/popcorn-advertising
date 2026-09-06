import "server-only";

import { z } from "zod";

/**
 * Server-side environment, validated once at module load.
 *
 * A missing or malformed value fails the build with a readable message
 * rather than silently at 2am when someone submits a form.
 *
 * SITE_MODE deliberately lives in src/lib/siteMode.ts instead: next.config.ts
 * needs to read it, and cannot import this module because `server-only`
 * throws outside the react-server bundler condition.
 */
const envSchema = z.object({
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  CONTACT_TO_EMAIL: z.email(),
  CONTACT_FROM_EMAIL: z.email(),
  NEXT_PUBLIC_SITE_URL: z.url(),

  /**
   * Signing secret for the Resend webhook, from the dashboard.
   *
   * Optional on purpose: the endpoint exists before the webhook is
   * configured, and requiring it would fail every build until someone
   * pastes it in. The route refuses to process anything while it is
   * absent rather than accepting unverified payloads.
   */
  RESEND_WEBHOOK_SECRET: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map(
    (issue) => `  • ${issue.path.join(".") || "(root)"}: ${issue.message}`,
  );
  throw new Error(`Invalid environment variables:\n${issues.join("\n")}`);
}

export const env = parsed.data;
