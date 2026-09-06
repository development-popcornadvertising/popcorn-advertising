import {
  POPCORN_KERNEL,
  POPCORN_PUFFS,
  POPCORN_PUFFS_COMPACT,
  POPCORN_VIEWBOX,
} from "@/lib/brandMark";
import { cn } from "@/lib/cn";

interface PopcornMarkProps {
  /**
   * "compact" is the three-lobe icon variant, which keeps a readable
   * silhouette below about 24px where the seven-puff cluster collapses into
   * a blob. "kernel" is the single lumpy piece the service ticker uses as a
   * separator.
   */
  variant?: "full" | "compact" | "kernel";
  className?: string;
}

const PUFF_SETS = {
  full: POPCORN_PUFFS,
  compact: POPCORN_PUFFS_COMPACT,
  kernel: POPCORN_KERNEL,
} as const;

/**
 * A popped kernel — the brand motif.
 *
 * Overlapping puffs with no container, so it reads as an abstract "pop"
 * rather than a literal box of cinema popcorn. Geometry comes from
 * lib/brandMark so the intro animation and the ticker draw the same shape.
 *
 * Always decorative — the accessible name lives on the wrapping link.
 */
export function PopcornMark({ variant = "full", className }: PopcornMarkProps) {
  const puffs = PUFF_SETS[variant];

  return (
    <svg
      viewBox={`0 0 ${POPCORN_VIEWBOX} ${POPCORN_VIEWBOX}`}
      aria-hidden="true"
      focusable="false"
      className={cn("size-9", className)}
      fill="currentColor"
    >
      {puffs.map((puff) => (
        <circle key={`${puff.cx}-${puff.cy}`} cx={puff.cx} cy={puff.cy} r={puff.r} />
      ))}
    </svg>
  );
}
