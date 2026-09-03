import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Container } from "./Container";

type SectionTone = "cream" | "grape" | "ink";

interface SectionProps {
  children: ReactNode;
  /** Anchor target, e.g. "services" for /#services. */
  id?: string;
  /** id of the heading that names this section, for aria-labelledby. */
  labelledBy?: string;
  tone?: SectionTone;
  /** Diagonal edge treatment from the design. */
  slice?: "none" | "top" | "bottom" | "both";
  className?: string;
  /** Set true when the section manages its own Container. */
  bare?: boolean;
}

const toneStyles: Record<SectionTone, string> = {
  cream: "bg-cream text-ink-soft",
  grape: "bg-grape text-cream/85",
  ink: "bg-ink text-cream/70",
};

const sliceStyles = {
  none: "",
  top: "slice-t",
  bottom: "slice-b",
  both: "slice-tb",
} as const;

/**
 * A page section with tone, vertical rhythm, anchor id and the diagonal
 * clip treatment. Wraps children in a Container unless `bare` is set.
 */
export function Section({
  children,
  id,
  labelledBy,
  tone = "cream",
  slice = "none",
  className,
  bare = false,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "relative py-section md:py-section-lg",
        // Clears the sticky header when this section is an anchor target
        id && "scroll-mt-24",
        toneStyles[tone],
        sliceStyles[slice],
        className,
      )}
    >
      {bare ? children : <Container>{children}</Container>}
    </section>
  );
}
