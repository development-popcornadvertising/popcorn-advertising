import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

interface EyebrowProps {
  children: ReactNode;
  tone?: "light" | "dark";
  /**
   * Slowly pulses the leading dot, so a status label reads as live rather
   * than as decoration. Opt-in: most eyebrows label a section and should
   * not move.
   */
  hasPulse?: boolean;
  className?: string;
}

/**
 * The small pill label above a heading.
 *
 * Renders a <p>, never a heading. It labels the section visually but is not
 * part of the document outline — making it an h2/h3 would break the heading
 * hierarchy for screen readers.
 */
export function Eyebrow({ children, tone = "light", hasPulse = false, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-pill px-4 py-1.5",
        "text-xs font-medium tracking-[0.12em] uppercase",
        "before:block before:size-1.5 before:rounded-pill before:bg-current",
        // motion-safe so the dot holds still for anyone who asked for less motion.
        hasPulse && "motion-safe:before:animate-pulse-dot",
        tone === "light" ? "bg-grape-tint text-grape" : "bg-white/10 text-butter",
        className,
      )}
    >
      {children}
    </p>
  );
}
