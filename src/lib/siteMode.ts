/**
 * The launch gate.
 *
 * ⚠️  This module is imported by next.config.ts, which is loaded by Next's
 *     own config loader in plain Node. That means it must stay free of
 *     `import "server-only"` (whose default entry throws outside the
 *     react-server condition) and free of runtime dependencies like zod.
 *     Keep it dependency-free.
 *
 * SITE_MODE is read at build time, so every route stays statically
 * prerenderable and changing it requires a redeploy. That is not a real
 * cost: Vercel applies environment changes to new deployments only, so a
 * request-time flag would need a redeploy to take effect anyway.
 */

export const SITE_MODES = ["coming-soon", "live"] as const;
export type SiteMode = (typeof SITE_MODES)[number];

/**
 * Resolves SITE_MODE, failing closed: anything unset or unrecognised
 * (`Live`, `true`, a typo) serves the holding page rather than accidentally
 * launching the site early.
 */
export function resolveSiteMode(value: string | undefined = process.env.SITE_MODE): SiteMode {
  return value === "live" ? "live" : "coming-soon";
}

export const siteMode: SiteMode = resolveSiteMode();
export const isComingSoon: boolean = siteMode === "coming-soon";

/**
 * Routes that only exist once the site is live. While gated they 307 to "/"
 * so a guessed or bookmarked URL lands somewhere useful instead of 404ing.
 */
export const GATED_PATHS = ["/about", "/work", "/work/:slug*", "/contact"] as const;
