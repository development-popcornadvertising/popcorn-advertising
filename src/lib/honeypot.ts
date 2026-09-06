/**
 * Hidden decoy field name, shared so every form uses the same one.
 *
 * Deliberately NOT "company": the contact form has a real `company` field,
 * and reusing that name would make it reject every genuine submission.
 */
export const HONEYPOT_FIELD = "website";

/**
 * Hidden field carrying the moment the form mounted in the browser.
 *
 * Lives here beside the decoy because it is the same concern: a hidden
 * field whose name the form and its Server Action both have to agree on.
 * It cannot live in the action itself, because a `"use server"` module may
 * only export async functions.
 */
export const STARTED_AT_FIELD = "startedAt";
