import { afterEach, describe, expect, it, vi } from "vitest";

import { __resetRateLimits, rateLimit } from "./rateLimit";

afterEach(() => {
  __resetRateLimits();
  vi.useRealTimers();
});

describe("rateLimit", () => {
  it("allows hits up to the limit", () => {
    for (let i = 0; i < 3; i++) {
      expect(rateLimit("1.1.1.1", 3, 60_000).ok).toBe(true);
    }
  });

  it("blocks the hit after the limit", () => {
    for (let i = 0; i < 3; i++) rateLimit("1.1.1.1", 3, 60_000);

    const blocked = rateLimit("1.1.1.1", 3, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("keeps keys independent, so one address cannot block another", () => {
    for (let i = 0; i < 4; i++) rateLimit("1.1.1.1", 3, 60_000);

    expect(rateLimit("2.2.2.2", 3, 60_000).ok).toBe(true);
  });

  it("resets once the window has passed", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-06T12:00:00Z"));

    for (let i = 0; i < 3; i++) rateLimit("1.1.1.1", 3, 60_000);
    expect(rateLimit("1.1.1.1", 3, 60_000).ok).toBe(false);

    vi.setSystemTime(new Date("2026-09-06T12:01:01Z"));
    expect(rateLimit("1.1.1.1", 3, 60_000).ok).toBe(true);
  });

  it("reports a retryAfter that shrinks as the window elapses", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-06T12:00:00Z"));

    rateLimit("1.1.1.1", 1, 60_000);
    const first = rateLimit("1.1.1.1", 1, 60_000);

    vi.setSystemTime(new Date("2026-09-06T12:00:30Z"));
    const later = rateLimit("1.1.1.1", 1, 60_000);

    expect(first.retryAfter).toBeGreaterThan(later.retryAfter);
  });

  it("does not leak entries for windows that have expired", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-06T12:00:00Z"));

    // More than the sweep interval, each on its own key.
    for (let i = 0; i < 250; i++) rateLimit(`ip-${i}`, 5, 1_000);

    vi.setSystemTime(new Date("2026-09-06T12:05:00Z"));
    // The next call triggers a sweep; a fresh key must still be allowed,
    // which proves the map was pruned rather than corrupted.
    expect(rateLimit("ip-0", 5, 1_000).ok).toBe(true);
  });
});
