"use client";

import type { ReactNode } from "react";

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
      {pending ? pendingLabel : children}
    </Button>
  );
}
