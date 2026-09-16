import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

import { services } from "../data/services";

import { ServiceCard } from "./ServiceCard";

/**
 * The twelve disciplines.
 *
 * The heading counts, so the list has to stay at twelve. Two slots changed
 * meaning rather than being added to: Podcast Production became Social Media
 * Management, and Events Coverage became AI Video Production once Event
 * Management absorbed coverage.
 *
 * Column counts climb 1 → 2 → 3 → 4. Four only arrives at `xl` because the
 * comp's cards are 255px wide with a 53px gutter, so a four-up row needs
 * 1179px of content and would crush below that.
 */
export function ServicesGrid() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="scroll-mt-[var(--header-height)] py-section md:py-section-lg"
    >
      <Container>
        <SectionHeading
          id="services-heading"
          eyebrow="What we do best"
          title={
            <>
              One team, <span className="text-grape">twelve disciplines.</span>
            </>
          }
          lead="Everything a brand needs to launch, land and linger, handled under one roof, so nothing gets lost between the strategy deck and the final cut."
        />

        <ul className="mt-14 grid gap-x-13 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} className="reveal" />
          ))}
        </ul>
      </Container>
    </section>
  );
}
