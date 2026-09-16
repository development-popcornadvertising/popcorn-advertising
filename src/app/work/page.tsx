import { CtaBand } from "@/features/marketing/components/CtaBand";
import { WorkHero } from "@/features/marketing/components/WorkHero";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Influencer marketing, social, video, events, branding and more. The twelve services Popcorn Advertising runs in-house, with no hand-offs between them.",
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
        title="Want all of this handled for your brand?"
        ctaLabel="Let's talk"
      />
    </>
  );
}
