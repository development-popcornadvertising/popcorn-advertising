/**
 * A fixed-window rate limiter, held in memory.
 *
 * ⚠️  READ THIS BEFORE RELYING ON IT. The counters live in the process, so
 *     the limit holds within one serverless instance and nowhere else.
 *     Vercel reuses warm instances, so a naive flood from a single address
 *     does get stopped, which is the case this exists for. A distributed
 *     burst walks straight past it.
 *
 *     It is NOT a substitute for the Vercel Firewall rule the README lists
 *     as a launch blocker. That runs at the edge, before the function is
 *     even invoked, which is both cheaper and actually durable.
 *
 *     The durable in-process alternative is Upstash Redis: a tenth runtime
 *     dependency plus credentials, which AGENTS.md says needs a written
 *     reason. "Catches naive floods slightly better" is not that reason.
 *
 * Fixed window rather than sliding: a sliding window needs the timestamp of
 * every hit, and this only needs to know whether someone is hammering it.
 */

interface Window {
  count: number;
  /** Epoch ms at which this window expires. */
  resetAt: number;
}

const windows = new Map<string, Window>();

/** How often to sweep expired entries, in number of calls. */
const SWEEP_EVERY = 200;
let callsSinceSweep = 0;

/**
 * Drops expired windows so the map cannot grow without bound.
 *
 * Amortised rather than scheduled: a setInterval would keep a serverless
 * instance's event loop alive and has nothing to tear it down.
 */
function sweep(now: number): void {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the caller may try again. Zero when `ok`. */
  retryAfter: number;
}

/**
 * Records a hit against `key` and reports whether it is allowed.
 *
 * @param key    Usually an IP address. Callers namespace it per form.
 * @param limit  Hits permitted per window.
 * @param windowMs Window length in milliseconds.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();

  if (++callsSinceSweep >= SWEEP_EVERY) {
    callsSinceSweep = 0;
    sweep(now);
  }

  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return { ok: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  return { ok: true, retryAfter: 0 };
}

/** Test seam. Never call this from application code. */
export function __resetRateLimits(): void {
  windows.clear();
  callsSinceSweep = 0;
}
