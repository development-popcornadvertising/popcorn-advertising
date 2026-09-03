import { HONEYPOT_FIELD } from "@/lib/honeypot";

interface HoneypotFieldProps {
  idPrefix: string;
}

/**
 * A decoy input that real users never see, so it must stay empty.
 *
 * Positioned off-screen rather than `display: none`, because the more
 * capable bots skip hidden fields. `tabIndex={-1}` keeps it out of the tab
 * order, which is also why aria-hidden here does not trip axe's
 * aria-hidden-focus rule.
 */
export function HoneypotField({ idPrefix }: HoneypotFieldProps) {
  const id = `${idPrefix}-${HONEYPOT_FIELD}`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] size-px overflow-hidden"
    >
      <label htmlFor={id}>Website</label>
      <input id={id} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
