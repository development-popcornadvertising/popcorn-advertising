import { MarqueeTrack } from "@/components/ui/MarqueeTrack";
import { PopcornMark } from "@/components/ui/PopcornMark";
import { cn } from "@/lib/cn";

interface MarqueeProps {
  /**
   * Text to scroll. Passed in rather than imported so this stays in
   * components/layout — layout components never import feature data.
   */
  items: readonly string[];
  className?: string;
}

/**
 * Decorative scrolling strip.
 *
 * The whole element is aria-hidden: the same list appears as real content
 * elsewhere on the page, and a screen reader announcing an endless loop of
 * duplicated words would be actively hostile. Motion stops for users who
 * prefer reduced motion.
 */
export function Marquee({ items, className }: MarqueeProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("overflow-hidden bg-pop py-3.5 text-white select-none", className)}
    >
      <MarqueeTrack className="flex w-max animate-marquee motion-safe-only">
        {/* TWO THINGS MAKE THIS LOOP CLEANLY, and both were bugs first.
            
            The trailing `pr-8` matches the inner `gap-8`, and the track
            itself carries no gap. Otherwise -50% advances by one list plus
            half a gap and the loop jumps once per cycle.

            And the list is rendered four times, not twice. The translate is
            half the track, so with two copies the step equals one list — and
            when a list is narrower than the viewport the track's far end
            scrolls into shot, leaving a blank strip once per cycle. Four
            copies put two lists in every step, which is wider than any
            plausible screen. The count must stay even, or the step no longer
            lands on a whole list and the seam comes back. */}
        {[0, 1, 2, 3].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center gap-8 pr-8">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-8 whitespace-nowrap">
                <span className="text-lg">{item}</span>
                {/* The comp separates items with a popcorn kernel. Drawn from
                    the shared brand geometry rather than the 23px raster the
                    client supplied, so it stays sharp at any density. */}
                <PopcornMark variant="kernel" className="size-5 shrink-0 text-butter" />
              </li>
            ))}
          </ul>
        ))}
      </MarqueeTrack>
    </div>
  );
}
