/**
 * Hidden decoy field name, shared so every form uses the same one.
 *
 * Deliberately NOT "company": the contact form has a real `company` field,
 * and reusing that name would make it reject every genuine submission.
 */
export const HONEYPOT_FIELD = "website";
