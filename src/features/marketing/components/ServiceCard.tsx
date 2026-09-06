import { cn } from "@/lib/cn";

import type { Service } from "../data/services";

interface ServiceCardProps {
  service: Service;
  /** Position in the grid, used for the corner index. */
  index: number;
  className?: string;
}

/**
 * One of the twelve discipline cards.
 *
 * Not a link, and deliberately not focusable: there is nowhere for it to
 * go. Making a card interactive that does nothing adds a tab stop that
 * leads nowhere, which is worse than no affordance at all.
 *
 * LAYOUT. The chip pins to the top and the title to the bottom. Two earlier
 * attempts were worse. A hard title measure copied off the comp's 255px card
 * reproduced its two-line break at exactly one width and left every wider
 * card looking two-thirds empty. Stacking chip and title from the top left
 * the gap *under* the title, so a single-line card read as clipped — and
 * grid rows stretch to their tallest card, so most were single-line cards
 * carrying a two-line card's height. Pushing the title to the bottom puts
 * that slack in the middle, where it reads as breathing room and every card
 * in a row lines up on the same baseline.
 *
 * WEIGHT. This card used to carry a 3px grape border, a solid grape chip and
 * a grape title. Twelve of those built a wall of purple boxes that
 * outshouted the section heading. The surface is now plain paper on a soft
 * shadow and the title is ink, so the colour is spent on one small element
 * per card instead of three large ones. The corner index gives the grid
 * some editorial structure without adding another block of colour.
 *
 * SMOOTHNESS. Only `transform` and `opacity` are animated. The lift used to
 * transition `box-shadow` directly, which repaints a large blurred shadow
 * every frame across twelve cards at once and is what made the hover feel
 * gritty. The deeper shadow now lives on its own layer and cross-fades, so
 * the browser composites it instead of repainting it. The chip's easing is
 * a plain ease-out too: an overshoot curve on a colour change reads as a
 * wobble rather than as bounce.
 */
export function ServiceCard({ service, index, className }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <li
      className={cn(
        "group/card relative isolate flex min-h-42 flex-col justify-between gap-5",
        "rounded-card bg-paper p-6",
        "shadow-[0_2px_4px_-2px_rgb(60_54_52_/_0.06),0_8px_20px_-10px_rgb(60_54_52_/_0.12)]",
        "transition-transform duration-300 ease-soft motion-safe:hover:-translate-y-1.5",
        className,
      )}
    >
      {/* The hover shadow as its own layer, cross-faded rather than
          transitioned on `box-shadow`. See the note above. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 rounded-card opacity-0",
          "shadow-[0_6px_12px_-4px_rgb(88_85_165_/_0.14),0_22px_44px_-16px_rgb(88_85_165_/_0.4)]",
          "transition-opacity duration-300 ease-soft group-hover/card:opacity-100",
        )}
      />

      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-2xl",
            "bg-grape/12 text-grape",
            "transition-[background-color,color,transform] duration-300 ease-soft",
            "group-hover/card:bg-grape group-hover/card:text-white",
            "motion-safe:group-hover/card:scale-105",
          )}
        >
          <Icon className="size-6" aria-hidden="true" />
        </span>

        <span
          aria-hidden="true"
          className={cn(
            "text-xs font-semibold tracking-[0.14em] text-grape/25 tabular-nums",
            "transition-colors duration-300 ease-soft group-hover/card:text-grape/70",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="text-xl leading-snug font-bold text-balance text-ink">{service.title}</h3>
    </li>
  );
}
