import { siteConfig } from "@/lib/siteConfig";

import { button, divider, eyebrow, heading, paragraph, quote } from "../components";
import { escapeHtml, escapeParagraph } from "../escape";
import { renderLayout } from "../layout";

import { firstNameOf, type EnquiryEmailInput } from "./enquiryNotification";

/**
 * The confirmation the enquirer receives.
 *
 * This is the customer-facing one, so it does less: a thank you, the single
 * promise that matters (a reply within a day), and their own message played
 * back so they have a record of what they sent. No pitch, no links to
 * everything, one button.
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
      "Your message is with the team. Someone will read it properly and come back to you within a day, and it will be a person rather than a template.",
      20,
    ),
    divider(),
    `<p class="pc-soft" style="margin:0 0 14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#6d6764;">What you sent</p>`,
    quote(escapeParagraph(input.message)),
    button("See our work", `${siteUrl}/work`),
  ].join("\n");

  const html = renderLayout({
    preheader: "We have your message, and we'll come back within a day.",
    body,
    footer: [
      `You are receiving this because you contacted Popcorn Advertising through popcornadvertising.com.`,
      `<br />Reply to this email, or reach us at ${escapeHtml(siteConfig.contact.email)}.`,
    ].join(""),
  });

  const text = [
    `Thanks, ${firstNameOf(input.name)}.`,
    "",
    "Your message is with the team. Someone will read it properly and come",
    "back to you within a day, and it will be a person rather than a template.",
    "",
    "What you sent:",
    input.message,
    "",
    `See our work: ${siteUrl}/work`,
    "",
    "You are receiving this because you contacted Popcorn Advertising",
    `through popcornadvertising.com. Reply here, or email ${siteConfig.contact.email}.`,
  ].join("\n");

  return { subject: "We got your message", html, text };
}
