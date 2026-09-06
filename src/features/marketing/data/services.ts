import {
  CalendarDays,
  Camera,
  Clapperboard,
  Grid2x2,
  Mic,
  Music,
  PlayCircle,
  Smile,
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
 */
export const services = [
  // Array order IS display order, and the card's corner index is derived from
  // it, so moving an entry renumbers the grid on its own. It also reorders the
  // ticker and the holding page's marquee, which read from this same array.
  { id: "influencer", title: "Influencer Marketing", short: "Influencer", icon: UserCheck },
  { id: "ad-films", title: "Digital Ad Films", short: "Digital Ad Films", icon: Clapperboard },
  { id: "video", title: "Video Production", short: "Video", icon: Video },
  { id: "celebrity", title: "Celebrity Engagements", short: "Celebrity Engagements", icon: Star },
  { id: "branding", title: "Branding / Visuals / UI‑UX", short: "Branding", icon: Grid2x2 },
  { id: "motion", title: "Motion Design & Explainers", short: "Motion Design", icon: PlayCircle },
  { id: "music", title: "Music Production & Licensing", short: "Music & Licensing", icon: Music },
  { id: "podcast", title: "Podcast Production", short: "Podcasts", icon: Mic },
  { id: "ooh", title: "OOH / Offline Activations", short: "Offline Activations", icon: Volume2 },
  { id: "meme", title: "Meme Marketing", short: "Meme Marketing", icon: Smile },
  { id: "events-mgmt", title: "Events Management", short: "Events Branding", icon: CalendarDays },
  { id: "events-cover", title: "Events Coverage", short: "Event Coverage", icon: Camera },
] as const satisfies readonly Service[];

/** Condensed names, for text-only consumers like the ticker. */
export const serviceTicker: readonly string[] = services.map((service) => service.short);

/**
 * Full titles. Still exported because the holding page's marquee uses them,
 * and that page is deleted at launch rather than restyled.
 */
export const serviceTitles: readonly string[] = services.map((service) => service.title);
