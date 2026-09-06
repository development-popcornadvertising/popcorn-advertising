import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type EyebrowTone = "light" | "butter" | "dark";

interface EyebrowProps {
  children: ReactNode;
  /**
   * "butter" is the hero's warm pill, "light" the grape-tinted one used by
   * sections on cream, "dark" the translucent pill that sits on the
   * gradient card. Sampling the comp shows the first two are simply brand
   * colours at low alpha rather than separate tokens.
   */
  tone?: EyebrowTone;
  /**
   * Slowly pulses the leading dot, so a status label reads as live rather
   * than as decoration. Opt-in: most eyebrows label a section and should
   * not move.
   */
  hasPulse?: boolean;
  className?: string;
}

const tones: Record<EyebrowTone, string> = {
  light: "bg-grape/20 text-ink before:bg-ink",
  butter: "bg-butter/60 text-ink before:bg-ink",
  dark: "bg-white/15 text-white before:bg-white",
};

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
        "inline-flex items-center gap-2.5 rounded-pill px-4 py-1.5",
        // 13px with no leading. Measured off the comp: `text-xs` renders the
        // label about 12% narrow and the pill 4px too tall.
        "text-[0.8125rem] leading-none font-medium tracking-[0.12em] uppercase",
        "before:block before:size-1.5 before:rounded-pill",
        // motion-safe so the dot holds still for anyone who asked for less motion.
        hasPulse && "motion-safe:before:animate-pulse-dot",
        tones[tone],
        className,
      )}
    >
      {children}
    </p>
  );
}
