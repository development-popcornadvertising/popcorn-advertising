import type { ReactNode } from "react";

import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { Marquee } from "@/components/layout/Marquee";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/siteConfig";

import { LaunchStatus } from "./LaunchStatus";
import { NotifyForm } from "./NotifyForm";

/**
 * One shared frame for every row on this page, so the logo, the headline,
 * the diagonal and the footer all resolve against the same box. Fluid
 * padding rather than a fixed gutter, capped so an ultrawide window does
 * not leave the composition floating in the middle of the screen.
 */
const FRAME = "mx-auto w-full max-w-[110rem] px-6 sm:px-10 lg:px-[max(2.5rem,4vw)]";

interface ComingSoonProps {
  /**
   * Service names, injected by the route. This feature never imports from
   * features/marketing. app/ is the composition root that wires them.
   */
  services: readonly string[];
}

/**
 * The holding page.
 *
 * A Server Component: only NotifyForm ships JavaScript. Deliberately
 * substantive rather than a logo and an input, because it is indexed from
 * day one and a page carrying nothing is exactly the thin content that
 * ranks badly and reads as abandoned.
 *
 * LAYOUT NOTE, and it took three attempts to get right.
 *
 * The content and the colour boundary have to be sized in the SAME
 * coordinate system or they drift apart. Two ways that failed:
 *
 *   1. One centred max-width container plus a `w-1/2` viewport-sized panel.
 *      Looked right at 1440px and drifted wider, because the container caps
 *      and centres while the panel tracks the viewport.
 *   2. A true `grid-cols-2` with each half centring its own content. The
 *      halves matched the colour split exactly, but the logo still lived in
 *      the old container, so the logo and the headline no longer shared a
 *      left edge. Losing the alignment of the type was far more visible
 *      than the drift it fixed.
 *
 * What works: the diagonal is a child of the content box, with its left
 * edge at a percentage OF THAT BOX and a negative right inset so it bleeds
 * to the viewport edge. Content and boundary now scale together by
 * construction. Everything on the left, logo included, shares one left
 * edge, and the frame's padding is fluid so the composition does not look
 * stranded on a very wide screen.
 *
 * Everything in this folder is deleted at launch: `rm -rf
 * src/features/coming-soon` plus flipping SITE_MODE. Nothing outside it
 * depends on it.
 */
export function ComingSoon({ services }: ComingSoonProps) {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-dvh flex-col">
      <section
        aria-labelledby="coming-soon-heading"
        className="relative flex flex-1 flex-col overflow-hidden"
      >
        <div className={cn(FRAME, "relative flex flex-1 flex-col")}>
          {/*
            Decorative diagonal panel. `left` is a percentage of this content
            box, not of the viewport, which is what keeps the colour boundary
            and the type in agreement at every width. The negative right
            inset bleeds it past the viewport edge; the section clips it.
            The clip run is an absolute 2.5rem so clearance stays constant.
          */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 -right-[100vw] left-[54%] hidden bg-grape [clip-path:polygon(2.5rem_0,100%_0,100%_100%,0_100%)] lg:block"
          >
            <div className="absolute inset-0 bg-[radial-gradient(115%_75%_at_72%_18%,rgba(239,206,121,0.15),transparent_60%)]" />
          </div>

          <div className="relative py-7">
            <Logo />
          </div>

          <div className="relative grid flex-1 items-center gap-12 pb-14 lg:grid-cols-[1fr_22rem] lg:gap-16 lg:pb-10 xl:grid-cols-[1fr_28rem]">
            <div className="max-w-xl">
              <LaunchStatus>New site, popping soon</LaunchStatus>

              <h1
                id="coming-soon-heading"
                className="mt-6 text-4xl leading-[1.02] tracking-[-0.03em] md:text-5xl"
              >
                Ideas that <span className="text-pop">POP.</span>
                <br />
                Results that <span className="text-grape-soft">stay.</span>
              </h1>

              <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft/90">
                We make ad films, run influencer campaigns and put on events. Twelve services, one
                team, all of it in-house, out of {siteConfig.contact.location}.
              </p>

              <div className="mt-9">
                <NotifyForm />
              </div>
            </div>

            {/* Direct contact, because someone with a live brief should not
                have to wait for the launch. */}
            <div>
              <h2 className="text-xs font-medium tracking-[0.14em] text-ink uppercase lg:text-butter">
                Already have a brief?
              </h2>

              <address className="mt-6 space-y-3 not-italic">
                <ContactRow icon={<Mail className="size-4" aria-hidden="true" />}>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="transition-colors hover:text-pop lg:hover:text-butter"
                  >
                    {siteConfig.contact.email}
                  </a>
                </ContactRow>
                <ContactRow icon={<Phone className="size-4" aria-hidden="true" />}>
                  <a
                    href={`tel:${siteConfig.contact.phoneHref}`}
                    className="transition-colors hover:text-pop lg:hover:text-butter"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </ContactRow>
                <ContactRow icon={<MapPin className="size-4" aria-hidden="true" />}>
                  {siteConfig.contact.location}
                </ContactRow>
              </address>

              <ul className="mt-7 flex gap-3 border-t border-ink/10 pt-7 lg:border-cream/15">
                {siteConfig.social.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${siteConfig.name} on ${item.label}`}
                      className="grid size-10 place-items-center rounded-pill border border-ink/15 transition-[colors,transform] duration-200 hover:border-ink/40 hover:text-ink motion-safe:hover:-translate-y-0.5 lg:border-cream/25 lg:text-cream/80 lg:hover:border-cream lg:hover:text-cream"
                    >
                      <SocialIcon network={item.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={services} />

      <footer className="bg-ink text-cream/60">
        <div
          className={cn(FRAME, "flex flex-col gap-1 py-4 text-sm md:flex-row md:justify-between")}
        >
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.tagline}</p>
        </div>
      </footer>
    </div>
  );
}

function ContactRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <p className="group flex items-center gap-4 text-ink-soft lg:text-cream/85">
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-pill",
          "bg-grape-tint text-grape lg:bg-cream/10 lg:text-butter",
          "transition-[transform,background-color] duration-200",
          "group-hover:bg-grape-tint/80 motion-safe:group-hover:scale-105 lg:group-hover:bg-cream/20",
        )}
      >
        {icon}
      </span>
      {children}
    </p>
  );
}
