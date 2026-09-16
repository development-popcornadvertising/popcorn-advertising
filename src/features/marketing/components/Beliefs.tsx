import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { beliefs } from "../data/beliefs";

import { NumberedCard } from "./NumberedCard";

/**
 * "What we believe": the three tests an idea has to pass.
 *
 * An <ol>, like the process steps, because these are in order rather than a
 * set: meaning comes before feeling, and both come before spending money on
 * placement. That ordering is also what earns the numbered badges.
 *
 * Three columns rather than the process section's four, so the cards stay
 * wide enough for a full sentence without wrapping to five lines.
 */
export function Beliefs() {
  return (
    <section aria-labelledby="beliefs-heading" className="py-section md:py-section-lg">
      <Container>
        <SectionHeading
          id="beliefs-heading"
          eyebrow="What we believe"
          title="Good work doesn't happen by accident."
          lead="The best ideas come from knowing what to say, knowing who to say it to, and knowing exactly where it needs to land."
        />

        <ol className="mt-14 grid gap-x-13 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {beliefs.map((belief, index) => (
            <NumberedCard key={belief.id} item={belief} index={index} className="reveal" />
          ))}
        </ol>
      </Container>
    </section>
  );
}
