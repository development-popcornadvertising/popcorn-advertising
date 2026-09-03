import { siteConfig } from "@/lib/siteConfig";

/**
 * Organization structured data.
 *
 * Lives here rather than in app/layout.tsx so that app/ stays routing-only.
 *
 * `telephone` is deliberately omitted: siteConfig still carries the
 * placeholder "+91 00000 00000", and feeding a fake number into Google's
 * entity graph is worse than sending no number at all. Add it here once the
 * real one lands.
 *
 * Only Organization is emitted. No WebSite/SearchAction (there is no search)
 * and no Service entries for pages that do not exist yet — claiming
 * structure the site does not have is how rich results get suppressed.
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "New Delhi",
      addressCountry: "IN",
    },
    sameAs: siteConfig.social.map((item) => item.href),
  };

  return (
    <script
      type="application/ld+json"
      // The only acceptable use of this prop in the project: the content is
      // generated from our own typed config, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
