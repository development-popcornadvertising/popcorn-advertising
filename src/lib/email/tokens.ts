/**
 * Brand values for HTML email, duplicated from globals.css on purpose.
 *
 * An email is not the web page. It cannot read a stylesheet, cannot use a
 * CSS custom property (Outlook drops `var()` entirely), and every value has
 * to end up inline on the element that uses it. So these are plain string
 * literals, and the one rule that keeps them honest is that the hexes must
 * match the `@theme` block in src/styles/globals.css exactly.
 */
export const email = {
  cream: "#fff9ef",
  paper: "#ffffff",
  ink: "#3c3636",
  inkSoft: "#6d6764",
  pop: "#e5116c",
  grape: "#5855a5",
  butter: "#fde392",

  /** Hairlines and quote rules. Warm rather than neutral grey. */
  line: "#eee6d8",

  /**
   * No web font. Figtree would not load in Outlook or in most Gmail
   * configurations, so a webfont buys an inconsistent result: half the
   * recipients get the brand face and half get an unstyled fallback with
   * different metrics. A system stack renders natively everywhere, and at
   * these sizes the premium feel comes from spacing and hierarchy, not from
   * the typeface.
   */
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",

  /** The one safe width. Wider than this and Outlook starts clipping. */
  width: 600,
} as const;

/** Dark-mode counterparts, used only in the prefers-color-scheme block. */
export const emailDark = {
  cream: "#221f1e",
  paper: "#2b2725",
  ink: "#f4efe6",
  inkSoft: "#b3aaa3",
  line: "#3d3734",
} as const;
