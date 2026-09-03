/**
 * The shape every Server Action in this project returns.
 *
 * Types only, no runtime imports, so a client component can `import type`
 * from here without pulling zod or any server module into its bundle.
 */
export type FieldErrors<TField extends string> = Partial<Record<TField, string>>;

export type FormState<TField extends string = string> =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: FieldErrors<TField>;
      /**
       * Echoed input. React 19 resets uncontrolled inputs once an action
       * completes, so without this a validation error wipes what the user
       * typed. Feed it back through `defaultValue`.
       */
      values?: Partial<Record<TField, string>>;
    };
