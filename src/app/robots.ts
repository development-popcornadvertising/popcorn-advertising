import { siteConfig } from "@/lib/siteConfig";
import { GATED_PATHS, isComingSoon } from "@/lib/siteMode";

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Preview and development deployments must never be indexed. Vercel also
  // sets X-Robots-Tag: noindex on previews; this covers custom preview
  // domains where that header may not apply.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  // While gated, the holding page at "/" IS indexable — a new domain
  // benefits from being crawled and starting to accrue authority months
  // before launch. What must not be indexed is the routes that 307 to it:
  // listing them would produce "Page with redirect" errors in Search
  // Console. Strip the :slug* matcher, which robots.txt does not understand.
  // Dedupe: /work and /work/:slug* both collapse to /work once the
  // matcher is stripped, and a repeated Disallow line is just noise.
  const gated = [...new Set(GATED_PATHS.map((path) => path.replace("/:slug*", "")))];

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: isComingSoon ? ["/dev", ...gated] : ["/dev"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
