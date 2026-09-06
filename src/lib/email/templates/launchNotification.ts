import { divider, eyebrow, heading, metaRow, metaTable } from "../components";
import { escapeHtml } from "../escape";
import { renderLayout } from "../layout";

/**
 * A launch-list signup, as it lands in the studio inbox.
 *
 * Deliberately thinner than the enquiry template: one address and a
 * timestamp is the whole payload, so a headline and two rows is all it
 * warrants. It shares the layout so both emails read as the same brand.
 */
export function renderLaunchNotification(input: { email: string; receivedAt: Date }): {
  subject: string;
  html: string;
  text: string;
} {
  const received = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(input.receivedAt);

  const body = [
    eyebrow("Launch list"),
    heading("One more signup."),
    metaTable(
      [
        metaRow("Email", escapeHtml(input.email), `mailto:${encodeURIComponent(input.email)}`),
        metaRow("Received", escapeHtml(received)),
      ].join(""),
    ),
    divider(24),
    `<p class="pc-soft" style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:21px;color:#6d6764;">They asked to hear from us on launch day.</p>`,
  ].join("\n");

  return {
    subject: `Launch list signup: ${input.email}`,
    html: renderLayout({
      preheader: `${input.email} wants to know when the site goes live.`,
      body,
      footer: "Sent by the holding page on popcornadvertising.com.",
    }),
    text: [
      "LAUNCH LIST SIGNUP",
      "",
      `Email:    ${input.email}`,
      `Received: ${received}`,
      "",
      "They asked to hear from us on launch day.",
    ].join("\n"),
  };
}
