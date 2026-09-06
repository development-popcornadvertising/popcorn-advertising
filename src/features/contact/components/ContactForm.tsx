"use client";

import { useActionState, useEffect, useRef } from "react";

import { Field } from "@/components/ui/Field";
import { HoneypotField } from "@/components/ui/HoneypotField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { STARTED_AT_FIELD } from "@/lib/honeypot";

import { submitContact } from "../actions";

import type { ContactFormState, ContactInput } from "../schema";

const INITIAL_STATE: ContactFormState = { status: "idle" };

// A type-only import, so the schema module and zod with it are erased at
// compile time and never reach the browser bundle.
type ContactField = keyof ContactInput;

/**
 * The project enquiry form.
 *
 * `useActionState` with the Server Action handed straight to `<form action>`,
 * not react-hook-form. IMPLEMENTATION.md's Phase 6 asks for react-hook-form
 * plus a resolver, but AGENTS.md overrides it and says why: those two would
 * roughly triple this page's application JavaScript, and the project holds a
 * hard line on its own contribution to the bundle. This way the form also
 * works before hydration and with JavaScript off.
 *
 * The per-field feedback that pushed the doc toward a library comes from the
 * platform instead. `required`, `type="email"`, `minLength` and `maxLength`
 * pass straight through `Field` to the control, so the browser catches an
 * empty or malformed field before a request is ever made, and `:user-invalid`
 * in globals.css styles it only after the user has interacted. Zod on the
 * server stays the real gate: client validation is a convenience, never a
 * control.
 *
 * THE TIMESTAMP MUST BE SET HERE, not rendered. This route is statically
 * prerendered, so a `Date.now()` written during render would be frozen at
 * build time and every submission would look hours old. Setting it in an
 * effect also means it is absent with JavaScript off, which the action
 * handles by waving the check through rather than rejecting.
 */
export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, INITIAL_STATE);
  const outcomeRef = useRef<HTMLParagraphElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);

  // Written to the DOM rather than held in state: the value is only ever
  // read back out by FormData, so a re-render to store it would buy nothing.
  // It also survives a failed submit, which is correct, since by then the
  // visitor has been on the page even longer.
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  // Move focus to the outcome so a keyboard or screen-reader user is not
  // left sitting in a field that has already been submitted.
  useEffect(() => {
    if (state.status !== "idle") outcomeRef.current?.focus();
  }, [state]);

  // Both read nothing on a fresh or successful form, which is what makes
  // the four call sites below one line each instead of four.
  const errorFor = (field: ContactField) =>
    state.status === "error" ? state.fieldErrors?.[field] : undefined;

  const valueFor = (field: ContactField) =>
    state.status === "error" ? state.values?.[field] : undefined;

  if (state.status === "success") {
    return (
      <p
        ref={outcomeRef}
        tabIndex={-1}
        role="status"
        className="rounded-card bg-paper p-8 text-lg leading-snug text-ink shadow-[0_2px_4px_-2px_rgb(60_54_52_/_0.06),0_18px_40px_-18px_rgb(60_54_52_/_0.25)]"
      >
        {state.message}
      </p>
    );
  }

  return (
    <form
      action={formAction}
      className="relative rounded-card bg-paper p-7 shadow-[0_2px_4px_-2px_rgb(60_54_52_/_0.06),0_18px_40px_-18px_rgb(60_54_52_/_0.25)] sm:p-9"
    >
      <Field
        name="name"
        idPrefix="contact"
        label="Name"
        placeholder="Your name"
        autoComplete="name"
        minLength={2}
        maxLength={80}
        required
        defaultValue={valueFor("name")}
        error={errorFor("name")}
      />

      <Field
        name="email"
        idPrefix="contact"
        type="email"
        label="Email"
        placeholder="you@company.com"
        autoComplete="email"
        inputMode="email"
        maxLength={254}
        required
        defaultValue={valueFor("email")}
        error={errorFor("email")}
      />

      <Field
        name="company"
        idPrefix="contact"
        label="Brand / company"
        placeholder="Company name"
        autoComplete="organization"
        maxLength={120}
        required
        defaultValue={valueFor("company")}
        error={errorFor("company")}
      />

      <Field
        multiline
        name="message"
        idPrefix="contact"
        label="What do you need?"
        placeholder="Tell us a bit about the project"
        minLength={10}
        maxLength={2000}
        required
        defaultValue={valueFor("message")}
        error={errorFor("message")}
      />

      <HoneypotField idPrefix="contact" />
      <input ref={startedAtRef} type="hidden" name={STARTED_AT_FIELD} defaultValue="" />

      {/* Rendered unconditionally so the live region exists in the DOM before
          a message ever arrives. A region added at the same moment as its
          content is unreliably announced. */}
      <p ref={outcomeRef} tabIndex={-1} role="alert" className="mt-5 text-sm text-pop empty:mt-0">
        {state.status === "error" ? state.message : null}
      </p>

      <SubmitButton pendingLabel="Sending" className="mt-6 w-full">
        Send message
      </SubmitButton>
    </form>
  );
}
