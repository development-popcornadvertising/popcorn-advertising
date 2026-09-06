import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { processSteps } from "../data/process";

import { ProcessCard } from "./ProcessCard";

/**
 * The four stages of a brief.
 *
 * An <ol>, not a <ul>: these happen in order, and the list type is what
 * carries that to a screen reader. It is also why the cards can hide their
 * numbers from the accessibility tree.
 */
export function ProcessSteps() {
  return (
    <section aria-labelledby="process-heading" className="py-section md:py-section-lg">
      <Container>
        <SectionHeading
          id="process-heading"
          eyebrow="How we work"
          title="From brief to buzz."
          lead="Four stages, one team, no gaps in between. Every brief runs the same route, which is how nothing gets lost on the way."
        />

        <ol className="mt-14 grid gap-x-13 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
          {processSteps.map((step, index) => (
            <ProcessCard key={step.id} step={step} index={index} className="reveal" />
          ))}
        </ol>
      </Container>
    </section>
  );
}
