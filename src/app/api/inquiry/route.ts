import { rfqSchema, quickRfqSchema, leadCaptureSchema } from "@/lib/schemas";
import { deliverLead, validateAttachment, type LeadAttachment } from "@/lib/leads";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { company } from "@/data/company";
import { NextResponse } from "next/server";

const FALLBACK = `We could not record your request. Please call ${company.phones[0].label} or message us on WhatsApp so we do not lose your requirement.`;

export async function POST(request: Request) {
  const limit = rateLimit(`inquiry:${clientKey(request)}`);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await request.json().catch(() => null);

  let website: string | undefined;
  let attachment: LeadAttachment | undefined;
  let lead: Record<string, unknown>;

  // The capture modal declares itself, because its two fields are a subset of the
  // hero card's and would otherwise be judged against the wrong error messages.
  if (body && typeof body === "object" && (body as { source?: unknown }).source === "lead_capture") {
    const capture = leadCaptureSchema.safeParse(body);
    if (!capture.success) {
      return NextResponse.json(
        { error: capture.error.issues[0]?.message ?? "Invalid enquiry" },
        { status: 400 }
      );
    }
    const { website: trap, ...rest } = capture.data;
    website = trap;
    lead = { ...rest, source: "lead_capture" };

    if (website) return NextResponse.json({ ok: true, message: "Thank you." });

    const captured = await deliverLead("rfq", lead);
    if (!captured.ok) {
      return NextResponse.json({ error: FALLBACK }, { status: 502 });
    }
    return NextResponse.json({
      ok: true,
      reference: captured.id,
      message: `Thank you. Your reference is ${captured.id} and our team will respond within one working day.`
    });
  }

  // The hero card sends three fields; the full RFQ page sends the whole form.
  const full = rfqSchema.safeParse(body);

  if (full.success) {
    const { website: trap, attachment: file, ...rest } = full.data;
    website = trap;
    attachment = file;
    lead = { ...rest, source: "rfq_form" };
  } else {
    const quick = quickRfqSchema.safeParse(body);
    if (!quick.success) {
      const issue = quick.error.issues[0]?.message ?? full.error.issues[0]?.message;
      return NextResponse.json({ error: issue ?? "Invalid inquiry" }, { status: 400 });
    }
    const { website: trap, ...rest } = quick.data;
    website = trap;
    lead = { ...rest, source: "quick_rfq" };
  }

  // Honeypot filled means a bot. Return success so it does not learn to retry.
  if (website) return NextResponse.json({ ok: true, message: "Thank you." });

  const attachmentCheck = validateAttachment(attachment);
  if (!attachmentCheck.ok) {
    return NextResponse.json({ error: attachmentCheck.error }, { status: 400 });
  }

  const result = await deliverLead("rfq", lead, attachment);

  if (!result.ok) {
    return NextResponse.json({ error: FALLBACK }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    reference: result.id,
    message: `Thank you. Your reference is ${result.id} and our team will respond within one working day.`
  });
}
