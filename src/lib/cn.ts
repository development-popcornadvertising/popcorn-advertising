import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Custom scale values from the `@theme` block in src/styles/globals.css.
 *
 * tailwind-merge does not read our stylesheet, so it cannot know that
 * `py-section` and `py-12` are the same property, that `rounded-panel`
 * conflicts with `rounded-none`, or that `max-w-page` conflicts with
 * `max-w-2xl`. Left unregistered, both classes survive a merge and
 * stylesheet order silently decides the winner — the exact bug `cn`
 * exists to prevent.
 *
 * Colour, font and text-size tokens need no entry here: tailwind-merge
 * already treats an unrecognised single-word `bg-*` / `text-*` / `font-*`
 * value as a member of those groups.
 *
 * ⚠️  Add a token to `@theme` under any namespace listed below and you must
 *     add its name here too, or merging silently regresses for it. The
 *     namespaces that need registering are the ones whose utility takes a
 *     bare scale name: `--spacing-*`, `--radius-*` and `--container-*`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: ["section", "section-lg"],
      radius: ["card", "panel", "media", "pill"],
      container: ["page"],
    },
  },
});

/**
 * Joins class names conditionally and resolves Tailwind conflicts,
 * so a `className` prop can always override a component's defaults.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
