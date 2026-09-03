import { GATED_PATHS, isComingSoon } from "./src/lib/siteMode";

import type { NextConfig } from "next";

/**
 * Fail the build on a missing public site URL.
 *
 * src/lib/env.ts validates the server-side variables, but it is only
 * evaluated when a module that imports it actually runs — and for a fully
 * static page that never happens during prerender. Verified: a build with
 * NEXT_PUBLIC_SITE_URL unset previously succeeded and silently emitted
 * `http://localhost:3000` as every canonical and og:url. This check runs at
 * build time regardless of what the app imports.
 */
function assertPublicUrl() {
  if (process.env.NODE_ENV !== "production") return;

  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SITE_URL is required for a production build.");

  try {
    new URL(url);
  } catch {
    throw new Error(`NEXT_PUBLIC_SITE_URL is not a valid URL: ${url}`);
  }

  if (url.endsWith("/")) {
    throw new Error(`NEXT_PUBLIC_SITE_URL must not have a trailing slash: ${url}`);
  }
}

assertPublicUrl();

const nextConfig: NextConfig = {
  async redirects() {
    if (!isComingSoon) return [];

    // permanent: false => 307. NEVER make these permanent: a 308 is cached
    // by browsers essentially forever, so every visitor who touched the
    // site pre-launch would be unable to reach /about again, with no
    // server-side fix available.
    return GATED_PATHS.map((source) => ({
      source,
      destination: "/",
      permanent: false,
    }));
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Clickjacking and MIME-sniffing.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send only the origin cross-site, keep full path same-origin.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Nothing here uses these; deny by default.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // Two years, preload-eligible. Vercel terminates TLS, so this is
          // safe on every deployment.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Content-Security-Policy.
          //
          // script-src carries 'unsafe-inline' and that is a deliberate,
          // documented compromise rather than an oversight: Next inlines
          // its own hydration and RSC payload scripts
          // (self.__next_f.push(...)), so a strict script-src needs a
          // per-request nonce, which requires dynamic rendering and would
          // take every route off static prerendering. The trade taken here
          // is to keep the site fully static and still lock down every
          // other directive. Revisit if this ever stops being a brochure
          // site with one form.
          //
          // frame-ancestors supersedes X-Frame-Options in modern browsers;
          // both are sent because older ones only understand the header.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // 'unsafe-eval' in development ONLY. React's dev build uses
              // eval() to reconstruct call stacks for its error overlay, so
              // a production-shaped CSP breaks the dev server with a console
              // error on every load. React never uses eval() in production,
              // so the production directive stays without it.
              process.env.NODE_ENV === "production"
                ? "script-src 'self' 'unsafe-inline'"
                : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self'",
              "form-action 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
