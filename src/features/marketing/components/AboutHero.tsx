import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatList } from "@/components/ui/StatList";

import { agencyStats } from "../data/stats";

/**
 * The About page's opening statement.
 *
 * LAYOUT NOTE. The grape wedge is the home hero's technique reused, and for
 * the reasons its own note records: it is positioned against the *content
 * box* with a 100vw right bleed so the colour reaches the screen edge
 * without the boundary drifting away from the type as the window widens,
 * and the clip run is an absolute 9.5rem so the angle holds rather than
 * shearing with the block's height. The same 9.5rem run is what makes this
 * diagonal read as the same device as the home page's.
 *
 * One thing differs. The home panel runs the full height of its section;
 * this one has to stop exactly where the stat cards begin. Rather than pin
 * that with a hardcoded height, the wedge is `inset-y-0` inside a wrapper
 * holding *only* the copy and the statement, with the stats as the
 * wrapper's sibling. The bottom edge then falls out of the markup and stays
 * correct however the headline rewraps.
 *
 * The wedge is not left empty. An empty colour field is the one thing this
 * design keeps failing on, so it carries the short version of the pitch:
 * type is the only asset the page needs, and an About page wants that
 * sentence anyway.
 *
 * The split arrives at `xl`, not `lg`. The padding above means the
 * statement's measure is what is left of half the container after 11rem,
 * and below 1280px that is under 300px: three short lines became a thin
 * column stranded in an enormous field of grape. Below `xl` the wedge is
 * dropped and the statement keeps its colour as a card of its own, stacked
 * under the copy, so nothing is lost.
 */
export function AboutHero() {
  return (
    <section aria-labelledby="about-heading" className="relative overflow-hidden">
      <Container className="relative">
        <div className="relative xl:grid xl:grid-cols-2 xl:items-center xl:gap-x-12">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 -right-[100vw] left-1/2 hidden bg-grape [clip-path:polygon(9.5rem_0,100%_0,100%_100%,0_100%)] xl:block"
          />

          <SectionHeading
            id="about-heading"
            as="h1"
            eyebrow="About us"
            title={
              <>
                A full-service agency that likes to move fast and{" "}
                {/* A span, not <em>: the italic is brand styling, not stress
                    emphasis, and should not change how the line is read out. */}
                <span className="text-pop italic">pop loud.</span>
              </>
            }
            lead="Founded on one idea: brands should not have to juggle five vendors for one campaign. We build the strategy, shoot the film, book the influencers and run the event. Ourselves."
            className="rise pt-16 pb-12 rise-delay-0 xl:py-25"
          />

          {/* The left padding is deliberately larger than the 9.5rem clip
              run. Anything smaller has to clear a *leaning* edge, so the
              safe inset would depend on how tall the block happens to be at
              that width, and the block's height depends on its own measure:
              a loop with no fixed point. Padding past the widest part of the
              run clears the diagonal at every y, at every width, with no
              measurement. It is why the label was reading "HE SHORT
              VERSION" before. */}
          <div className="relative rise rounded-card bg-grape p-8 rise-delay-1 xl:rounded-none xl:bg-transparent xl:p-0 xl:pl-44">
            <Eyebrow tone="dark">The short version</Eyebrow>

            <p className="mt-6 font-display text-2xl leading-tight font-bold text-cream">
              One team. Twelve services. No hand-offs.
            </p>

            <p className="mt-4 max-w-lg text-base leading-snug text-cream/80">
              Strategy, film, influencers and events all live under the same roof, which is why
              nothing gets lost between them.
            </p>
          </div>
        </div>

        <StatList
          stats={agencyStats}
          variant="cards"
          hasCountUp
          className="mt-12 rise pb-16 rise-delay-2 xl:mt-14 xl:pb-25"
        />
      </Container>
    </section>
  );
}
