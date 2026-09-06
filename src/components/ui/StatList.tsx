import { cn } from "@/lib/cn";

import { CountUp } from "./CountUp";

export interface Stat {
  value: string;
  label: string;
}

interface StatListProps {
  stats: readonly Stat[];
  variant?: "inline" | "cards";
  /**
   * Counts each figure up from zero once on load. Opt-in: it is a hero
   * flourish, not something every stat list should do.
   */
  hasCountUp?: boolean;
  className?: string;
}

/**
 * Renders stats as a description list: the label is the term, the number
 * is the description. A number is data, not a heading — using <h3> here
 * would pollute the document outline.
 *
 * `flex-col-reverse` puts the figure above its label visually while keeping
 * <dt> before <dd> in the DOM, which is the order a screen reader needs.
 */
export function StatList({
  stats,
  variant = "inline",
  hasCountUp = false,
  className,
}: StatListProps) {
  return (
    <dl
      className={cn(
        variant === "cards"
          ? "grid grid-cols-2 gap-4 md:grid-cols-4"
          : "flex flex-wrap gap-x-10 gap-y-6 sm:gap-x-16",
        className,
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "flex flex-col-reverse gap-1",
            // Paper on cream is a near-invisible edge, so the card needs a
            // shadow to exist at all. Same resting shadow as ServiceCard.
            variant === "cards" &&
              "rounded-card bg-paper px-6 py-7 text-center shadow-[0_2px_4px_-2px_rgb(60_54_52_/_0.06),0_8px_20px_-10px_rgb(60_54_52_/_0.12)]",
          )}
        >
          <dt className="text-sm text-ink-soft uppercase">{stat.label}</dt>
          <dd
            className={cn(
              "font-display text-2xl font-extrabold text-ink",
              variant === "cards" && "text-pop",
            )}
          >
            {hasCountUp ? <CountUp value={stat.value} /> : stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
