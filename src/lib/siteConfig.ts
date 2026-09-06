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

  contact: {
    email: "hello@popcornadvertising.com",
    phone: "+91 00000 00000", // [CLIENT] replace before launch
    phoneHref: "+910000000000",
    location: "New Delhi, India",
  },

  social: [
    { label: "Instagram", href: "https://instagram.com/", icon: "instagram" },
    { label: "LinkedIn", href: "https://linkedin.com/", icon: "linkedin" },
    { label: "YouTube", href: "https://youtube.com/", icon: "youtube" },
  ],

  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "About", href: "/about" },
    { label: "Work", href: "/work" },
    { label: "Contact", href: "/contact" },
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
      { label: "Branding & UI/UX", href: "/#services" },
      { label: "Digital Ad Films", href: "/#services" },
      { label: "Influencer Marketing", href: "/#services" },
      { label: "Events Management", href: "/#services" },
    ],
  },
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
