import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { capabilities } from "@/features/marketing/data/capabilities";

import { CapabilityCard } from "./CapabilityCard";

/**
 * The Work page: its opening statement, and the grid underneath it.
 *
 * LAYOUT NOTE. The grape wedge is the About hero's, unchanged, and every
 * part of it was paid for there: positioned against the *content box* with
 * a 100vw right bleed so the colour reaches the screen edge without the
 * boundary drifting away from the type as the window widens; an absolute
 * 9.5rem clip run so the angle holds rather than shearing with the block's
 * height; `inset-y-0` inside a wrapper holding only the copy, so its bottom
 * edge lands where the grid begins without a hardcoded height; left padding
 * past the *whole* run, because a leaning edge otherwise needs an inset that
 * depends on the block's height, which depends on its own measure; and the
 * split at `xl`, because below 1280px the remaining measure is under 300px
 * and strands a few lines in a huge field.
 *
 * NO FILTER, AND THEREFORE NO CLIENT JAVASCRIPT. This page used to show six
 * case studies behind a row of chips, which needed a client component to
 * hold the active filter. It now lists all twelve services, and filtering
 * twelve distinct things leaves one card per filter, so the chips earned
 * nothing. Removing them took the page's entire client bundle with them.
 *
 * HERO AND GRID IN ONE SECTION, because the wedge's bottom edge has to align
 * with the top of the grid, and that only falls out of the markup if the two
 * share an ancestor.
 */
export function WorkHero() {
  return (
    <section aria-labelledby="work-heading" className="relative overflow-hidden">
      <Container className="relative">
        <div className="relative xl:grid xl:grid-cols-2 xl:items-center xl:gap-x-12">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 -right-[100vw] left-1/2 hidden bg-grape [clip-path:polygon(9.5rem_0,100%_0,100%_100%,0_100%)] xl:block"
          />

          <SectionHeading
            id="work-heading"
            as="h1"
            eyebrow="Our work"
            title={
              <>
                Everything we do, <span className="text-pop italic">under one roof.</span>
              </>
            }
            lead="Twelve services and one team, with no hand-offs between them. This is the full range."
            className="rise pt-16 pb-12 rise-delay-0 xl:py-25"
          />

          <div className="relative rise rounded-card bg-grape p-8 rise-delay-1 xl:rounded-none xl:bg-transparent xl:p-0 xl:pl-44">
            <Eyebrow tone="dark">Across the board</Eyebrow>

            <p className="mt-6 font-display text-2xl leading-tight font-bold text-cream">
              Twelve services. One team.
            </p>

            <p className="mt-4 max-w-lg text-base leading-snug text-cream/80">
              The same people carry a brief from the first strategy session to the number at the end
              of it.
            </p>
          </div>
        </div>

        <div className="rise pb-section rise-delay-2 md:pb-section-lg xl:pt-4">
          {/* Visually hidden, but it has to exist: the cards are h3s, and
              without a rung between them and the page h1 the outline jumps
              h1 -> h3. It also names the grid for anyone navigating by
              heading. */}
          <h2 className="sr-only">Our services</h2>

          <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <CapabilityCard key={capability.id} capability={capability} className="reveal" />
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
