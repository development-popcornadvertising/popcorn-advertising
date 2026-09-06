"use client";

import { useEffect } from "react";

/**
 * Marks the intro curtain as finished, once per page load.
 *
 * WHY THIS EXISTS. `rise-delay-*` holds the hero back by 1.2s because on a
 * cold load it is waiting for the curtain to lift. The root layout does not
 * remount on a client-side navigation, so there is no second curtain, and
 * every page navigated to was opening with 1.2s of blank hero. Setting a
 * flag on <html> when the curtain actually clears lets `--rise-offset`
 * collapse to zero for every page after the first.
 *
 * It listens on the document rather than holding a ref, so `IntroAnimation`
 * stays a Server Component and none of its fourteen puffs ship as client
 * markup. `animationend` bubbles to the document, and matching on the
 * keyframe name means a marquee or hover animation finishing cannot trip it.
 *
 * Renders nothing. Under reduced motion the curtain is `display: none` and
 * never animates, so the flag is never set, which costs nothing: `rise`
 * does not animate under reduced motion either.
 */
export function IntroComplete() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.intro === "done") return;

    const handleAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName !== "intro-clear") return;
      root.dataset.intro = "done";
      document.removeEventListener("animationend", handleAnimationEnd);
    };

    document.addEventListener("animationend", handleAnimationEnd);
    return () => document.removeEventListener("animationend", handleAnimationEnd);
  }, []);

  return null;
}
