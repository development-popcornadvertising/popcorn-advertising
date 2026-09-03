import { PopcornMark } from "@/components/ui/PopcornMark";
import { siteConfig } from "@/lib/siteConfig";

type PuffTone = "cream" | "butter" | "paper";

interface ScatteredPuff {
  /** Viewport position, in percent. */
  left: number;
  top: number;
  /** Rendered size in rem. */
  size: number;
  tone: PuffTone;
}

/**
 * Hand-placed rather than randomised, for two reasons: a random scatter
 * clumps and leaves holes, and the middle of the screen has to stay clear
 * for the wordmark. Positions avoid a rough box around the centre.
 */
const SCATTER: readonly ScatteredPuff[] = [
  { left: 8, top: 17, size: 3.4, tone: "cream" },
  { left: 21, top: 7, size: 2.1, tone: "butter" },
  { left: 33, top: 25, size: 1.5, tone: "cream" },
  { left: 14, top: 45, size: 2.6, tone: "paper" },
  { left: 6, top: 71, size: 3.0, tone: "cream" },
  { left: 25, top: 83, size: 1.8, tone: "butter" },
  { left: 39, top: 63, size: 1.3, tone: "cream" },
  { left: 57, top: 13, size: 2.3, tone: "cream" },
  { left: 71, top: 29, size: 3.2, tone: "butter" },
  { left: 87, top: 15, size: 1.9, tone: "cream" },
  { left: 92, top: 51, size: 2.8, tone: "paper" },
  { left: 65, top: 74, size: 2.2, tone: "cream" },
  { left: 81, top: 86, size: 1.5, tone: "butter" },
  { left: 49, top: 91, size: 2.0, tone: "cream" },
];

const TONE_CLASS: Record<PuffTone, string> = {
  cream: "text-cream",
  butter: "text-butter",
  paper: "text-paper",
};

/** Pops radiate outward from the centre rather than in array order. */
function burstDelay({ left, top }: ScatteredPuff): number {
  const distance = Math.hypot(left - 50, top - 50);
  return 0.05 + (distance / 70) * 0.5;
}

/**
 * The launch intro: a dark screen, popcorn bursting across it, then the
 * curtain wipes up to reveal the page.
 *
 * Ink rather than cream as the ground. A dark screen is what a cinema does
 * before the film starts, which is the association an agency called Popcorn
 * should be trading on, and cream puffs only read as popcorn against
 * something dark.
 *
 * Four constraints, because an intro animation is the easiest place on a
 * site to do real damage:
 *
 * 1. Server-rendered markup with a pure-CSS timeline. The exit is a
 *    keyframe with `forwards` fill, so it dismisses itself even if
 *    JavaScript never runs. Nothing can leave a visitor stuck behind it.
 * 2. `pointer-events-none` and `aria-hidden`. It never intercepts a click
 *    and never reaches a screen reader. The real page is already painted
 *    underneath and is immediately usable.
 * 3. 1.94s total, under WCAG 2.2.2's five-second threshold, so no pause
 *    control is required. `prefers-reduced-motion` removes it entirely.
 * 4. No layout dependency. Everything is positioned in percentages against
 *    the viewport, so nothing here can shift the page beneath it.
 */
export function IntroAnimation() {
  return (
    <div
      aria-hidden="true"
      className="intro pointer-events-none fixed inset-0 z-50 overflow-hidden bg-ink"
    >
      {SCATTER.map((puff) => (
        <div
          key={`${puff.left}-${puff.top}`}
          className={`intro-puff absolute ${TONE_CLASS[puff.tone]}`}
          // Position, size and stagger are all computed per puff, so they
          // belong in style rather than in fourteen bespoke classes.
          style={{
            left: `${puff.left}%`,
            top: `${puff.top}%`,
            width: `${puff.size}rem`,
            height: `${puff.size}rem`,
            marginLeft: `-${puff.size / 2}rem`,
            marginTop: `-${puff.size / 2}rem`,
            animationDelay: `${burstDelay(puff)}s`,
          }}
        >
          <PopcornMark className="size-full" />
        </div>
      ))}

      <div className="absolute inset-0 grid place-items-center">
        <p className="intro-word text-center font-display text-3xl leading-tight text-cream md:text-5xl">
          Popcorn
          <span className="mt-1 block text-base font-normal text-butter md:text-lg">
            {siteConfig.tagline}
          </span>
        </p>
      </div>
    </div>
  );
}
