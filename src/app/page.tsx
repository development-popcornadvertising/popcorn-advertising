import { ComingSoon } from "@/features/coming-soon/components/ComingSoon";
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

  // TODO [Phase 3]: replace with <Home />. The branch above is the launch
  // gate — see src/lib/siteMode.ts and next.config.ts.
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-3xl">Home page (Phase 3)</h1>
      <p className="mt-4">
        SITE_MODE is <code>live</code>, so the gate is open. The real home page has not been built
        yet.
      </p>
    </div>
  );
}
