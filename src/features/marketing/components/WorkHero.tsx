import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projectFilters, projects } from "@/features/marketing/data/projects";

import { ProjectCard } from "./ProjectCard";
import { WorkGallery } from "./WorkGallery";

/**
 * The Work page: its opening statement, and the grid underneath it.
 *
 * LAYOUT NOTE. The grape wedge is the About hero's, unchanged, and every
 * part of it was paid for there: positioned against the *content box* with
 * a 100vw right bleed so the colour reaches the screen edge without the
 * boundary drifting away from the type as the window widens; an absolute
 * 9.5rem clip run so the angle holds rather than shearing with the block's
 * height; `inset-y-0` inside a wrapper holding only the copy, so its bottom
 * edge lands where the chip row begins without a hardcoded height; left
 * padding past the *whole* run, because a leaning edge otherwise needs an
 * inset that depends on the block's height, which depends on its own
 * measure; and the split at `xl`, because below 1280px the remaining
 * measure is under 300px and strands a few lines in a huge field.
 *
 * The wedge says what the grid adds up to. It is true by construction from
 * the data rather than an invented aggregate, so it cannot go stale: six
 * projects, six distinct services.
 *
 * HERO AND GRID IN ONE SECTION, because the wedge's bottom edge has to
 * align with the chip row and that only falls out of the markup if they
 * share an ancestor. The grid's own heading is visually hidden: the page
 * `h1` already names the content, but `WorkGallery` still needs something
 * for the section to be labelled by.
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
                Campaigns that <span className="text-pop italic">popped,</span> in numbers.
              </>
            }
            lead="A sample of what happens when strategy, production and distribution live under one roof."
            className="rise pt-16 pb-12 rise-delay-0 xl:py-25"
          />

          <div className="relative rise rounded-card bg-grape p-8 rise-delay-1 xl:rounded-none xl:bg-transparent xl:p-0 xl:pl-44">
            <Eyebrow tone="dark">Across the board</Eyebrow>

            <p className="mt-6 font-display text-2xl leading-tight font-bold text-cream">
              Six campaigns. Six services.
            </p>

            <p className="mt-4 max-w-lg text-base leading-snug text-cream/80">
              One team on every one of them, from the first strategy session to the number at the
              end.
            </p>
          </div>
        </div>

        <div className="rise pb-section rise-delay-2 md:pb-section-lg xl:pt-4">
          {/* Visually hidden, but it has to exist: the cards are h3s, and
              without a rung between them and the page h1 the outline jumps
              h1 -> h3. It also gives the grid a name for anyone navigating
              by heading, which the chip row alone does not. */}
          <h2 className="sr-only">Selected projects</h2>

          <WorkGallery
            filters={projectFilters}
            items={projects.map((project) => ({
              id: project.id,
              category: project.category,
              // Rendered here, on the server. WorkGallery only ever sees the
              // finished node and the plain string beside it.
              card: <ProjectCard project={project} className="reveal" />,
            }))}
          />
        </div>
      </Container>
    </section>
  );
}
