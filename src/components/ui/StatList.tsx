import { cn } from "@/lib/cn";

export interface Stat {
  value: string;
  label: string;
}

interface StatListProps {
  stats: readonly Stat[];
  variant?: "inline" | "cards";
  className?: string;
}

/**
 * Renders stats as a description list: the label is the term, the number
 * is the description. A number is data, not a heading — using <h3> here
 * would pollute the document outline.
 */
export function StatList({ stats, variant = "inline", className }: StatListProps) {
  return (
    <dl
      className={cn(
        variant === "cards"
          ? "grid grid-cols-2 gap-4 md:grid-cols-4"
          : "flex flex-wrap gap-x-12 gap-y-6",
        className,
      )}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={cn(
            "flex flex-col-reverse gap-1",
            variant === "cards" && "rounded-card bg-paper px-6 py-7 text-center",
          )}
        >
          <dt className="text-xs tracking-[0.12em] text-ink-soft uppercase">{stat.label}</dt>
          <dd
            className={cn(
              "font-display text-2xl text-ink",
              variant === "cards" && "text-3xl text-pop",
            )}
          >
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
