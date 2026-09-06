/** Which brand field a project's cover is painted in. */
export type ProjectTone = "pop" | "grape" | "butter";

export interface Project {
  /** Stable id, also used as the React key. */
  id: string;
  /**
   * Filter bucket, and the label printed across the cover. Doubles as the
   * chip text, which is why the two can never drift apart.
   */
  category: string;
  /** Service name, in the small line above the title. */
  service: string;
  title: string;
  /** The single-line outcome. */
  result: string;
  tone: ProjectTone;
}

export const projects = [
  {
    id: "fizzy-cola-launch",
    category: "Ad film",
    service: "Digital Ad Films",
    title: "Fizzy Cola Launch",
    result: "2.4M views across 6 markets in the first week.",
    tone: "pop",
  },
  {
    id: "glow-skincare",
    category: "Influencer",
    service: "Influencer Marketing",
    title: "Glow Skincare",
    result: "89 creators activated, 12M combined reach.",
    tone: "grape",
  },
  {
    id: "urban-sneaker-fest",
    category: "Event",
    service: "Events Management",
    title: "Urban Sneaker Fest",
    result: "18K attendees across 3 cities in one season.",
    tone: "butter",
  },
  {
    id: "nimbus-fintech",
    category: "Branding",
    service: "Branding / UI-UX",
    title: "Nimbus Fintech",
    result: "Full identity system plus a redesigned app UI.",
    tone: "grape",
  },
  {
    id: "snackly-app",
    category: "Meme",
    service: "Meme Marketing",
    title: "Snackly App",
    result: "40M organic impressions from one meme sprint.",
    tone: "pop",
  },
  {
    id: "founders-cut",
    category: "Podcast",
    service: "Podcast Production",
    title: "The Founder's Cut",
    result: "1.1M monthly listens, launched from scratch.",
    tone: "butter",
  },
] as const satisfies readonly Project[];

/** The label for the chip that clears the filter. */
export const ALL_PROJECTS = "All";

/**
 * The filter chips, in the order the projects first introduce them.
 *
 * Derived rather than hand-listed. The reference draws five chips for six
 * categories, which left Meme and Podcast reachable only under "All";
 * deriving the list means every project has a chip by construction, and
 * adding a project adds its chip for free.
 */
export const projectFilters: readonly string[] = [
  ALL_PROJECTS,
  ...new Set(projects.map((project) => project.category)),
];
