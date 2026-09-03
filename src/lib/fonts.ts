import localFont from "next/font/local";

/**
 * ⚠️  BLOCKED: this module is written but not yet imported anywhere, because
 *     the four .woff2 files below do not exist yet. next/font/local resolves
 *     `src` paths at build time, so importing this file before the assets are
 *     in place fails the build.
 *
 *     To finish wiring the brand typefaces:
 *       1. Drop the files into public/fonts/ with these exact names.
 *       2. Import { bodyFont, displayFont } in src/app/layout.tsx and add
 *          className={`${displayFont.variable} ${bodyFont.variable}`} to <html>.
 *       3. Delete this notice.
 *
 * Do not substitute a Google Fonts lookalike for the display face — the
 * rounded face carries most of the brand personality.
 */

/** Rounded display face — headings and the logo wordmark only. */
export const displayFont = localFont({
  src: [
    { path: "../../public/fonts/display-700.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/display-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-display-face",
  display: "swap",
  preload: true,
  fallback: ["ui-rounded", "system-ui", "sans-serif"],
  // next/font/local does not infer fallback metrics the way next/font/google
  // does, so `display: "swap"` alone will still shift layout when the real
  // face lands. Name the closest system face to size the fallback against.
  adjustFontFallback: "Arial",
});

/** Body face — paragraphs, labels, navigation, form fields. */
export const bodyFont = localFont({
  src: [
    { path: "../../public/fonts/body-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/body-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-body-face",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});
