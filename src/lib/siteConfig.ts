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

  footerNav: {
    services: [
      { label: "Branding & UI/UX", href: "/#services" },
      { label: "Digital Ad Films", href: "/#services" },
      { label: "Influencer Marketing", href: "/#services" },
      { label: "Events Management", href: "/#services" },
    ],
    studio: [
      { label: "About us", href: "/about" },
      { label: "Our work", href: "/work" },
      { label: "Careers", href: "/careers" }, // [CLIENT] confirm this page exists
    ],
  },
} as const;

export type NavItem = (typeof siteConfig.nav)[number];
