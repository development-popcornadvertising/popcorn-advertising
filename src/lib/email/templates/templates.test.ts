import { describe, expect, it } from "vitest";

import { renderEnquiryAutoReply } from "./enquiryAutoReply";
import { firstNameOf, renderEnquiryNotification } from "./enquiryNotification";
import { renderLaunchNotification } from "./launchNotification";

const enquiry = {
  name: "Asha Menon",
  email: "asha@nimbus.example",
  company: "Nimbus Fintech",
  message: "We need a launch film and an influencer push for Q3.",
  receivedAt: new Date("2026-09-06T09:30:00Z"),
};

/** Gmail clips a message past 102KB and hides the rest. */
const GMAIL_CLIP_BYTES = 102 * 1024;

describe("firstNameOf", () => {
  it("takes the first word", () => {
    expect(firstNameOf("Asha Menon")).toBe("Asha");
  });

  it("survives a single name and stray whitespace", () => {
    expect(firstNameOf("Asha")).toBe("Asha");
    expect(firstNameOf("  Asha   Menon ")).toBe("Asha");
  });
});

describe("renderEnquiryNotification", () => {
  const mail = renderEnquiryNotification(enquiry);

  it("subjects on the company, which is what you scan for", () => {
    expect(mail.subject).toBe("New enquiry: Nimbus Fintech");
  });

  it("carries the enquiry in both the HTML and the text part", () => {
    for (const part of [mail.html, mail.text]) {
      expect(part).toContain("Nimbus Fintech");
      expect(part).toContain("asha@nimbus.example");
      expect(part).toContain("launch film");
    }
  });

  it("builds a reply button with the address prefilled", () => {
    expect(mail.html).toContain("mailto:asha%40nimbus.example");
    expect(mail.html).toContain("Reply to Asha");
  });

  it("opens with a hidden preheader, not the wordmark", () => {
    // Without one, the inbox preview line scrapes the first visible text.
    expect(mail.html).toContain("Asha Menon at Nimbus Fintech wants to talk.");
  });

  it("escapes hostile input rather than rendering it", () => {
    const hostile = renderEnquiryNotification({
      ...enquiry,
      name: `<img src=x onerror="alert(1)">`,
      company: "</td></table><h1>Pwned",
      message: `<a href="https://evil.example">invoice</a>`,
    });

    expect(hostile.html).not.toContain("<img src=x");
    expect(hostile.html).not.toContain("</td></table><h1>");
    expect(hostile.html).not.toContain(`<a href="https://evil.example"`);
    expect(hostile.html).toContain("&lt;img");
  });

  it("stays well under Gmail's clipping threshold", () => {
    const long = renderEnquiryNotification({ ...enquiry, message: "x".repeat(2000) });
    expect(Buffer.byteLength(long.html, "utf8")).toBeLessThan(GMAIL_CLIP_BYTES);
  });

  it("is a complete document with a table-based body", () => {
    expect(mail.html.startsWith("<!doctype html>")).toBe(true);
    expect(mail.html).toContain('role="presentation"');
    expect(mail.html).toContain('name="color-scheme"');
  });
});

describe("renderEnquiryAutoReply", () => {
  const mail = renderEnquiryAutoReply(enquiry);

  it("greets by first name and plays the message back", () => {
    expect(mail.html).toContain("Thanks, Asha.");
    expect(mail.html).toContain("launch film");
    expect(mail.text).toContain("Thanks, Asha.");
  });

  it("does not leak the studio's internal framing to the customer", () => {
    expect(mail.html).not.toContain("New enquiry");
    expect(mail.subject).toBe("We got your message");
  });

  it("escapes hostile input in the echoed message", () => {
    const hostile = renderEnquiryAutoReply({ ...enquiry, message: "<script>alert(1)</script>" });
    expect(hostile.html).not.toContain("<script>");
    expect(hostile.html).toContain("&lt;script&gt;");
  });
});

describe("renderLaunchNotification", () => {
  const mail = renderLaunchNotification({
    email: "someone@example.com",
    receivedAt: enquiry.receivedAt,
  });

  it("names the address in the subject and body", () => {
    expect(mail.subject).toBe("Launch list signup: someone@example.com");
    expect(mail.html).toContain("someone@example.com");
    expect(mail.text).toContain("someone@example.com");
  });

  it("shares the layout with the enquiry emails", () => {
    expect(mail.html).toContain('name="color-scheme"');
    expect(mail.html).toContain("Popcorn");
  });
});
