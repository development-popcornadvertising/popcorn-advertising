import { POPCORN_PUFFS, POPCORN_VIEWBOX } from "@/lib/brandMark";
import { cn } from "@/lib/cn";

interface PopcornMarkProps {
  className?: string;
}

/**
 * A popped kernel — the brand mark.
 *
 * Overlapping puffs with no container, so it reads as an abstract "pop"
 * rather than a literal box of cinema popcorn. Geometry comes from
 * lib/brandMark so the icon routes and the intro animation draw the same
 * shape.
 *
 * Always decorative — the accessible name lives on the wrapping link.
 */
export function PopcornMark({ className }: PopcornMarkProps) {
  return (
    <svg
      viewBox={`0 0 ${POPCORN_VIEWBOX} ${POPCORN_VIEWBOX}`}
      aria-hidden="true"
      focusable="false"
      className={cn("size-9", className)}
      fill="currentColor"
    >
      {POPCORN_PUFFS.map((puff) => (
        <circle key={`${puff.cx}-${puff.cy}`} cx={puff.cx} cy={puff.cy} r={puff.r} />
      ))}
    </svg>
  );
}
