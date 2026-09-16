import showreelPoster from "@/assets/brand/showreel-poster.jpg";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { VideoPanel } from "@/components/ui/VideoPanel";

import { ClientLogos } from "./ClientLogos";

/**
 * "Why brands pick Popcorn", plus the client wall that frames it.
 *
 * THE TILT. The comp runs a gradient band and a logo strip together at
 * −3 degrees, and the logos genuinely rotate with the band (Starbucks and
 * Deloitte both sit on the same sloped baseline), so those two are one
 * rotated unit. The band is deliberately taller than it looks: its top edge
 * is a hard horizontal cut in the comp, which is the section clipping a
 * shape that continues past it, so it is oversized and pulled up rather
 * than sized to what shows.
 *
 * The wrapper overshoots the viewport width so the corners a rotation
 * leaves behind never expose the page underneath. `body` carries
 * `overflow-x: clip` for the same reason at document level.
 *
 * THE CARD is the opposite case: its shape leans but the heading inside sits
 * on a level baseline, so the gradient is a transformed decorative layer and
 * the content is an ordinary upright grid on top of it. That keeps every
 * glyph out of a transformed subtree.
 *
 * The shape needs a skew as well as a rotation, which is not decoration for
 * its own sake. Measuring the comp, the top edge rises about 5 degrees to
 * the right while the left edge leans 7.5 degrees the other way; a rotation
 * moves both together, so it can satisfy one or the other but never both.
 * The rotation lifts the horizontals and the skew leans the verticals back.
 * A polygon clip would draw the quadrilateral exactly but cannot hold the
 * 48px corner radius, which carries more of the look than the last degree
 * of edge angle does.
 *
 * Everything straightens below `lg`, where a tilted composition just eats
 * corners.
 */
export function WhyUs() {
  return (
    <section id="why-us" aria-labelledby="why-heading" className="relative -mt-14 overflow-hidden">
      {/* Tilted band + logo strip, as one rotated unit. */}
      <div className="-mt-11 -ml-[6%] w-[112%] lg:-rotate-[3.05deg]">
        <div className="h-24 brand-gradient-x lg:h-29" />
        <div className="bg-cream">
          {/* Decorative: the same wall is announced once, lower down, where
              the "Work" anchor lands.

              Extra headroom over the component's default `py-5`: this strip
              sits directly under the gradient band, and at 20px the logos
              hugged its underside instead of sitting in a band of their own.
              The gap below is smaller on purpose — there is no lower edge to
              balance against, since the strip's cream runs straight into the
              page's. */}
          <ClientLogos isDecorative className="pt-15 pb-3" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[92.5rem] px-6 py-14 md:px-10 lg:pt-12 lg:pb-15 xl:pr-19 xl:pl-1">
        <div className="relative">
          {/* Rotation alone cannot draw this shape. In the comp the top edge
              rises about 5 degrees to the right while the left edge leans
              7.5 degrees the *other* way, and a rotation moves both together.
              A skew supplies the difference: the rotation lifts the
              horizontals, the skew leans the verticals back. Only the
              decorative layer is transformed, so no text is ever distorted. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-panel brand-gradient lg:frame-lean"
          />

          <div className="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-x-10 lg:p-10 lg:pr-14 xl:grid-cols-[1.055fr_1fr] xl:gap-x-0 xl:pt-8 xl:pr-24 xl:pb-24 xl:pl-22">
            <VideoPanel
              src="/showreel.mp4"
              poster={showreelPoster}
              label="the Popcorn Advertising showreel"
              className="aspect-4/3 w-full rounded-card lg:ml-6 lg:aspect-auto lg:h-full lg:min-h-88 lg:rounded-media lg:max-xl:-rotate-2 xl:min-h-118 xl:[transform:perspective(500px)_rotateX(19deg)_rotateZ(-3deg)]"
              sizes="(min-width: 1024px) 45vw, 90vw"
            />

            <div className="lg:text-right">
              <Eyebrow tone="dark">Why brands pick Popcorn</Eyebrow>

              <h2
                id="why-heading"
                className="mt-6 text-3xl leading-none font-extrabold tracking-[-0.015em] text-wrap text-white xl:text-4xl"
              >
                Built for brands that want it all handled - and handled well.
              </h2>

              <p className="mt-6 ml-auto max-w-md text-base leading-snug text-white/85">
                From brand identity to celebrity engagements, we plan, produce and place work that
                gets noticed, and keeps performing after the noise dies down.
              </p>

              {/* Pointed at /#services only while /about did not exist. It
                  does now, and a button labelled "More about us" landing on
                  the services grid was the wrong promise. */}
              <Button href="/about" hasArrow className="mt-8">
                More about us
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* The straight pass. The comp drops the tilt on the way out, which
          settles the composition before the CTA rather than leaving the
          whole lower page feeling askew. */}
      <div id="clients" className="scroll-mt-[var(--header-height)]">
        <h2 className="sr-only">Brands we have worked with</h2>
        <ClientLogos isReversed />
      </div>
      <div className="h-9 brand-gradient-x" />
    </section>
  );
}
