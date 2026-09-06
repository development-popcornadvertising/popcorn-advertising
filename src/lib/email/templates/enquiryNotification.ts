import { button, divider, eyebrow, heading, metaRow, metaTable, quote } from "../components";
import { escapeHtml, escapeParagraph } from "../escape";
import { renderLayout } from "../layout";

export interface EnquiryEmailInput {
  name: string;
  email: string;
  company: string;
  message: string;
  /** When the enquiry arrived. Injected rather than read, so it is testable. */
  receivedAt: Date;
}

/** The sender's first name, for a greeting and a reply button. */
export function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0] || name.trim();
}

/** Formats the arrival time in the studio's timezone, not the server's. */
function formatReceived(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

/**
 * The enquiry as it lands in the studio inbox.
 *
 * Built to be triaged, not admired: the company is the headline because it
 * is what you scan for, the message sits in a quote block so it reads as
 * their words rather than ours, and the button opens a reply with the
 * subject already filled in.
 *
 * EVERY interpolation is escaped. This is the email a member of the team
 * opens, and the values in it were typed by an anonymous stranger.
 */
export function renderEnquiryNotification(input: EnquiryEmailInput): {
  subject: string;
  html: string;
  text: string;
} {
  const name = escapeHtml(input.name);
  const company = escapeHtml(input.company);
  const address = escapeHtml(input.email);
  const received = escapeHtml(formatReceived(input.receivedAt));
  const first = escapeHtml(firstNameOf(input.name));

  const replyHref = `mailto:${encodeURIComponent(input.email)}?subject=${encodeURIComponent(
    `Re: your enquiry to Popcorn Advertising`,
  )}`;

  const body = [
    eyebrow("New enquiry"),
    heading(company),
    metaTable(
      [
        metaRow("From", name),
        metaRow("Email", address, `mailto:${encodeURIComponent(input.email)}`),
        metaRow("Received", received),
      ].join(""),
    ),
    divider(),
    `<p class="pc-soft" style="margin:0 0 14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#6d6764;">What they need</p>`,
    quote(escapeParagraph(input.message)),
    button(`Reply to ${first}`, replyHref),
  ].join("\n");

  const html = renderLayout({
    preheader: `${input.name} at ${input.company} wants to talk.`,
    body,
    footer: "Sent by the contact form on popcornadvertising.com.",
  });

  const text = [
    "NEW ENQUIRY",
    "",
    `Company:  ${input.company}`,
    `From:     ${input.name}`,
    `Email:    ${input.email}`,
    `Received: ${formatReceived(input.receivedAt)}`,
    "",
    "What they need:",
    input.message,
    "",
    "Sent by the contact form on popcornadvertising.com.",
  ].join("\n");

  return { subject: `New enquiry: ${input.company}`, html, text };
}
