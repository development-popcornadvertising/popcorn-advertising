import { ComingSoon } from "@/features/coming-soon/components/ComingSoon";
import { CtaBand } from "@/features/marketing/components/CtaBand";
import { Hero } from "@/features/marketing/components/Hero";
import { ServicesGrid } from "@/features/marketing/components/ServicesGrid";
import { ServiceTicker } from "@/features/marketing/components/ServiceTicker";
import { WhyUs } from "@/features/marketing/components/WhyUs";
import { serviceTitles } from "@/features/marketing/data/services";
import { isComingSoon } from "@/lib/siteMode";

import type { Metadata } from "next";

// Both modes want "/" as the canonical and inherit the layout's title and
// description, so metadata does not branch — only the rendered tree does.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function RootPage() {
  // app/ is the composition root: it owns wiring feature data into feature
  // components, so neither feature has to import from the other.
  if (isComingSoon) return <ComingSoon services={serviceTitles} />;

  return (
    <>
      <Hero />
      <ServiceTicker />
      <ServicesGrid />
      <WhyUs />
      <CtaBand />
    </>
  );
}
