import { createHmac } from "node:crypto";

import { describe, expect, it } from "vitest";

import { verifyWebhookSignature } from "./webhookSignature";

const SECRET = "whsec_c2VjcmV0LWtleS1mb3ItdGVzdGluZy1vbmx5";
const BODY = JSON.stringify({ type: "email.bounced", data: { to: ["a@example.com"] } });
const ID = "msg_2abc";

/** Signs exactly the way Resend/Svix does, so the test proves interop. */
function sign(body: string, timestamp: number, secret = SECRET, id = ID): string {
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const mac = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest("base64");
  return `v1,${mac}`;
}

const NOW = new Date("2026-09-06T12:00:00Z");
const TS = Math.floor(NOW.getTime() / 1000);

describe("verifyWebhookSignature", () => {
  it("accepts a correctly signed request", () => {
    const result = verifyWebhookSignature(
      { id: ID, timestamp: String(TS), signature: sign(BODY, TS), rawBody: BODY },
      SECRET,
      NOW,
    );
    expect(result).toEqual({ ok: true });
  });

  it("accepts a secret pasted without the whsec_ prefix", () => {
    const bare = SECRET.replace(/^whsec_/, "");
    const result = verifyWebhookSignature(
      { id: ID, timestamp: String(TS), signature: sign(BODY, TS), rawBody: BODY },
      bare,
      NOW,
    );
    expect(result.ok).toBe(true);
  });

  it("rejects a tampered body", () => {
    const tampered = BODY.replace("a@example.com", "attacker@example.com");
    const result = verifyWebhookSignature(
      { id: ID, timestamp: String(TS), signature: sign(BODY, TS), rawBody: tampered },
      SECRET,
      NOW,
    );
    expect(result).toEqual({ ok: false, reason: "bad-signature" });
  });

  it("rejects a signature made with a different secret", () => {
    const other = "whsec_ZGlmZmVyZW50LXNlY3JldC1lbnRpcmVseS1oZXJl";
    const result = verifyWebhookSignature(
      { id: ID, timestamp: String(TS), signature: sign(BODY, TS, other), rawBody: BODY },
      SECRET,
      NOW,
    );
    expect(result).toEqual({ ok: false, reason: "bad-signature" });
  });

  it("rejects a signature bound to a different message id", () => {
    // The id is part of the signed string, so replaying one message's
    // signature onto another must fail.
    const result = verifyWebhookSignature(
      { id: "msg_other", timestamp: String(TS), signature: sign(BODY, TS), rawBody: BODY },
      SECRET,
      NOW,
    );
    expect(result).toEqual({ ok: false, reason: "bad-signature" });
  });

  it("rejects a replay from outside the tolerance window", () => {
    const old = TS - 400; // tolerance is 300s
    const result = verifyWebhookSignature(
      { id: ID, timestamp: String(old), signature: sign(BODY, old), rawBody: BODY },
      SECRET,
      NOW,
    );
    expect(result).toEqual({ ok: false, reason: "stale-timestamp" });
  });

  it("rejects a timestamp too far in the future", () => {
    const ahead = TS + 400;
    const result = verifyWebhookSignature(
      { id: ID, timestamp: String(ahead), signature: sign(BODY, ahead), rawBody: BODY },
      SECRET,
      NOW,
    );
    expect(result).toEqual({ ok: false, reason: "stale-timestamp" });
  });

  it("accepts a request at the edge of the window", () => {
    const edge = TS - 299;
    const result = verifyWebhookSignature(
      { id: ID, timestamp: String(edge), signature: sign(BODY, edge), rawBody: BODY },
      SECRET,
      NOW,
    );
    expect(result.ok).toBe(true);
  });

  it("rejects a non-numeric timestamp", () => {
    const result = verifyWebhookSignature(
      { id: ID, timestamp: "not-a-number", signature: sign(BODY, TS), rawBody: BODY },
      SECRET,
      NOW,
    );
    expect(result).toEqual({ ok: false, reason: "stale-timestamp" });
  });

  it.each([
    ["id", { id: null }],
    ["timestamp", { timestamp: null }],
    ["signature", { signature: null }],
  ])("rejects a request missing the %s header", (_label, override) => {
    const result = verifyWebhookSignature(
      {
        id: ID,
        timestamp: String(TS),
        signature: sign(BODY, TS),
        rawBody: BODY,
        ...override,
      },
      SECRET,
      NOW,
    );
    expect(result).toEqual({ ok: false, reason: "missing-headers" });
  });

  it("accepts when one of several rotated signatures matches", () => {
    // Svix sends every active secret's signature during a rotation.
    const header = `v1,AAAAinvalidAAAA ${sign(BODY, TS)}`;
    const result = verifyWebhookSignature(
      { id: ID, timestamp: String(TS), signature: header, rawBody: BODY },
      SECRET,
      NOW,
    );
    expect(result.ok).toBe(true);
  });

  it("rejects a malformed signature header with no version prefix", () => {
    const result = verifyWebhookSignature(
      { id: ID, timestamp: String(TS), signature: "garbage", rawBody: BODY },
      SECRET,
      NOW,
    );
    expect(result).toEqual({ ok: false, reason: "bad-signature" });
  });
});
