import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * The full-bleed grape band between the hero and the process steps.
 *
 * The first live use of `Section`. `slice="both"` is exactly right here:
 * `slice-tb` cuts its top edge deepest at the left and its bottom edge
 * deepest at the right, so both diagonals rise to the right and the band
 * reads as one leaning stripe rather than a wedge.
 *
 * PADDING IS DELIBERATELY NOT THE DEFAULT. The clip eats 3.5rem at its
 * deepest point, and `Section`'s own `py-section` is 5rem, which would
 * leave 24px of clearance at the far left and let the cut graze the
 * eyebrow. The override buys that back.
 *
 * The three columns are not decoration. The heading names strategy,
 * production and placement, and without them the band was a heading on the
 * left and 600px of empty purple on the right; saying what each of the
 * three actually means is the content that space was missing.
 *
 * A <dl>, not headings. These are term and definition pairs, which is what
 * `dt`/`dd` mean, and it keeps three more `h3`s out of a document outline
 * that already carries four for the process cards.
 *
 * Flat grape with one soft highlight, not a gradient. The pink-into-purple
 * gradient is spent on the home page's why-us card and a second full-width
 * one would dilute it.
 */
const pillars = [
  {
    term: "Strategy",
    definition: "Positioning, audience and the number the work has to move.",
  },
  {
    term: "Production",
    definition: "Film, stills, design and edit, shot and finished by our own crew.",
  },
  {
    term: "Placement",
    definition: "Media, influencers and events, booked and run by the same team.",
  },
];

export function ApproachBand() {
  return (
    <Section
      tone="grape"
      slice="both"
      labelledBy="approach-heading"
      className="relative isolate overflow-hidden py-28 md:py-34"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_120%_at_78%_50%,var(--color-grape-soft)_0%,transparent_70%)]"
      />

      <SectionHeading
        id="approach-heading"
        tone="dark"
        eyebrow="Our approach"
        title="Strategy, production and placement, never handed off between agencies."
        lead="Every brief moves through the same team from first sketch to final metric, so ideas keep their shape from deck to delivery."
        leadClassName="max-w-[38rem]"
      />

      <dl className="mt-14 grid gap-x-12 gap-y-9 sm:grid-cols-3">
        {pillars.map((pillar) => (
          <div key={pillar.term} className="border-t border-white/25 pt-6">
            <dt className="font-display text-xl font-extrabold text-white">{pillar.term}</dt>
            <dd className="mt-2 text-base leading-snug text-white/75">{pillar.definition}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
