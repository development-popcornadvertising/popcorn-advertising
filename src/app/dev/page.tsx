import type { ReactNode } from "react";

import { notFound } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatList } from "@/components/ui/StatList";
import { cn } from "@/lib/cn";

/**
 * Every primitive in every state, on one screen.
 *
 * Guarded on VERCEL_ENV rather than NODE_ENV: NODE_ENV is "production" on
 * Vercel *preview* builds too, which would hide this route from the exact
 * shared-review use case it exists for. Blocking only the production
 * deployment keeps it available on previews and in local production builds.
 * robots.ts disallows /dev regardless.
 */
export default function DevPage() {
  if (process.env.VERCEL_ENV === "production") notFound();

  return (
    <>
      <Container className="space-y-16 py-20">
        <Row label="Button variants">
          <Button variant="solid">Solid</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </Row>

        <Row label="Button sizes and states">
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
          <Button href="/about" size="lg">
            Renders an anchor
          </Button>
        </Row>

        <Row label="Eyebrow">
          <Eyebrow>What we do best</Eyebrow>
          <div className="rounded-card bg-grape p-4">
            <Eyebrow tone="dark">Why brands pick Popcorn</Eyebrow>
          </div>
        </Row>

        <div>
          <Label>StatList, inline</Label>
          <StatList
            className="mt-4"
            stats={[
              { value: "12+", label: "Services in-house" },
              { value: "150+", label: "Campaigns launched" },
              { value: "40+", label: "Brands popped" },
            ]}
          />
        </div>

        <div>
          <Label>StatList, cards</Label>
          <StatList
            className="mt-4"
            variant="cards"
            stats={[
              { value: "9 yrs", label: "In business" },
              { value: "40+", label: "Brands served" },
              { value: "150+", label: "Campaigns delivered" },
              { value: "12", label: "Services, one team" },
            ]}
          />
        </div>

        <div>
          <Label>cn() conflict resolution</Label>
          <p className="mt-2 max-w-xl text-sm">
            Each element is given a base class and a conflicting override. If <code>cn</code> is
            wired correctly only the override survives, so every box below is square. None should
            look pill-shaped or blended. The custom <code>--radius-*</code> and{" "}
            <code>--spacing-*</code> tokens are the ones tailwind-merge cannot resolve unless they
            are registered in <code>src/lib/cn.ts</code>.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className={cn("rounded-pill bg-pop px-4 py-2 text-white", "rounded-none")}>
              rounded-pill → rounded-none
            </span>
            <span className={cn("rounded-card bg-grape-tint px-4 py-2 text-grape", "rounded-none")}>
              rounded-card → rounded-none
            </span>
            <span className={cn("bg-cream-deep px-4 py-section text-ink", "py-2")}>
              py-section → py-2
            </span>
            <Button className="rounded-none">Button base → rounded-none</Button>
          </div>
        </div>
      </Container>

      <Section tone="cream" labelledBy="dev-cream" slice="bottom">
        <SectionHeading
          id="dev-cream"
          eyebrow="Section, cream, sliced bottom"
          title="One team, twelve disciplines."
          lead="This is the lead paragraph, rendered at text-lg in ink-soft on the cream tone."
        />
      </Section>

      <Section tone="grape" labelledBy="dev-grape" slice="both">
        <SectionHeading
          id="dev-grape"
          tone="dark"
          eyebrow="Section, grape, sliced both"
          title="Built for brands that want it all handled."
          lead="Check this text passes 4.5:1 against the grape background, and that the diagonal clip never cuts a glyph."
        />
      </Section>

      <Section tone="ink" labelledBy="dev-ink">
        <SectionHeading
          id="dev-ink"
          tone="dark"
          eyebrow="Section, ink, no slice"
          title="Ideas that pop. Results that stay."
        />
      </Section>
    </>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="font-display text-sm tracking-[0.12em] text-ink uppercase">{children}</p>;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-4 flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}
