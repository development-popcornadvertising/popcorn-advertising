import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifies a Resend webhook signature.
 *
 * Resend signs through Svix. The scheme is an HMAC-SHA256 over
 * `${id}.${timestamp}.${body}`, keyed by the base64 portion of a secret
 * that arrives prefixed `whsec_`, with the result base64 encoded and sent
 * in `svix-signature` as one or more space-separated `v1,<sig>` pairs.
 * Several may be present at once during a secret rotation, so any match
 * counts.
 *
 * The `svix` package does this too, and would be a tenth runtime
 * dependency for about fifteen lines of `node:crypto`.
 *
 * THREE THINGS THIS HAS TO GET RIGHT, and each is a real vulnerability if
 * skipped:
 *
 * 1. Sign the RAW body text, exactly as received. Parsing the JSON and
 *    re-serialising it changes key order and whitespace, and then every
 *    signature fails for reasons that look like a Resend bug.
 * 2. Compare with `timingSafeEqual`. A `===` on the signature leaks it a
 *    byte at a time to anyone who can measure the response.
 * 3. Enforce a timestamp tolerance. Without it, a request captured once
 *    can be replayed against the endpoint forever.
 */

/** How far out of date a signed request may be, in seconds. */
const TOLERANCE_SECONDS = 300;

export interface SignedRequest {
  id: string | null;
  timestamp: string | null;
  signature: string | null;
  /** The body exactly as received, unparsed. */
  rawBody: string;
}

export type VerifyResult =
  { ok: true } | { ok: false; reason: "missing-headers" | "stale-timestamp" | "bad-signature" };

/** Constant-time compare of two base64 signatures. */
function matches(expected: string, candidate: string): boolean {
  const a = Buffer.from(expected, "base64");
  const b = Buffer.from(candidate, "base64");

  // timingSafeEqual throws on a length mismatch, which would itself be a
  // timing signal, so the lengths are checked first and deliberately.
  if (a.length !== b.length || a.length === 0) return false;
  return timingSafeEqual(a, b);
}

/**
 * @param secret The `whsec_`-prefixed signing secret from the Resend dashboard.
 * @param now    Injected for testing the replay window.
 */
export function verifyWebhookSignature(
  { id, timestamp, signature, rawBody }: SignedRequest,
  secret: string,
  now: Date = new Date(),
): VerifyResult {
  if (!id || !timestamp || !signature) return { ok: false, reason: "missing-headers" };

  const sentAt = Number(timestamp);
  if (!Number.isFinite(sentAt)) return { ok: false, reason: "stale-timestamp" };

  const driftSeconds = Math.abs(Math.floor(now.getTime() / 1000) - sentAt);
  if (driftSeconds > TOLERANCE_SECONDS) return { ok: false, reason: "stale-timestamp" };

  // The secret is base64 after the prefix. A secret pasted without the
  // prefix still works, which is a common copy-paste slip.
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");

  const expected = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest("base64");

  // "v1,<sig> v1,<sig>" during a rotation. Any one matching is enough.
  const candidates = signature
    .split(" ")
    .map((part) => part.split(",")[1])
    .filter((part): part is string => Boolean(part));

  const valid = candidates.some((candidate) => matches(expected, candidate));

  return valid ? { ok: true } : { ok: false, reason: "bad-signature" };
}
