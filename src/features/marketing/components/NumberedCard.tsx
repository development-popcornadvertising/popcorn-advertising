import { cn } from "@/lib/cn";

/**
 * What a numbered card needs. Declared here rather than imported from one
 * feature's data file, because two sections now use this card and neither
 * should own the other's type.
 */
export interface NumberedItem {
  id: string;
  title: string;
  description: string;
}

interface NumberedCardProps {
  item: NumberedItem;
  /** Position in the list, used for the badge. */
  index: number;
  className?: string;
}

/**
 * A numbered card: an index badge, a title and a line of copy.
 *
 * Used by the process steps and by "what we believe". Both are ordered
 * lists, which is what makes the shared badge honest.
 *
 * The badge is `aria-hidden`. The parent <ol> already tells a screen reader
 * these run in sequence, so announcing "1" before "Listen and scope" would
 * say it twice.
 *
 * Surface and hover are `ServiceCard`'s, for the reasons recorded there:
 * only `transform` and `opacity` animate, and the deeper shadow lives on
 * its own cross-faded layer rather than being transitioned on `box-shadow`,
 * which repaints a large blur every frame.
 */
export function NumberedCard({ item, index, className }: NumberedCardProps) {
  return (
    <li
      className={cn(
        "group/card relative isolate flex flex-col gap-4 rounded-card bg-paper p-7",
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
          "transition-opacity duration-300 ease-soft group-hover/step:opacity-100",
        )}
      />

      <span
        aria-hidden="true"
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-pill",
          "font-display text-lg font-extrabold tabular-nums",
          "bg-pop/10 text-pop transition-colors duration-300 ease-soft",
          "group-hover/step:bg-pop group-hover/step:text-white",
        )}
      >
        {index + 1}
      </span>

      <h3 className="text-xl leading-snug font-bold text-balance text-ink">{item.title}</h3>

      <p className="text-base leading-snug text-ink-soft">{item.description}</p>
    </li>
  );
}
