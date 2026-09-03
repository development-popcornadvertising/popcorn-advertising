import type { FieldErrors } from "./formState";
import type { ZodError } from "zod";

/**
 * First message per field, keyed by the top-level path segment.
 *
 * Kept separate from formState.ts so that a stray value-import from a client
 * component can never drag zod into the browser bundle.
 */
export function toFieldErrors<TField extends string>(error: ZodError): FieldErrors<TField> {
  const result: FieldErrors<TField> = {};

  for (const issue of error.issues) {
    const field = issue.path[0] as TField | undefined;
    if (field && !result[field]) result[field] = issue.message;
  }

  return result;
}
