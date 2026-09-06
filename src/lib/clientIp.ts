import { headers } from "next/headers";

/**
 * The caller's IP, for rate limiting.
 *
 * `x-forwarded-for` is a comma-separated chain and the LEFTMOST entry is
 * the original client. Everything after it was appended by a proxy. On
 * Vercel the header is set by the platform, so the value cannot be spoofed
 * by the client; behind a different proxy it can be, which is one more
 * reason the limiter this feeds is not treated as real protection.
 *
 * Falls back to a shared bucket rather than throwing. An unknown IP should
 * still be counted, not waved through.
 */
export async function getClientIp(): Promise<string> {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for");

  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return list.get("x-real-ip")?.trim() || "unknown";
}
