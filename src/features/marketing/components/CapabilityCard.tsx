import { cn } from "@/lib/cn";

import type { Capability, CapabilityTone } from "../data/capabilities";

interface CapabilityCardProps {
  capability: Capability;
  className?: string;
}

/**
 * Cover colour and label colour, kept in one entry each so the two can
 * never be set separately.
 *
 * Butter takes ink, not white. White on butter is about 1.3:1 and simply
 * cannot be read. Pop on white is 4.55:1: it clears the 4.5 floor for this
 * small uppercase label, but with nothing to spare, so pop must not be
 * lightened.
 */
const toneStyles: Record<CapabilityTone, string> = {
  pop: "bg-pop text-white",
  grape: "bg-grape text-white",
  butter: "bg-butter text-ink",
};

/**
 * One service on the work page.
 *
 * Not a link, and deliberately not focusable: there is nowhere for it to go.
 * A card that takes a tab stop and then does nothing is worse than no
 * affordance at all.
 *
 * NO `overflow-hidden` ON THE ROOT. Clipping the cover to the card's top
 * corners that way silently kills the hover: the lift shadow lives on an
 * absolutely positioned sibling that extends *past* the card's bounds, and
 * an overflow clip erases exactly the part that shows. The cover rounds its
 * own top corners instead.
 */
export function CapabilityCard({ capability, className }: CapabilityCardProps) {
  return (
    <li
      className={cn(
        "group/card relative isolate flex flex-col rounded-card bg-paper",
        "shadow-[0_2px_4px_-2px_rgb(60_54_52_/_0.06),0_8px_20px_-10px_rgb(60_54_52_/_0.12)]",
        "transition-transform duration-300 ease-soft motion-safe:hover:-translate-y-1.5",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 rounded-card opacity-0",
          "shadow-[0_6px_12px_-4px_rgb(88_85_165_/_0.14),0_22px_44px_-16px_rgb(88_85_165_/_0.4)]",
          "transition-opacity duration-300 ease-soft group-hover/card:opacity-100",
        )}
      />

      <div
        className={cn(
          "grid h-36 place-items-center rounded-t-card sm:h-40",
          "text-[0.8125rem] leading-none font-bold tracking-[0.16em] uppercase",
          toneStyles[capability.tone],
        )}
      >
        {capability.cover}
      </div>

      <div className="flex flex-col gap-2 p-6">
        <h3 className="text-xl leading-snug font-bold text-balance text-ink">{capability.title}</h3>
        <p className="text-base leading-snug text-ink-soft">{capability.description}</p>
      </div>
    </li>
  );
}
