import { email } from "./tokens";

/**
 * The small pieces the templates are assembled from.
 *
 * Every one takes copy that is ALREADY ESCAPED. Escaping happens at the
 * template boundary, where raw input first meets markup, so these can stay
 * pure string builders and there is exactly one place to audit.
 */

/** The pop eyebrow above a heading. Letterspaced, small, one of two accents. */
export function eyebrow(text: string): string {
  return `<p style="margin:0 0 14px;font-family:${email.font};font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${email.pop};">${text}</p>`;
}

/** The card's headline. */
export function heading(text: string): string {
  return `<h1 class="pc-h1 pc-ink" style="margin:0;font-family:${email.font};font-size:30px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;color:${email.ink};">${text}</h1>`;
}

/** A body paragraph. */
export function paragraph(text: string, marginTop = 18): string {
  return `<p class="pc-soft" style="margin:${marginTop}px 0 0;font-family:${email.font};font-size:15px;line-height:24px;color:${email.inkSoft};">${text}</p>`;
}

/**
 * A hairline, with its own breathing room above and below.
 *
 * A table, not an <hr>: Outlook styles an hr unpredictably and ignores most
 * of its CSS. The space comes from spacer ROWS rather than a margin on the
 * rule, because margin does nothing on a table cell -- the first version of
 * this shipped with `margin` and the rule sat flush against the next
 * heading in every client.
 */
export function divider(margin = 28): string {
  const spacer = `<tr><td style="height:${margin}px;line-height:${margin}px;font-size:0;">&nbsp;</td></tr>`;

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    ${spacer}
    <tr><td class="pc-rule" style="height:1px;line-height:1px;font-size:0;background:${email.line};">&nbsp;</td></tr>
    ${spacer}
  </table>`;
}

/**
 * One label/value row of the enquiry summary.
 *
 * Label above value rather than beside it: a two-column layout collapses
 * badly on a phone, and there is no reliable way to stack table cells
 * without media queries that half the clients ignore.
 */
export function metaRow(label: string, value: string, href?: string): string {
  // The anchor carries pc-ink too. Without it the inline `color` beats the
  // class on the parent <p> and the address renders near-invisible dark-on-
  // dark in dark mode, which is exactly what happened the first time.
  const inner = href
    ? `<a class="pc-ink" href="${href}" style="color:${email.ink};text-decoration:none;border-bottom:1px solid ${email.line};">${value}</a>`
    : value;

  return `<tr>
    <td style="padding:0 0 16px;">
      <p class="pc-soft" style="margin:0 0 3px;font-family:${email.font};font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${email.inkSoft};">${label}</p>
      <p class="pc-ink" style="margin:0;font-family:${email.font};font-size:15px;line-height:22px;color:${email.ink};">${inner}</p>
    </td>
  </tr>`;
}

/** Wraps meta rows in their own table. */
export function metaTable(rows: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:26px;">${rows}</table>`;
}

/**
 * The message, set off by a grape rule.
 *
 * A left border on a table cell, because a blockquote's default indent
 * differs across clients and Outlook ignores most of its styling.
 */
export function quote(html: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="border-left:3px solid ${email.grape};padding:2px 0 2px 18px;">
        <p class="pc-ink" style="margin:0;font-family:${email.font};font-size:16px;line-height:26px;color:${email.ink};">${html}</p>
      </td>
    </tr>
  </table>`;
}

/**
 * A bulletproof button.
 *
 * A padded anchor inside a table cell, never a styled div. `mso-padding-alt`
 * plus the non-breaking spaces are what give Outlook its padding, since it
 * ignores padding on an inline element: the spaces reserve the width and
 * `mso-text-raise` centres the label vertically inside it.
 */
export function button(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:30px;">
    <tr>
      <td align="center" bgcolor="${email.pop}" style="border-radius:999px;">
        <a href="${href}" style="display:inline-block;padding:14px 30px;font-family:${email.font};font-size:15px;font-weight:600;line-height:1;color:#ffffff;text-decoration:none;border-radius:999px;mso-padding-alt:0;">
          <!--[if mso]><i style="letter-spacing:30px;mso-font-width:-100%;mso-text-raise:26pt;">&nbsp;</i><![endif]-->
          <span style="mso-text-raise:13pt;">${label}</span>
          <!--[if mso]><i style="letter-spacing:30px;mso-font-width:-100%;">&nbsp;</i><![endif]-->
        </a>
      </td>
    </tr>
  </table>`;
}
