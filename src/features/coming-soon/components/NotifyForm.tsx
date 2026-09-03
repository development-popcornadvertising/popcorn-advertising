"use client";

import { useActionState, useEffect, useRef } from "react";

import { Field } from "@/components/ui/Field";
import { HoneypotField } from "@/components/ui/HoneypotField";
import { SubmitButton } from "@/components/ui/SubmitButton";

import { subscribeToLaunch } from "../actions";

import type { NotifyFormState } from "../schema";

const INITIAL_STATE: NotifyFormState = { status: "idle" };

/**
 * Launch-notify signup.
 *
 * Uses useActionState with the Server Action handed straight to
 * `<form action>`, rather than react-hook-form. Two reasons: the form works
 * before hydration and with JavaScript off, and validating one email field
 * does not justify shipping react-hook-form plus zod to the browser — it
 * would roughly triple this page's 10 kB of application JavaScript. The
 * four-field contact form in Phase 6 is where per-field onBlur feedback
 * starts to earn that weight.
 *
 * Client-side feedback here comes from the platform: `type="email"` plus
 * `required`, styled via `:user-invalid` in globals.css, which applies only
 * after the user has interacted — the same semantics as onBlur, for free.
 */
export function NotifyForm() {
  const [state, formAction] = useActionState(subscribeToLaunch, INITIAL_STATE);
  const outcomeRef = useRef<HTMLParagraphElement>(null);

  // Move focus to the outcome so a keyboard or screen-reader user is not
  // left sitting in a field that has already been submitted.
  useEffect(() => {
    if (state.status !== "idle") outcomeRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <p
        ref={outcomeRef}
        tabIndex={-1}
        role="status"
        className="max-w-md rounded-card bg-paper p-6 text-ink"
      >
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="relative max-w-md">
      <Field
        name="email"
        idPrefix="notify"
        type="email"
        label="Email address"
        placeholder="you@company.com"
        hint="One email, on launch day. Nothing else."
        autoComplete="email"
        inputMode="email"
        required
        // React 19 resets uncontrolled inputs once an action completes, so
        // without echoing the value back a validation error wipes what the
        // user typed.
        defaultValue={state.status === "error" ? state.values?.email : undefined}
        error={state.status === "error" ? state.fieldErrors?.email : undefined}
        action={
          <SubmitButton size="md" pendingLabel="Adding you" className="shrink-0">
            Notify me
          </SubmitButton>
        }
      />

      <HoneypotField idPrefix="notify" />

      {/* Rendered unconditionally so the live region exists in the DOM
          before a message ever arrives. A region added at the same moment
          as its content is unreliably announced. */}
      <p ref={outcomeRef} tabIndex={-1} role="alert" className="mt-3 text-sm text-pop empty:mt-0">
        {state.status === "error" && !state.fieldErrors?.email ? state.message : null}
      </p>
    </form>
  );
}
