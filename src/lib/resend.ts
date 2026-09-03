import "server-only";

import { Resend } from "resend";

import { env } from "./env";

/**
 * Shared Resend client.
 *
 * Lives in lib/ rather than inside a feature so that the coming-soon and
 * contact features can both send mail without importing from each other —
 * features never import from features.
 */
export const resend = new Resend(env.RESEND_API_KEY);
