import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface FilterChipProps {
  children: ReactNode;
  /** Whether this chip is the one currently applied. */
  isActive?: boolean;
  onSelect?: () => void;
  className?: string;
}

/**
 * A toggleable pill in a filter row.
 *
 * NOT A `Button`. `Button` is the page's call to action: it carries a hard
 * offset slab shadow and a press choreography that reads as "this does
 * something big". A row of eight of those would shout louder than the work
 * they filter, and the active one would be indistinguishable from the CTA
 * in the header. This is the quiet counterpart, sharing only `rounded-pill`.
 *
 * `aria-pressed` rather than `role="radio"`. Only one filter applies at a
 * time, so a radiogroup is arguably the more precise semantic, but it is
 * only *correct* with arrow-key roving tabindex, and that is JavaScript
 * this page does not otherwise need. A plain button is already reachable
 * with Tab and operable with Enter and Space, and `aria-pressed` states
 * which one is on.
 *
 * The caller owns the group: wrap a row in
 * `role="group"` with an `aria-label`, and follow it with a polite live
 * region, or a screen reader hears nothing when the results change.
 */
export function FilterChip({ children, isActive = false, onSelect, className }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onSelect}
      className={cn(
        "inline-flex h-10 shrink-0 items-center rounded-pill px-5",
        "text-[0.9375rem] leading-none font-medium",
        // Only colours transition. The chip does not lift or scale: a row of
        // them moving under the cursor reads as instability, not feedback.
        "transition-[background-color,border-color,color] duration-200 ease-soft",
        isActive
          ? "border border-pop bg-pop text-white"
          : "border border-grape-tint bg-paper text-ink hover:border-grape hover:text-grape",
        className,
      )}
    >
      {children}
    </button>
  );
}
