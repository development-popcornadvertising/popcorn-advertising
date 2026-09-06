import { cn } from "@/lib/cn";

import type { Project, ProjectTone } from "../data/projects";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

/**
 * Cover colour and label colour, kept in one entry each so the two can
 * never be set separately.
 *
 * Butter takes ink, not white. White on butter is about 1.3:1 and simply
 * cannot be read, which is why the comp draws that one dark. Pop on white
 * is 4.55:1: it clears the 4.5 floor for this small uppercase label, but
 * with nothing to spare, so pop must not be lightened.
 */
const toneStyles: Record<ProjectTone, string> = {
  pop: "bg-pop text-white",
  grape: "bg-grape text-white",
  butter: "bg-butter text-ink",
};

/**
 * One project in the work grid.
 *
 * Not a link, and deliberately not focusable. There are no case-study pages
 * behind these yet, and `ServiceCard` settles the rule: a card that takes a
 * tab stop and then goes nowhere is worse than no affordance at all. When
 * `/work/:slug` ships, this becomes a link and the hover finally means
 * something.
 *
 * NO `overflow-hidden` ON THE ROOT. Clipping the cover to the card's top
 * corners with `rounded-card overflow-hidden` here is the obvious move and
 * it silently kills the hover: the lift shadow lives on an absolutely
 * positioned sibling that extends *past* the card's bounds, and an
 * overflow clip erases exactly the part that shows. The cover rounds its
 * own top corners instead.
 *
 * Shadow and lift are `ServiceCard`'s, for the reasons recorded there: only
 * `transform` and `opacity` animate, and the deeper shadow cross-fades on
 * its own layer rather than being transitioned on `box-shadow`, which
 * repaints a large blur every frame.
 */
export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <li
      className={cn(
        "group/project relative isolate flex flex-col rounded-card bg-paper",
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
          "transition-opacity duration-300 ease-soft group-hover/project:opacity-100",
        )}
      />

      <div
        className={cn(
          "grid h-44 place-items-center rounded-t-card sm:h-48",
          "text-[0.8125rem] leading-none font-bold tracking-[0.16em] uppercase",
          toneStyles[project.tone],
        )}
      >
        {/* The cover restates the category the chip row filters on, so it
            is announced by the card's own text rather than hidden. */}
        {project.category}
      </div>

      <div className="flex flex-col gap-2 p-6">
        <p className="text-xs font-semibold tracking-[0.12em] text-grape uppercase">
          {project.service}
        </p>

        <h3 className="text-xl leading-snug font-bold text-balance text-ink">{project.title}</h3>

        <p className="text-base leading-snug text-ink-soft">{project.result}</p>
      </div>
    </li>
  );
}
