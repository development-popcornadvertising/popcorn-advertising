import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";

/**
 * The founder's message, on a pop band.
 *
 * THE FIRST FULL-BLEED POP SECTION on the site, which is why `Section` gains
 * a `pop` tone for it. Pop is otherwise rationed to one accent per section,
 * so a whole band of it only works because it sits between two cream
 * sections and runs once.
 *
 * `slice="both"` gives it the same leaning top and bottom edges as the
 * approach band further down, so the two read as the same device in two
 * colours rather than two different ideas.
 *
 * PADDING IS NOT THE DEFAULT, for the reason the approach band records: the
 * clip eats 3.5rem at its deepest point against `py-section`'s 5rem, which
 * leaves 24px of clearance at the far left and lets the cut graze the
 * eyebrow.
 *
 * ⚠️ NO PHOTO YET. The comp shows a tilted portrait card beside the copy.
 * There is no founder image in src/assets, and rendering the card empty
 * would put a blank white rectangle on the page, which is the one thing this
 * design has repeatedly rejected. So the copy runs at a readable measure on
 * its own until the photograph arrives; dropping it in is a grid column and
 * an <Image>, not a rewrite.
 */
export function FounderMessage() {
  return (
    <Section
      tone="pop"
      slice="both"
      labelledBy="founder-heading"
      className="relative isolate overflow-hidden py-28 md:py-34"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_120%_at_78%_50%,var(--color-pop-deep)_0%,transparent_70%)]"
      />

      <Eyebrow tone="dark">Founder message</Eyebrow>

      <h2
        id="founder-heading"
        className="mt-6 font-display text-4xl leading-none font-extrabold tracking-[-0.015em] text-white"
      >
        Rachit Dewan
      </h2>

      {/* A <p>, not an h3. The role is a caption on the name above it, and
          promoting it to a heading would put "Founder & Director" into the
          document outline as a section of its own. */}
      <p className="mt-2 text-lg text-white/80">Founder &amp; Director</p>

      <div className="mt-8 max-w-[46rem] space-y-5 text-base leading-relaxed text-white/85">
        <p>
          A visionary storyteller with a passion for creating brands that connect through
          authenticity, the founder believes marketing should be both refreshing and impactful.
        </p>

        <p>
          Guided by the philosophy that real stories make real brands, the focus is on crafting
          meaningful narratives that resonate with audiences, build trust and leave a lasting
          impression. Blending creativity with strategy turns a business&apos;s ideas into brand
          stories that inspire engagement and drive growth.
        </p>
      </div>
    </Section>
  );
}
