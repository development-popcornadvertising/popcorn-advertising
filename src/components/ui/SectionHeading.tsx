import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Eyebrow } from "./Eyebrow";

interface SectionHeadingProps {
  /** Must match the Section's labelledBy prop. */
  id: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  as?: "h1" | "h2";
  tone?: "light" | "dark";
  /** Constrains the lead's measure. The comp sets it around 33rem. */
  leadClassName?: string;
  className?: string;
}

/**
 * Eyebrow + heading + lead paragraph, in the correct semantic order.
 * `as` defaults to h2; pass "h1" only for the single page headline.
 *
 * The heading and the lead carry different measures on purpose: the comp
 * runs section headings to about 800px so they hold one line, while the
 * lead stays near 520px because a 90-character line is hard to track back.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  as: Heading = "h2",
  tone = "light",
  leadClassName,
  className,
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div className={cn("max-w-4xl", className)}>
      {eyebrow ? <Eyebrow tone={isDark ? "dark" : "light"}>{eyebrow}</Eyebrow> : null}

      <Heading
        id={id}
        className={cn(
          "mt-6 text-5xl font-extrabold tracking-[-0.035em]",
          isDark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </Heading>

      {lead ? (
        <p
          className={cn(
            // 34rem, not max-w-xl: the comp breaks the lead at 521px and
            // max-w-xl (576px) runs the first line 50px long.
            "mt-5 max-w-[34rem] text-base leading-snug",
            isDark ? "text-white/85" : "text-ink-soft",
            leadClassName,
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
