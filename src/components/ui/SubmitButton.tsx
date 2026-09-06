"use client";

import type { ReactNode } from "react";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "./Button";

interface SubmitButtonProps {
  children: ReactNode;
  pendingLabel: string;
  size?: "md" | "lg";
  className?: string;
}

/**
 * Submit button that reads its own pending state from the enclosing form.
 *
 * Uses useFormStatus rather than a prop so it can drop into any form
 * without the parent threading state down.
 *
 * A SPINNER, NOT JUST A LABEL SWAP. Swapping the text alone was too quiet:
 * a send takes a second or two, and in that gap the button looked to a
 * tester like it had not registered the click at all. A moving element is
 * the thing that reads as "working" rather than "broken".
 *
 * The spin is `motion-safe` only. Under reduced motion the icon still
 * appears and the label still changes, so the feedback survives without
 * anything rotating.
 */
export function SubmitButton({
  children,
  pendingLabel,
  size = "lg",
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size={size} disabled={pending} className={className}>
      {pending ? (
        <>
          <Loader2 className="size-4 shrink-0 motion-safe:animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
