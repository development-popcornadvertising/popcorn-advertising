import {
  CalendarDays,
  Clapperboard,
  Grid2x2,
  Music,
  PlayCircle,
  Share2,
  Smile,
  Sparkles,
  Star,
  UserCheck,
  Video,
  Volume2,
  type LucideIcon,
} from "lucide-react";

export interface Service {
  /** Stable id, also used as the React key. */
  id: string;
  /** Full name, as it appears on the service card. */
  title: string;
  /**
   * Condensed name for the scrolling ticker, where the full titles are too
   * long to read at speed. Kept beside the title rather than in a second
   * array so the two can never drift out of sync.
   */
  short: string;
  icon: LucideIcon;
}

/**
 * The twelve disciplines. Single source of truth: the services grid, the
 * ticker and the footer links all read from here.
 *
 * Array order IS display order, and the card's corner index is derived from
 * it, so moving an entry renumbers the grid on its own.
 *
 * Two slots changed meaning rather than wording. Podcast Production became
 * Social Media Management, and Events Coverage became AI Video Production,
 * because Event Management absorbed coverage. Keeping the count at twelve is
 * what lets the section heading and the four-column grid stay as they are.
 */
export const services = [
  { id: "influencer", title: "Influencer Marketing", short: "Influencer", icon: UserCheck },
  { id: "ad-films", title: "Digital Ad Films", short: "Digital Ad Films", icon: Clapperboard },
  { id: "video", title: "Video Production", short: "Video", icon: Video },
  {
    id: "celebrity",
    title: "Celebrity & Talent Management",
    short: "Celebrity & Talent",
    icon: Star,
  },
  { id: "branding", title: "Branding / Visuals / UI‑UX", short: "Branding", icon: Grid2x2 },
  { id: "motion", title: "Motion Design & Explainers", short: "Motion Design", icon: PlayCircle },
  { id: "music", title: "Music Production & Licensing", short: "Music & Licensing", icon: Music },
  { id: "social", title: "Social Media Management", short: "Social Media", icon: Share2 },
  { id: "ooh", title: "OOH / Offline Activations", short: "Offline Activations", icon: Volume2 },
  { id: "meme-orm", title: "Meme Marketing & ORM", short: "Meme & ORM", icon: Smile },
  {
    id: "events",
    title: "Event Management & Coverage",
    short: "Events",
    icon: CalendarDays,
  },
  { id: "ai-video", title: "AI Video Production", short: "AI Video", icon: Sparkles },
] as const satisfies readonly Service[];

/** Condensed names, for text-only consumers like the ticker. */
export const serviceTicker: readonly string[] = services.map((service) => service.short);

/**
 * Full titles. Still exported because the holding page's marquee uses them,
 * and that page is deleted at launch rather than restyled.
 */
export const serviceTitles: readonly string[] = services.map((service) => service.title);
