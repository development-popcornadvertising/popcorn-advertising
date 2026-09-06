import { siteConfig } from "@/lib/siteConfig";

/**
 * Organization structured data.
 *
 * Lives here rather than in app/layout.tsx so that app/ stays routing-only.
 *
 * `telephone` is now included. It was omitted while siteConfig carried a
 * placeholder, because feeding a fake number into Google's entity graph is
 * worse than sending none; the real number has since landed. It is emitted
 * in E.164, which is the format Google expects rather than the spaced form
 * the site displays.
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
    telephone: siteConfig.contact.phoneHref,
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
