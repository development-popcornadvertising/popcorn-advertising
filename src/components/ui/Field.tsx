import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

interface BaseFieldProps {
  /** Also becomes the element id, so server-returned errors can target it. */
  name: string;
  label: string;
  hint?: string;
  /** Server- or client-supplied message. Its presence sets aria-invalid. */
  error?: string;
  /** Disambiguates ids when two forms on one page share field names. */
  idPrefix?: string;
  /**
   * A control rendered inside the field's trailing edge, typically a submit
   * button. Supplying it switches the field to the inline layout: input and
   * action share one rounded surface, and the label is announced but not
   * drawn. Correct for a single-field form, where a drawn uppercase label
   * plus a hint plus a full-width button is three rows of chrome around one
   * text box.
   */
  action?: ReactNode;
  className?: string;
}

type InputVariant = { multiline?: false } & Omit<
  ComponentPropsWithoutRef<"input">,
  "id" | "name" | "className"
>;

type TextareaVariant = { multiline: true } & Omit<
  ComponentPropsWithoutRef<"textarea">,
  "id" | "name" | "className"
>;

export type FieldProps = BaseFieldProps & (InputVariant | TextareaVariant);

/**
 * A labelled input with inline error messaging wired for screen readers.
 *
 * Deliberately hook-free and directive-free so it works in a Server
 * Component and in a client form alike. Ids derive from `name` rather than
 * `useId` for two reasons: `useId` would force this into a Client
 * Component, and a server-rendered error needs to reference an id that
 * predictably exists.
 */
export function Field({
  name,
  label,
  hint,
  error,
  idPrefix,
  action,
  className,
  multiline,
  ...rest
}: FieldProps) {
  const id = idPrefix ? `${idPrefix}-${name}` : name;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ");

  const isInline = action !== undefined;

  const shared = {
    id,
    name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
  };

  const controlStyles = isInline
    ? "text-ink placeholder:text-ink-soft/55 min-w-0 flex-1 bg-transparent px-5 py-3 outline-none"
    : cn(
        // Paper on cream with a visible edge. A cream-deep fill on a
        // transparent border left the most important control on the page
        // looking like an inert slab, which is an affordance problem before
        // it is a styling one.
        "bg-paper text-ink placeholder:text-ink-soft/55",
        "mt-2 w-full rounded-xl border px-4 py-3",
        "transition-[border-color,box-shadow] duration-200 outline-none",
        "hover:border-ink/25 focus:border-grape focus:ring-4 focus:ring-grape/15",
        error ? "border-pop" : "border-ink/12",
      );

  const messages = (
    <>
      {hint ? (
        <p id={hintId} className="mt-3 text-xs text-ink-soft/75">
          {hint}
        </p>
      ) : null}

      {/* No role="alert" per field: N invalid fields would fire N
          announcements. One summary alert lives beside the submit. */}
      {error ? (
        <p id={errorId} className="mt-2.5 text-sm font-medium text-pop">
          {error}
        </p>
      ) : null}
    </>
  );

  if (isInline) {
    return (
      <div className={className}>
        <label htmlFor={id} className="sr-only">
          {label}
        </label>

        <div
          className={cn(
            "flex items-center gap-2 rounded-pill border bg-paper p-1.5",
            "shadow-sm shadow-ink/5 transition-[border-color,box-shadow] duration-200",
            "focus-within:border-grape focus-within:ring-4 focus-within:ring-grape/15",
            error ? "border-pop" : "border-ink/12",
          )}
        >
          <input {...shared} className={controlStyles} {...(rest as InputVariant)} />
          {action}
        </div>

        {messages}
      </div>
    );
  }

  return (
    <div className={cn("mt-6 first:mt-0", className)}>
      <label htmlFor={id} className="text-xs font-medium tracking-[0.12em] text-ink uppercase">
        {label}
      </label>

      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-ink-soft/80">
          {hint}
        </p>
      ) : null}

      {multiline ? (
        <textarea rows={5} {...shared} {...(rest as TextareaVariant)} />
      ) : (
        <input {...shared} {...(rest as InputVariant)} />
      )}

      {/* No role="alert" per field: N invalid fields would fire N
          announcements. One summary alert lives above the submit button. */}
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-pop">
          {error}
        </p>
      ) : null}
    </div>
  );
}
