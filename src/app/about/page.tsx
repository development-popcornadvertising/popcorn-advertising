import { AboutHero } from "@/features/marketing/components/AboutHero";
import { ApproachBand } from "@/features/marketing/components/ApproachBand";
import { CtaBand } from "@/features/marketing/components/CtaBand";
import { ProcessSteps } from "@/features/marketing/components/ProcessSteps";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Nine years, forty brands and one team that handles strategy, production and placement in-house. Meet Popcorn Advertising.",
  alternates: { canonical: "/about" },
};

// No `isComingSoon` branch here. /about is in GATED_PATHS, so under
// `coming-soon` the build-time redirect in next.config.ts catches the
// request before this file is ever reached.
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <ApproachBand />
      <ProcessSteps />
      <CtaBand headingId="about-cta-heading" title="Like how we work? Let's start yours." />
    </>
  );
}
