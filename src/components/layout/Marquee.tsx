import { cn } from "@/lib/cn";

interface MarqueeProps {
  /**
   * Text to scroll. Passed in rather than imported so this stays in
   * components/layout — layout components never import feature data.
   */
  items: readonly string[];
  className?: string;
}

/**
 * Decorative scrolling strip.
 *
 * The whole element is aria-hidden: the same list appears as real content
 * elsewhere on the page, and a screen reader announcing an endless loop of
 * duplicated words would be actively hostile. Motion stops for users who
 * prefer reduced motion.
 */
export function Marquee({ items, className }: MarqueeProps) {
  return (
    <div aria-hidden="true" className={cn("overflow-hidden bg-pop py-3.5 text-cream", className)}>
      <div className="flex w-max animate-marquee motion-safe-only gap-7 hover:[animation-play-state:paused]">
        {/* Rendered twice so the -50% translate loops without a seam.
            Every other technique needs JavaScript. */}
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center gap-7">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-7 whitespace-nowrap">
                <span className="font-display text-sm tracking-wide">{item}</span>
                <Separator />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/**
 * The mark between items.
 *
 * Inline SVG, never a text character: "✳" and friends resolve to a
 * full-colour emoji glyph on most platforms, which rendered as a green
 * asterisk fighting the brand palette. Drawn here, it inherits currentColor.
 */
function Separator() {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className="size-2 shrink-0 text-butter">
      <path d="M6.75 0h-1.5v4.02L2.4 1.34l-1.06 1.06L4.02 5.25H0v1.5h4.02L1.34 9.6l1.06 1.06L5.25 7.98V12h1.5V7.98l2.85 2.68 1.06-1.06L7.98 6.75H12v-1.5H7.98l2.68-2.85-1.06-1.06L6.75 4.02z" />
    </svg>
  );
}
