import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { IntroAnimation } from "@/components/layout/IntroAnimation";
import { OrganizationJsonLd } from "@/components/layout/OrganizationJsonLd";
import { brandFont } from "@/lib/fonts";
import { siteConfig } from "@/lib/siteConfig";
import { isComingSoon } from "@/lib/siteMode";
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
    <html lang="en-IN" data-scroll-behavior="smooth" className={brandFont.variable}>
      {/* suppressHydrationWarning is on <body> only, and only because
          browser extensions write their own attributes onto it before React
          hydrates. ColorZilla adds cz-shortcut-listen="true", Grammarly adds
          two of its own; each one throws "a tree hydrated but some
          attributes ... didn't match" in development. Nothing we render can
          prevent that, and the warning is noise that hides real mismatches.

          It is safe here because the flag reaches exactly one level: this
          element's own attributes and text. Anything inside the tree still
          reports mismatches normally, so this cannot mask a bug of ours.
          Do NOT spread it onto <html> or any component. */}
      <body className="min-h-dvh antialiased" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only rounded-pill bg-pop focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-5 focus:py-2.5 focus:text-white"
        >
          Skip to content
        </a>

        <OrganizationJsonLd />
        <IntroAnimation />

        {/* The holding page is a self-contained composition with its own
            logo and footer, so it must not get the site chrome as well. */}
        {isComingSoon ? null : <Header />}

        <main id="main">{children}</main>

        {isComingSoon ? null : <Footer />}
      </body>
    </html>
  );
}
