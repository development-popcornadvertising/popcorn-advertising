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
  className?: string;
}

/**
 * Eyebrow + heading + lead paragraph, in the correct semantic order.
 * `as` defaults to h2; pass "h1" only for the single page headline.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  as: Heading = "h2",
  tone = "light",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}

      <Heading
        id={id}
        className={cn("mt-5 text-3xl md:text-4xl", tone === "dark" ? "text-cream" : "text-ink")}
      >
        {title}
      </Heading>

      {lead ? (
        <p className={cn("mt-5 text-lg", tone === "dark" ? "text-cream/80" : "text-ink-soft")}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}
