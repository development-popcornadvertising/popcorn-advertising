import { siteConfig } from "@/lib/siteConfig";

import { button, divider, eyebrow, heading, paragraph, quote } from "../components";
import { escapeHtml, escapeParagraph } from "../escape";
import { renderLayout } from "../layout";

import { firstNameOf, type EnquiryEmailInput } from "./enquiryNotification";

/**
 * The confirmation the enquirer receives.
 *
 * The customer-facing one, so it does less and commits more: acknowledge
 * receipt, state a specific turnaround and what the reply will contain, and
 * play their message back so they have a record. No pitch, one button.
 *
 * The copy is deliberately unhedged. An earlier draft said someone "will
 * read it properly and come back to you", which reads as a maybe; a
 * confirmation email is the wrong place to sound uncertain about whether
 * anyone is going to respond.
 *
 * ⚠️ On the Resend test domain this cannot be delivered. Resend only
 * accepts a recipient matching the account owner while sending from
 * onboarding@resend.dev, so every send to a real enquirer 403s until
 * popcornadvertising.com is verified. The caller treats that as
 * non-fatal; nothing here needs to change when DNS lands.
 */
export function renderEnquiryAutoReply(input: EnquiryEmailInput): {
  subject: string;
  html: string;
  text: string;
} {
  const first = escapeHtml(firstNameOf(input.name));
  const siteUrl = siteConfig.url.replace(/\/$/, "");

  const body = [
    eyebrow("Message received"),
    heading(`Thanks, ${first}.`),
    paragraph(
      "We have your enquiry and are reviewing it now. A member of the team will reply within one business day with next steps, along with anything we need clarified before we can scope the work.",
      20,
    ),
    divider(),
    `<p class="pc-soft" style="margin:0 0 14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#6d6764;">Your message</p>`,
    quote(escapeParagraph(input.message)),
    button("See our work", `${siteUrl}/work`),
  ].join("\n");

  const html = renderLayout({
    preheader: "We have your enquiry. A reply follows within one business day.",
    body,
    footer: [
      `You are receiving this because an enquiry was submitted at popcornadvertising.com.`,
      `<br />Replies to this email reach the team directly, or write to ${escapeHtml(siteConfig.contact.email)}.`,
    ].join(""),
  });

  const text = [
    `Thanks, ${firstNameOf(input.name)}.`,
    "",
    "We have your enquiry and are reviewing it now. A member of the team will",
    "reply within one business day with next steps, along with anything we need",
    "clarified before we can scope the work.",
    "",
    "Your message:",
    input.message,
    "",
    `See our work: ${siteUrl}/work`,
    "",
    "You are receiving this because an enquiry was submitted at",
    `popcornadvertising.com. Replies reach the team directly, or write to ${siteConfig.contact.email}.`,
  ].join("\n");

  return { subject: "We got your message", html, text };
}
