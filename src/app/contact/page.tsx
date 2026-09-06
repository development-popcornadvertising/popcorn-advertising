import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/features/contact/components/ContactForm";
import { ContactInfo } from "@/features/contact/components/ContactInfo";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about the campaign. Popcorn Advertising handles strategy, production and placement in-house, and replies within a day.",
  alternates: { canonical: "/contact" },
};

// No `isComingSoon` branch. /contact is in GATED_PATHS, so under
// `coming-soon` the build-time redirect in next.config.ts catches the
// request before this file is ever reached.
//
// No CtaBand either: this page IS the call to action, and closing it with a
// button that links back to itself would be a loop.
export default function ContactPage() {
  return (
    <section aria-labelledby="contact-heading" className="relative overflow-hidden">
      <Container className="relative">
        <div className="relative py-16 xl:grid xl:grid-cols-2 xl:items-center xl:gap-x-4 xl:py-24">
          {/* The wedge, third use. Anchored to the content box with a 100vw
              bleed so the colour reaches the screen edge, and an absolute
              9.5rem clip run so the angle holds rather than shearing with
              the block's height. See AboutHero for the full reasoning.

              Unlike About and Work, nothing here has to dodge the diagonal:
              the form is an opaque card that sits ON the boundary and covers
              it, which is why this column needs no clearance padding. */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 -right-[100vw] left-[54%] hidden bg-grape [clip-path:polygon(9.5rem_0,100%_0,100%_100%,0_100%)] xl:block"
          />

          <ContactInfo />

          {/* `relative` is load-bearing, not decoration. The wedge above is
              absolutely positioned, so it paints over any sibling that is
              NOT positioned. The form itself happened to carry `relative`
              and survived; the success state did not, and the grape wedge
              painted straight over it, leaving a clipped sliver reading
              "Thanks. Your". Owning the layering here means neither state
              can lose that race again. */}
          <div className="relative mt-14 rise rise-delay-4 xl:mt-0 xl:-ml-4">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
