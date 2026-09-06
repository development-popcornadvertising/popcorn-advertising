"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface MarqueeTrackProps {
  children: ReactNode;
  className?: string;
}

/** Milliseconds the strip takes to coast to a stop, and to pick back up. */
const RAMP = 420;

/**
 * The scrolling track of a marquee, with a hover that eases rather than snaps.
 *
 * WHY THIS IS A CLIENT COMPONENT. Pausing on hover used to be
 * `hover:[animation-play-state:paused]`, which is binary: the strip stopped
 * dead mid-glide and jumped back to full speed on leave. CSS has no way to
 * ease that — `animation-duration` and `play-state` are not transitionable
 * properties, and changing the duration mid-flight makes the position jump
 * because progress is proportional to it.
 *
 * The Web Animations API can: `playbackRate` on the running CSS animation,
 * ramped from 1 to 0 over a few frames, decelerates the strip. So
 * this is the smallest possible client leaf — it owns the two pointer
 * handlers and nothing else, and the markup it wraps stays server-rendered.
 *
 * Under reduced motion the `motion-safe-only` utility sets `animation: none`,
 * so `getAnimations()` comes back empty and both handlers no-op. Nothing to
 * special-case.
 */
export function MarqueeTrack({ children, className }: MarqueeTrackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const rampTo = (target: number) => {
    const node = ref.current;
    if (!node) return;

    const animations = node.getAnimations();
    if (animations.length === 0) return;

    cancelAnimationFrame(frame.current);

    const from = animations[0]?.playbackRate ?? 1;
    if (from === target) return;

    let startedAt = 0;
    const step = (now: number) => {
      if (!startedAt) startedAt = now;
      const progress = Math.min(1, (now - startedAt) / RAMP);
      // Cubic ease-out: sheds most of the speed early, then settles.
      const eased = 1 - Math.pow(1 - progress, 3);
      const rate = from + (target - from) * eased;

      // The plain setter, not `updatePlaybackRate`: that one schedules a
      // *pending* rate that commits when the animation is next ready, so
      // per-frame calls to it never land. The setter applies immediately
      // and preserves currentTime, which is what a speed ramp needs.
      for (const animation of animations) animation.playbackRate = rate;
      if (progress < 1) frame.current = requestAnimationFrame(step);
    };

    frame.current = requestAnimationFrame(step);
  };

  return (
    <div
      ref={ref}
      className={className}
      onPointerEnter={() => rampTo(0)}
      onPointerLeave={() => rampTo(1)}
    >
      {children}
    </div>
  );
}
