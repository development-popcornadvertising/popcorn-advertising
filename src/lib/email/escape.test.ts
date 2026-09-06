import { describe, expect, it } from "vitest";

import { escapeHtml, escapeParagraph } from "./escape";

describe("escapeHtml", () => {
  it("neutralises the five significant characters", () => {
    expect(escapeHtml(`<>&"'`)).toBe("&lt;&gt;&amp;&quot;&#39;");
  });

  it("escapes the ampersand first, so entities are not doubled", () => {
    // A naive implementation that replaced "<" before "&" would produce
    // "&amp;lt;" here, and the reader would see the entity as text.
    expect(escapeHtml("<")).toBe("&lt;");
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });

  it("defuses a script injection in a message body", () => {
    const attack = `<img src=x onerror="alert(1)">`;
    const escaped = escapeHtml(attack);

    expect(escaped).not.toContain("<img");
    expect(escaped).not.toContain(`"`);
    expect(escaped).toContain("&lt;img");
  });

  it("defuses markup that would tear the table layout apart", () => {
    const attack = "</td></tr></table><h1>Pwned</h1>";
    expect(escapeHtml(attack)).not.toContain("</td>");
  });

  it("defuses an anchor, the phishing vector aimed at our own inbox", () => {
    const attack = `<a href="https://evil.example">Click to view invoice</a>`;
    const escaped = escapeHtml(attack);

    expect(escaped).not.toContain("<a href");
    expect(escaped).not.toContain("javascript:");
  });

  it("leaves ordinary copy untouched", () => {
    const plain = "We need a launch film for Q3, budget around 12 lakh.";
    expect(escapeHtml(plain)).toBe(plain);
  });
});

describe("escapeParagraph", () => {
  it("turns newlines into breaks", () => {
    expect(escapeParagraph("one\ntwo")).toBe("one<br />two");
    expect(escapeParagraph("one\r\ntwo")).toBe("one<br />two");
  });

  it("escapes before converting, so a typed <br> stays visible text", () => {
    // Otherwise a sender could inject real breaks, and more importantly the
    // escape/convert order is the kind of thing a refactor silently flips.
    expect(escapeParagraph("a<br>b")).toBe("a&lt;br&gt;b");
  });
});
