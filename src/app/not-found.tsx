import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Deliberately self-contained.
 *
 * Two reasons. This file only ever receives the root layout, so once the
 * Header and Footer land in Phase 2 it would otherwise have no chrome even
 * after launch. And while SITE_MODE is "coming-soon" every site route
 * redirects to "/", so linking to /contact here would bounce the visitor
 * somewhere they did not ask to go. One exit, always correct.
 */
export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <Logo />

      <p className="mt-12 font-display text-6xl text-pop">404</p>

      <h1 className="mt-6 text-3xl">This one didn&apos;t pop.</h1>

      <p className="mt-4 max-w-sm">
        The page you&apos;re after has moved or never existed. Head back and start again.
      </p>

      <Button href="/" size="lg" className="mt-8">
        Back home
      </Button>
    </Container>
  );
}
