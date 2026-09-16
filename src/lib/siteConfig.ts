export const siteConfig = {
  name: "Popcorn Advertising",
  tagline: "Ideas that pop. Results that stay.",
  /**
   * Used as the title suffix. A tagline is brand voice; a search result
   * needs to say what the business is and where, and the whole title has
   * to survive truncation at roughly 60 characters.
   */
  descriptor: "Creative & Marketing Agency in New Delhi",
  description:
    "A full-service creative and marketing agency. From brand identity to celebrity engagements, we plan, produce and place work that gets noticed.",
  /** Shorter, warmer variant used in the footer's brand column. */
  footerBlurb:
    "Ideas that pop. Results that stay. A full-service creative and marketing agency for brands that want more than noise.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  /**
   * The URL to put in an email.
   *
   * `url` above is whatever NEXT_PUBLIC_SITE_URL says, which is localhost in
   * development. An email is always read somewhere other than the machine
   * that sent it, so a localhost link in one is dead on arrival, and a test
   * enquiry from a laptop produced a "See our work" button pointing at
   * http://localhost:3000.
   *
   * In production NEXT_PUBLIC_SITE_URL is the real domain and this is simply
   * that value; the fallback only ever applies to local development.
   */
  get emailUrl(): string {
    const configured = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const isLoopback = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/i.test(
      configured.replace(/\/$/, ""),
    );
    return !configured || isLoopback
      ? "https://popcornadvertising.com"
      : configured.replace(/\/$/, "");
  },

  contact: {
    email: "hello@popcornadvertising.com",
    // Grouped 5-5 the way an Indian mobile is normally written. phoneHref
    // is the same number in E.164, which is what tel: needs.
    phone: "+91 97119 70036",
    phoneHref: "+919711970036",
    location: "New Delhi, India",
  },

  social: [
    { label: "Instagram", href: "https://instagram.com/", icon: "instagram" },
    { label: "LinkedIn", href: "https://linkedin.com/", icon: "linkedin" },
  ],

  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "About", href: "/about" },
    { label: "Work", href: "/work" },
  ],

  /**
   * The header's call to action, kept out of `nav` so it renders once.
   *
   * Also drives every CtaBand, so this one href is what points the closing
   * button on the home, about and work pages at the enquiry form. It was a
   * `mailto:` until /contact existed, which silently does nothing for anyone
   * without a desktop mail client configured.
   */
  cta: { label: "Start a project", href: "/contact" },

  footerNav: {
    studio: [
      { label: "About Us", href: "/about" },
      { label: "Our Work", href: "/work" },
      { label: "Careers", href: "mailto:hello@popcornadvertising.com" }, // [CLIENT] confirm a careers page
    ],
    services: [
      { label: "Influencer Marketing", href: "/#services" },
      { label: "Digital Ad Films", href: "/#services" },
      { label: "Video Production", href: "/#services" },
      { label: "Event Management & Coverage", href: "/#services" },
    ],
  },
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
