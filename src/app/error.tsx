"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * Route-level error boundary.
 *
 * Without this a render error shows Next's default error screen, which is
 * unbranded and tells the visitor nothing actionable. Client Component by
 * requirement — error boundaries need state.
 */
export default function RouteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-5xl text-pop">Oops.</p>

      <h1 className="mt-6 text-3xl">Something went wrong.</h1>

      <p className="mt-4 max-w-sm">
        That is on us, not you. Give it another go. If it keeps happening, email us and we&apos;ll
        sort it out.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="outline">
          Back home
        </Button>
      </div>
    </Container>
  );
}
