"use client";

import { useEffect, useRef } from "react";

interface CountUpProps {
  /** The finished figure, e.g. "150+" or "9 yrs". Prefix and suffix are kept. */
  value: string;
  /**
   * Milliseconds before counting starts. Left unset it waits for the intro
   * curtain on a cold load and starts almost immediately on any page
   * reached by a client-side navigation, where there is no curtain.
   */
  delay?: number;
  /** Milliseconds the count takes. */
  duration?: number;
  className?: string;
}

/** Splits "150+" into its lead-in, its number and its trailing text. */
function parse(value: string) {
  const match = /^(\D*?)(\d[\d,]*)(.*)$/s.exec(value);
  if (!match) return null;

  const [, prefix = "", digits = "", suffix = ""] = match;
  const target = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(target)) return null;

  const hasSeparators = digits.includes(",");
  return { prefix, suffix, target, hasSeparators };
}

/**
 * Counts a figure up from zero, once, on page load.
 *
 * The finished value is what renders on the server, so the correct number is
 * in the HTML whether or not this ever hydrates. The count is applied
 * afterwards by writing to the DOM directly rather than through state: a
 * 60fps counter driven by `setState` would re-render this subtree on every
 * frame for a string that only the browser ever reads.
 *
 * The figure is laid over an invisible copy of the finished value, which
 * reserves the box. Without it the element grows from the width of "0+" to
 * the width of "150+" as it counts and shoves the rest of the row along with
 * it — a layout shift on first paint, which is exactly what a hero should
 * not do.
 *
 * Under `prefers-reduced-motion` nothing runs at all and the finished value
 * simply stands.
 */
export function CountUp({ value, delay, duration = 1400, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = parse(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || !parsed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Same signal `--rise-offset` uses, and for the same reason: the root
    // layout does not remount on a client-side navigation, so a page reached
    // that way has no curtain to wait for and would otherwise sit on its
    // finished figures for 1.5s before resetting to zero and counting.
    const startDelay = delay ?? (document.documentElement.dataset.intro === "done" ? 150 : 1500);

    const { prefix, suffix, target, hasSeparators } = parsed;
    const format = (n: number) =>
      `${prefix}${hasSeparators ? n.toLocaleString("en-IN") : n}${suffix}`;

    node.textContent = format(0);

    let frame = 0;
    let startedAt = 0;

    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const elapsed = now - startedAt - startDelay;

      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min(1, elapsed / duration);
      // Cubic ease-out: fast off the mark, settling onto the final figure.
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = format(Math.round(target * eased));

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // `value` is the only real input; the parse of it is derived.
  }, [value, delay, duration, parsed]);

  if (!parsed) return <span className={className}>{value}</span>;

  return (
    <span className={`relative inline-block tabular-nums ${className ?? ""}`}>
      {/* Reserves the finished width so nothing reflows while counting. */}
      <span aria-hidden="true" className="invisible">
        {value}
      </span>
      <span ref={ref} className="absolute inset-0">
        {value}
      </span>
    </span>
  );
}
