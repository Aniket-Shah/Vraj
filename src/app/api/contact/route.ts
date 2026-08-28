import { contactSchema } from "@/lib/schemas";
import { deliverLead } from "@/lib/leads";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { company } from "@/data/company";
import { NextResponse } from "next/server";

const FALLBACK = `We could not record your message. Please call ${company.phones[0].label} or message us on WhatsApp so we do not lose your enquiry.`;

export async function POST(request: Request) {
  const limit = rateLimit(`contact:${clientKey(request)}`);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid contact request" },
      { status: 400 }
    );
  }

  const { website, ...lead } = parsed.data;

  if (website) return NextResponse.json({ ok: true, message: "Thank you." });

  const result = await deliverLead("contact", lead);

  if (!result.ok) {
    return NextResponse.json({ error: FALLBACK }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    reference: result.id,
    message: `Thank you. Your reference is ${result.id} and our team will respond within one working day.`
  });
}
