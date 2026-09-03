import { siteConfig } from "@/lib/siteConfig";

import type { MetadataRoute } from "next";

/**
 * Web app manifest.
 *
 * Present mainly so that "add to home screen" produces a branded icon and
 * name rather than a screenshot and a URL, and so Lighthouse's PWA and
 * best-practices checks have something to read. Deliberately minimal: this
 * is a marketing site, not an installable app, so there is no start_url
 * trickery, no display: standalone, and no service worker.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} | ${siteConfig.descriptor}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "browser",
    background_color: "#faf0dc",
    theme_color: "#faf0dc",
    // No icons declared: the favicon routes were removed pending the real
    // brand asset. Add them back alongside public/logo.svg.
  };
}
