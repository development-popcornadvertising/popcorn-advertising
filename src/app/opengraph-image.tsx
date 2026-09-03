import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/siteConfig";
import { isComingSoon } from "@/lib/siteMode";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name}. ${siteConfig.tagline}`;

/**
 * The social share card.
 *
 * Worth building before launch, not after: a holding-page link gets pasted
 * into WhatsApp, LinkedIn and DMs far more than a finished site's does.
 *
 * Uses next/og's bundled default font rather than the brand faces — Satori,
 * which backs ImageResponse, does not read .woff2, and only .woff2 files
 * were supplied. Ask the designer for .ttf if the wordmark needs to be set
 * in the real display face.
 *
 * At launch, remember to force a re-scrape (LinkedIn Post Inspector,
 * Facebook Sharing Debugger) or the "launching soon" card will linger in
 * their caches for weeks.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#faf0dc",
        padding: "80px",
      }}
    >
      <div style={{ fontSize: 28, color: "#453079", letterSpacing: 2 }}>
        {isComingSoon ? "LAUNCHING SOON" : "FULL-SERVICE CREATIVE & MARKETING AGENCY"}
      </div>
      <div style={{ fontSize: 84, color: "#2e2233", marginTop: 24, lineHeight: 1.1 }}>
        Ideas that pop.
      </div>
      <div style={{ fontSize: 84, color: "#c9184a", lineHeight: 1.1 }}>Results that stay.</div>
      <div style={{ fontSize: 26, color: "#5a4f60", marginTop: 40 }}>
        {siteConfig.contact.location}
      </div>
    </div>,
    size,
  );
}
