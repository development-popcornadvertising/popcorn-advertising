import { env } from "@/lib/env";
import { verifyWebhookSignature } from "@/lib/webhookSignature";

/**
 * Resend delivery events.
 *
 * THE FIRST ROUTE HANDLER IN THIS CODEBASE, and the one documented
 * exception to the rule that every route stays statically prerendered. A
 * webhook has to read the request body, so it builds as `ƒ`. That rule
 * exists to stop a *page* accidentally opting into dynamic rendering; it
 * was never about endpoints.
 *
 * WHAT THIS IS FOR. A bounced enquiry notification is a lost lead that
 * nobody finds out about: Resend accepts the send, returns an id, and the
 * message quietly fails afterwards. Without this endpoint that failure is
 * invisible. Bounces and complaints are therefore logged at error level
 * with the recipient, so they surface in Vercel's logs and someone can
 * follow up by hand.
 *
 * No datastore, so this is log-only. That is the honest limit of it.
 */

/** Payload shape, narrowed to the fields actually read. */
interface ResendEvent {
  type?: string;
  data?: { email_id?: string; to?: string[] | string; subject?: string };
}

function recipientOf(data: ResendEvent["data"]): string {
  if (!data?.to) return "unknown";
  return Array.isArray(data.to) ? data.to.join(", ") : data.to;
}

export async function POST(request: Request): Promise<Response> {
  const secret = env.RESEND_WEBHOOK_SECRET;

  // Refuse rather than accept unverified payloads. Anyone can POST here.
  if (!secret) {
    console.error("Resend webhook received but RESEND_WEBHOOK_SECRET is not set. Ignoring.");
    return new Response(null, { status: 503 });
  }

  // The raw text, before any parse. Round-tripping through JSON.parse and
  // JSON.stringify changes the bytes and every signature would fail.
  const rawBody = await request.text();

  const result = verifyWebhookSignature(
    {
      id: request.headers.get("svix-id"),
      timestamp: request.headers.get("svix-timestamp"),
      signature: request.headers.get("svix-signature"),
      rawBody,
    },
    secret,
  );

  if (!result.ok) {
    // Logged in full, but the response says nothing: telling the caller
    // which check failed tells an attacker what to fix.
    console.warn(`Rejected Resend webhook: ${result.reason}`);
    return new Response(null, { status: 400 });
  }

  let event: ResendEvent;
  try {
    event = JSON.parse(rawBody) as ResendEvent;
  } catch {
    return new Response(null, { status: 400 });
  }

  switch (event.type) {
    case "email.bounced":
    case "email.complained":
      console.error(
        `Resend ${event.type}: ${recipientOf(event.data)} (${event.data?.subject ?? "no subject"}). A message did not reach its recipient.`,
      );
      break;

    case "email.delivered":
    case "email.sent":
    case "email.delivery_delayed":
      break;

    default:
      // Acknowledged anyway. A non-2xx makes Resend retry an event we were
      // never going to act on.
      break;
  }

  return new Response(null, { status: 204 });
}
