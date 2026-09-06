import { CtaBand } from "@/features/marketing/components/CtaBand";
import { WorkHero } from "@/features/marketing/components/WorkHero";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Ad films, influencer campaigns, events, branding, memes and podcasts. A sample of what Popcorn Advertising has shipped, with the numbers each one returned.",
  alternates: { canonical: "/work" },
};

// No `isComingSoon` branch. /work is in GATED_PATHS, so under `coming-soon`
// the build-time redirect in next.config.ts catches the request before this
// file is ever reached.
export default function WorkPage() {
  return (
    <>
      <WorkHero />
      <CtaBand
        headingId="work-cta-heading"
        title="Want results like these for your brand?"
        ctaLabel="Let's talk"
      />
    </>
  );
}
