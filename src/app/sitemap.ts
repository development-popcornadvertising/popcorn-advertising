import { siteConfig } from "@/lib/siteConfig";
import { isComingSoon } from "@/lib/siteMode";

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const home = {
    url: siteConfig.url,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1,
  };

  // A sitemap that lists URLs which redirect is a Search Console warning
  // generator. While gated, "/" is the only real page.
  if (isComingSoon) return [home];

  // TODO [Phase 5]: append the case-study routes from
  // getAllCaseStudySlugs() once the work section exists.
  const staticRoutes = ["/about", "/work", "/contact"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [home, ...staticRoutes];
}
