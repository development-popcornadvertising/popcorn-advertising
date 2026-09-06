import { escapeHtml } from "./escape";
import { email, emailDark } from "./tokens";

interface LayoutOptions {
  /** Shown in the inbox list beside the subject. Never rendered in the body. */
  preheader: string;
  /** The card's contents, already escaped by the caller. */
  body: string;
  /** Small print under the card. Already escaped. */
  footer: string;
}

/**
 * The shell every branded email is poured into.
 *
 * WHY IT LOOKS LIKE 1999. HTML email is not the web:
 *
 * - Outlook renders through Word, which has no flexbox, no grid, and
 *   unreliable margins on a div. Layout is nested tables, and every one of
 *   them zeroes cellpadding, cellspacing and border or Outlook adds its own.
 * - Styles are inline on the elements that need them. The <style> block is
 *   progressive enhancement only (dark mode, one mobile query), because the
 *   Gmail app strips it for non-Gmail accounts.
 * - There are no images. Every major client blocks remote images by
 *   default, so a logo renders as a broken box on first open. The wordmark
 *   is letterspaced type instead, which cannot fail to load.
 * - Total output stays well under 102KB. Past that Gmail clips the message
 *   and hides the rest behind "View entire message", which would truncate a
 *   long enquiry.
 *
 * The preheader is the hidden line the inbox shows next to the subject.
 * Without it, clients scrape the first visible text, which would be the
 * wordmark. It is followed by a run of zero-width joiners so the client
 * cannot pull body copy in after it.
 */
export function renderLayout({ preheader, body, footer }: LayoutOptions): string {
  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light dark" />
<meta name="supported-color-schemes" content="light dark" />
<title>${escapeHtml(preheader)}</title>
<style>
  /* Dark mode is honoured by Apple Mail and iOS. Gmail and Outlook force
     their own inversion no matter what is declared here, so the palette is
     picked to survive being inverted rather than to fight it. */
  @media (prefers-color-scheme: dark) {
    .pc-page { background: ${emailDark.cream} !important; }
    .pc-card { background: ${emailDark.paper} !important; border-color: ${emailDark.line} !important; }
    .pc-ink { color: ${emailDark.ink} !important; }
    .pc-soft { color: ${emailDark.inkSoft} !important; }
    .pc-rule { background: ${emailDark.line} !important; }
  }
  @media only screen and (max-width: 620px) {
    .pc-card { padding: 28px 24px !important; }
    .pc-h1 { font-size: 26px !important; }
  }
  /* Stops iOS turning phone numbers and dates into tappable blue links. */
  a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
</style>
</head>
<body class="pc-page" style="margin:0;padding:0;background:${email.cream};">
<div style="display:none;font-size:1px;color:${email.cream};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}${"&#8204;&nbsp;".repeat(60)}</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="pc-page" style="background:${email.cream};">
  <tr>
    <td align="center" style="padding:40px 16px;">

      <table role="presentation" width="${email.width}" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:${email.width}px;">
        <tr>
          <td style="padding:0 0 22px 4px;">
            <span class="pc-ink" style="font-family:${email.font};font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${email.ink};">Popcorn</span>
            <span style="font-family:${email.font};font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${email.grape};">&nbsp;Advertising</span>
          </td>
        </tr>

        <tr>
          <td class="pc-card" style="background:${email.paper};border:1px solid ${email.line};border-radius:14px;padding:40px;">
            ${body}
          </td>
        </tr>

        <tr>
          <td class="pc-soft" style="padding:22px 4px 0;font-family:${email.font};font-size:12px;line-height:19px;color:${email.inkSoft};">
            ${footer}
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>
</body>
</html>`;
}
