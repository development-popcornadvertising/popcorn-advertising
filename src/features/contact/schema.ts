import { z } from "zod";

import type { FormState } from "@/lib/formState";

/**
 * The enquiry form's shape.
 *
 * The honeypot is deliberately absent. It is checked in the action before
 * parsing, so a filled decoy never reaches validation and never costs a
 * round trip to Resend.
 *
 * zod v4 syntax throughout: `z.email()` at the top level, not the
 * deprecated `z.string().email()` chain.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tell us what to call you")
    .max(80, "That name is too long for the form"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "That email address is too long")
    .pipe(z.email("Enter a valid email address")),
  company: z
    .string()
    .trim()
    .min(1, "Tell us which brand this is for")
    .max(120, "That company name is too long for the form"),
  message: z
    .string()
    .trim()
    .min(10, "A sentence or two is plenty, but we need a little more than this")
    .max(2000, "Keep it under 2000 characters and we can pick up the detail on a call"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactFormState = FormState<keyof ContactInput>;
