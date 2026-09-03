import { z } from "zod";

import type { FormState } from "@/lib/formState";

export const notifySchema = z.object({
  // Normalise before validating, so " Foo@Bar.com " is accepted and stored
  // lowercase. That also makes the idempotency key stable across retries.
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "That email address is too long")
    .pipe(z.email("Enter a valid email address")),
});

export type NotifyInput = z.infer<typeof notifySchema>;
export type NotifyFormState = FormState<keyof NotifyInput>;
