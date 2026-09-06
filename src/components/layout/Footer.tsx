import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/siteConfig";

import { Logo } from "./Logo";

interface FooterColumnProps {
  title: string;
  links: readonly { label: string; href: string }[];
}

/**
 * The site footer.
 *
 * Four columns on the same grid the services section uses, so the brand
 * block and the link lists line up with the cards above them. Columns two
 * to four are right-aligned from `lg`, as in the comp; below that they
 * stack and go back to reading left-aligned, because right-aligned lists
 * on a narrow screen are hard to scan.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream/80">
      <Container className="pt-20 pb-12 lg:pt-25">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-13">
          <div>
            <Logo tone="dark" />
            {/* Justified, matching the comp. Only from `sm`: justifying a
                narrow measure opens rivers between the words. */}
            <p className="mt-8 max-w-64 text-sm leading-relaxed sm:text-justify">
              {siteConfig.footerBlurb}
            </p>
          </div>

          <FooterColumn title="Studio" links={siteConfig.footerNav.studio} />
          <FooterColumn title="Services" links={siteConfig.footerNav.services} />

          <div className="lg:text-right">
            <h2 className="text-sm font-medium text-cream">Contact</h2>
            <address className="mt-16 space-y-3 text-sm not-italic">
              <p>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="transition-colors duration-200 hover:text-butter"
                >
                  {siteConfig.contact.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${siteConfig.contact.phoneHref}`}
                  className="transition-colors duration-200 hover:text-butter"
                >
                  {siteConfig.contact.phone}
                </a>
              </p>
              <p>{siteConfig.contact.location}</p>
            </address>
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-2 border-t border-cream/15 pt-8 text-sm text-cream/60 md:mt-40 md:flex-row md:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="lg:text-right">
      <h2 className="text-sm font-medium text-cream">{title}</h2>
      {/* The comp leaves a deliberate gap between the column head and its
          list, which is what stops the four columns reading as one block. */}
      <ul className="mt-16 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="transition-colors duration-200 hover:text-butter">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
