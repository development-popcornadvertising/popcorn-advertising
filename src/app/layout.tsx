import { OrganizationJsonLd } from "@/components/layout/OrganizationJsonLd";
import { siteConfig } from "@/lib/siteConfig";
import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.descriptor}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // Matches --color-cream, so mobile browser chrome blends with the page.
  themeColor: "#faf0dc",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // lang is en-IN to match openGraph.locale — the audience and the
    // business are both Indian, and the two should not disagree.
    //
    // data-scroll-behavior is required in Next 16: the framework stopped
    // applying smooth scrolling to router navigations automatically, so
    // without it the `scroll-behavior: smooth` rule in globals.css is
    // ignored on in-app anchor jumps like /#services.
    //
    // TODO [BLOCKED on brand assets]: add the font variables here once the
    // four .woff2 files are in public/fonts/ —
    //   className={`${displayFont.variable} ${bodyFont.variable}`}
    // See src/lib/fonts.ts.
    <html lang="en-IN" data-scroll-behavior="smooth">
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only rounded-pill bg-pop focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-5 focus:py-2.5 focus:text-white"
        >
          Skip to content
        </a>

        <OrganizationJsonLd />

        {/* Header and Footer arrive in Phase 2. */}
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
