import { Figtree } from "next/font/google";

/**
 * The brand typeface.
 *
 * The design is set in a Gilroy-like geometric sans: double-storey `a`,
 * single-storey `g`, curved-foot `t`, tight tracking, and an oblique for
 * the "POP." / "STAY." accents. Figtree is the closest face available
 * under a licence we can ship, and it is a variable font with a true
 * italic, so one payload covers every weight the design uses instead of
 * four static files.
 *
 * next/font downloads and self-hosts the files at build time, so nothing
 * is requested from Google at runtime and the `font-src 'self'` directive
 * in next.config.ts is satisfied without an exception.
 *
 * TO SWAP IN THE REAL FACE: replace the call below with `localFont({...})`
 * pointing at the .woff2 files in public/fonts/, keeping the same
 * `--font-brand` variable name. Nothing outside this file changes;
 * globals.css maps --font-display and --font-body onto that variable.
 */
export const brandFont = Figtree({
  // Required while `preload` defaults to true; omitting it warns at build.
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-brand",
  display: "swap",
  fallback: ["ui-rounded", "system-ui", "sans-serif"],
});
