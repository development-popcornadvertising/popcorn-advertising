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
  title: string;
  icon: LucideIcon;
}

/**
 * The twelve disciplines. Single source of truth: the services grid, the
 * marquee and the footer links all read from here.
 */
export const services = [
  { id: "branding", title: "Branding / Visuals / UI-UX", icon: Grid2x2 },
  { id: "motion", title: "Motion Design & Explainers", icon: PlayCircle },
  { id: "music", title: "Music Production & Licensing", icon: Music },
  { id: "podcast", title: "Podcast Production", icon: Mic },
  { id: "influencer", title: "Influencer Marketing", icon: UserCheck },
  { id: "ad-films", title: "Digital Ad Films", icon: Clapperboard },
  { id: "video", title: "Video Production", icon: Video },
  { id: "celebrity", title: "Celebrity Engagements", icon: Star },
  { id: "ooh", title: "OOH / Offline Activations", icon: Volume2 },
  { id: "meme", title: "Meme Marketing", icon: Smile },
  { id: "events-mgmt", title: "Events Management", icon: CalendarDays },
  { id: "events-cover", title: "Events Coverage", icon: Camera },
] as const satisfies readonly Service[];

/** Just the titles, for text-only consumers like the marquee. */
export const serviceTitles: readonly string[] = services.map((service) => service.title);
