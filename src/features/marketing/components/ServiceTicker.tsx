import { Marquee } from "@/components/layout/Marquee";

import { serviceTicker } from "../data/services";

/**
 * The pink band of service names under the hero.
 *
 * A thin wrapper so `app/` does not have to know which slice of the service
 * data the ticker wants. The Marquee itself stays content-agnostic.
 */
export function ServiceTicker() {
  return <Marquee items={serviceTicker} />;
}
