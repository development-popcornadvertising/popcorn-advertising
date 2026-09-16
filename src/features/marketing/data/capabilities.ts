/** Which brand field a card's cover is painted in. */
export type CapabilityTone = "pop" | "grape" | "butter";

export interface Capability {
  /** Stable id, also used as the React key. */
  id: string;
  /** Short word printed across the cover. */
  cover: string;
  title: string;
  /** One line on what the service actually covers. */
  description: string;
  tone: CapabilityTone;
}

/**
 * The twelve services, as the work page lists them.
 *
 * ⚠️ DELIBERATELY NOT THE SAME LIST as src/features/marketing/data/services.ts,
 *    which drives the home grid, the ticker and the footer. The client
 *    supplied two different sets and chose to keep both: this one folds
 *    digital ad films and podcasts into Video Production and adds community
 *    building, while the home list splits them differently and carries AI
 *    Video Production. Do not "fix" the drift by syncing them; it is a
 *    decision, not an oversight.
 */
export const capabilities = [
  {
    id: "influencer",
    cover: "Influencer",
    title: "Influencer Marketing",
    description: "Creator partnerships matched to the audience you actually want to reach.",
    tone: "pop",
  },
  {
    id: "social",
    cover: "Social",
    title: "Social Media Marketing",
    description: "Always-on content and community management across every platform that matters.",
    tone: "grape",
  },
  {
    id: "video",
    cover: "Video",
    title: "Video Production",
    description: "UGC reels, podcasts, digital ad films and product shoots.",
    tone: "butter",
  },
  {
    id: "meme-orm",
    cover: "Meme",
    title: "Meme Marketing & ORM",
    description: "Content at culture speed, and reputation management for when it turns.",
    tone: "grape",
  },
  {
    id: "ooh",
    cover: "OOH",
    title: "OOH & Brand Activations",
    description:
      "Outdoor, retail and on-ground work that people walk into rather than scroll past.",
    tone: "pop",
  },
  {
    id: "community",
    cover: "Community",
    title: "Community Building & Campus Ambassadors",
    description: "Ambassador programmes and communities that keep talking after the campaign ends.",
    tone: "butter",
  },
  {
    id: "motion",
    cover: "Motion",
    title: "Motion Design & Explainer Videos",
    description: "Animation that makes a complicated proposition land in a few seconds.",
    tone: "pop",
  },
  {
    id: "web",
    cover: "Web",
    title: "Website & UI/UX",
    description: "Sites and product interfaces, designed and built end to end.",
    tone: "grape",
  },
  {
    id: "branding",
    cover: "Branding",
    title: "Branding",
    description: "Identity, visual systems, and the guidelines that keep them consistent.",
    tone: "butter",
  },
  {
    id: "events",
    cover: "Events",
    title: "Event Management & Coverage",
    description: "Planned, produced, run and filmed, by one team rather than four vendors.",
    tone: "grape",
  },
  {
    id: "music",
    cover: "Music",
    title: "Music Production & Licensing",
    description: "Original scores, sonic identity, and tracks cleared for the use you need.",
    tone: "pop",
  },
  {
    id: "celebrity",
    cover: "Celebrity",
    title: "Celebrity & Talent Management",
    description: "Casting, negotiation and talent relationships that hold up past one campaign.",
    tone: "butter",
  },
] as const satisfies readonly Capability[];
