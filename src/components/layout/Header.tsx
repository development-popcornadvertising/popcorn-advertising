import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/siteConfig";

import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";

/**
 * The sticky site header.
 *
 * A Server Component. Only NavLink and MobileMenu ship JavaScript, and both
 * are leaves of this tree.
 *
 * Translucent rather than solid: sampling the comp shows cream at 73% over
 * whatever is behind, which is what lets the hero's dark panel bleed
 * through on the right. The blur keeps the wordmark legible where it does.
 *
 * The nav sits in its own grid column so it stays optically centred on the
 * page no matter how wide the logo or the call to action get.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-cream/75 shadow-[0_1px_16px_rgb(60_54_52_/_0.06)] backdrop-blur-xl">
      <Container className="grid h-[var(--header-height)] grid-cols-[1fr_auto] items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <Logo isEager />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-16 text-lg">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center justify-end">
          <Button href={siteConfig.cta.href} className="hidden lg:inline-flex">
            {siteConfig.cta.label}
          </Button>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
