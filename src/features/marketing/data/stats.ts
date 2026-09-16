import type { Stat } from "@/components/ui/StatList";

/** The three proof points under the hero headline. */
export const heroStats = [
  { value: "12+", label: "Services in-house" },
  { value: "7500+", label: "Campaigns launched" },
  { value: "500+", label: "Brands popped" },
] as const satisfies readonly Stat[];

/**
 * The four figures on the About page.
 *
 * "Brands popped" and "Brands served" are the same number by design, as are
 * the two campaign counts: the home page and the About page must never
 * quote different figures for the same thing.
 */
export const agencyStats = [
  { value: "11 yrs", label: "In business" },
  { value: "500+", label: "Brands served" },
  { value: "7500+", label: "Campaigns delivered" },
  { value: "12+", label: "Services, one team" },
] as const satisfies readonly Stat[];
