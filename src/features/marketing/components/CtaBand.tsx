import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/siteConfig";

interface CtaBandProps {
  /** Must be unique per page. */
  headingId?: string;
  title?: string;
  ctaLabel?: string;
}

/**
 * The closing call to action.
 *
 * Props with defaults rather than a hardcoded block, because the About page
 * will want the same band with different words.
 */
export function CtaBand({
  headingId = "cta-heading",
  title = "Got a brand that needs to POP?",
  ctaLabel = "Let's Talk",
}: CtaBandProps) {
  return (
    <section aria-labelledby={headingId} className="py-section md:py-section-lg">
      <div className="mx-auto w-full max-w-[97.5rem] px-6 md:px-10">
        <div className="overflow-hidden rounded-card">
          <PopcornEdge />

          <div className="bg-butter pt-8 pb-14 md:pt-14 md:pb-22">
            <Container className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <h2
                id={headingId}
                className="max-w-[30rem] text-4xl leading-none font-extrabold tracking-[-0.015em] text-ink"
              >
                {title}
              </h2>

              <Button href={siteConfig.cta.href} hasArrow className="shrink-0">
                {ctaLabel}
              </Button>
            </Container>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * The bumpy popcorn silhouette along the card's top edge.
 *
 * An SVG `<pattern>` in `userSpaceOnUse`, so the tile is a fixed 200 x 60
 * user units no matter how wide the card gets. That is the whole point: a
 * single stretched path would flatten the lobes into ellipses on a wide
 * screen, whereas a repeating tile keeps every lobe circular at any width.
 * The first and last lobes are the same circle on the tile boundary, which
 * is what makes the repeat seamless.
 *
 * Lobe radii and centres vary deliberately. An even scallop reads as
 * decoration; an uneven one reads as popcorn.
 *
 * Two constraints hold the tile together. Every circle bottoms out at
 * exactly y=60, the tile's height: a pattern repeats vertically as well as
 * horizontally, so anything hanging below would wrap around and print
 * stray arcs across the top edge. And the circles at x=0 and x=200 are the
 * same circle, so consecutive tiles join without a seam.
 */
function PopcornEdge() {
  return (
    <svg aria-hidden="true" focusable="false" className="block h-10 w-full text-butter md:h-15">
      <defs>
        <pattern id="popcorn-edge" width="200" height="60" patternUnits="userSpaceOnUse">
          <g fill="currentColor">
            <rect y="40" width="200" height="20" />
            <circle cx="0" cy="36" r="24" />
            <circle cx="42" cy="31" r="29" />
            <circle cx="88" cy="38" r="22" />
            <circle cx="130" cy="33" r="27" />
            <circle cx="172" cy="40" r="20" />
            <circle cx="200" cy="36" r="24" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#popcorn-edge)" />
    </svg>
  );
}
