import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MediaFrame } from "@/components/ui/MediaFrame";
import { StatList } from "@/components/ui/StatList";

import { heroStats } from "../data/stats";

/**
 * The opening statement.
 *
 * LAYOUT NOTE. The dark panel is a decorative sibling, not a grid column.
 * Checking the comp settles it: the headline, lead and stats all sit on a
 * level baseline while the panel's edge leans 13 degrees, so the two are
 * independent layers rather than one rotated container. That also keeps
 * every glyph upright and out of a transformed subtree.
 *
 * The panel is positioned as a percentage of the *content box* with a
 * negative right inset that bleeds it past the viewport, which is the same
 * technique the holding page uses and for the same reason: anchoring to the
 * viewport instead lets the colour boundary drift away from the type as the
 * window widens. The clip run is an absolute 9.5rem so the angle stays put
 * rather than shearing with the section's height.
 *
 * Below `lg` the diagonal is dropped entirely and the media becomes a
 * full-width rounded panel under the copy. A 13 degree slice through a
 * 380px-wide screen is just a corner being eaten.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      <Container className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 -right-[100vw] left-1/2 hidden bg-ink [clip-path:polygon(9.5rem_0,100%_0,100%_100%,0_100%)] lg:block"
        >
          {/* The panel bleeds 100vw past the viewport so its colour reaches
              the edge, which makes it ~2350px wide. Pinning the frame to the
              visible part keeps `bg-ink` off that overhang. The panel's left
              edge resolves to exactly half the viewport at every width (the
              container is centred, so containerLeft + containerWidth/2 == W/2),
              which is why 50vw is exact rather than a guess. */}
          <MediaFrame className="absolute inset-y-0 left-0 w-[50vw]" />
        </div>

        <div className="relative max-w-xl py-16 lg:py-25">
          <Eyebrow tone="butter" className="rise rise-delay-0">
            Full-service creative &amp; marketing agency
          </Eyebrow>

          <h1
            id="hero-heading"
            className="mt-6 rise text-4xl leading-[1.02] font-extrabold tracking-[-0.015em] rise-delay-1"
          >
            {/* Spans, not <em>: the italic here is brand styling, not stress
                emphasis, and should not change how the line is announced. */}
            Ideas that <span className="text-pop italic">POP.</span>
            <br />
            Results that <span className="text-grape italic">STAY.</span>
          </h1>

          <p className="mt-6 max-w-sm rise text-base leading-snug text-ink-soft rise-delay-2">
            From brand identity to celebrity engagements, we plan, produce and place work that gets
            noticed, and keeps performing after the noise dies down.
          </p>

          <div className="mt-9 rise rise-delay-3">
            <Button href="/#services" hasArrow>
              See what we do
            </Button>
          </div>

          <StatList stats={heroStats} hasCountUp className="mt-14 rise rise-delay-4" />
        </div>

        {/* The small-screen stand-in for the diagonal panel. */}
        <div className="relative pb-16 lg:hidden">
          <MediaFrame
            className="aspect-[4/3] w-full rounded-card sm:aspect-[16/9]"
            sizes="(min-width: 640px) 90vw, 100vw"
          />
        </div>
      </Container>
    </section>
  );
}
