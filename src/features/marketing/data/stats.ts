import type { Stat } from "@/components/ui/StatList";

/** The three proof points under the hero headline. */
export const heroStats = [
  { value: "12+", label: "Services in-house" },
  { value: "150+", label: "Campaigns launched" },
  { value: "40+", label: "Brands popped" },
] as const satisfies readonly Stat[];

/**
 * The four figures on the About page.
 *
 * "Brands popped" and "Brands served" are the same number by design: the
 * home page and the About page must never quote different counts for the
 * same thing.
 */
export const agencyStats = [
  { value: "9 yrs", label: "In business" },
  { value: "40+", label: "Brands served" },
  { value: "150+", label: "Campaigns delivered" },
  { value: "12", label: "Services, one team" },
] as const satisfies readonly Stat[];
