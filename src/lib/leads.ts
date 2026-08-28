import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { company, addressOneLine } from "@/data/company";

/**
 * Lead delivery.
 *
 * A lead is written to durable storage BEFORE any network delivery is attempted, so a
 * mail provider outage can never destroy an enquiry. Delivery then fans out to every
 * configured channel.
 *
 * The contract that matters: if no channel succeeds, this returns ok:false and the
 * route must tell the buyer to phone or WhatsApp instead. The site must never claim
 * "we will contact you within 24 hours" for a lead that reached nobody.
 *
 * Configure at least one of:
 *   RESEND_API_KEY + LEAD_FROM_EMAIL   → transactional email to the sales inbox
 *   LEAD_WEBHOOK_URL                   → Zapier / Make / Slack / CRM intake
 *   LEAD_STORE_DIR                     → append-only JSONL on a persistent disk
 */

export type LeadKind = "rfq" | "contact";

export interface LeadAttachment {
  filename: string;
  contentType: string;
  /** base64-encoded file content */
  content: string;
}

export interface DeliveryResult {
  ok: boolean;
  id: string;
  delivered: string[];
  failed: string[];
}

const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;

function storeDir() {
  if (process.env.LEAD_STORE_DIR) return process.env.LEAD_STORE_DIR;
  // Vercel's filesystem is read-only apart from /tmp, and /tmp does not survive a cold
  // start. It is a last-resort buffer there, not durable storage — configure a real
  // channel in production.
  return process.env.VERCEL ? "/tmp/vraj-leads" : join(process.cwd(), ".leads");
}

function fieldLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) => character.toUpperCase())
    .trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderRows(data: Record<string, unknown>) {
  return Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => {
      const rendered = Array.isArray(value) ? value.join(", ") : String(value);
      return `<tr>
        <td style="padding:6px 14px 6px 0;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(fieldLabel(key))}</td>
        <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600">${escapeHtml(rendered)}</td>
      </tr>`;
    })
    .join("");
}

function internalEmail(kind: LeadKind, id: string, data: Record<string, unknown>) {
  const heading = kind === "rfq" ? "New quote request" : "New contact enquiry";
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px">
    <p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#0d9488;margin:0 0 6px">${escapeHtml(company.legalName)}</p>
    <h1 style="font-size:20px;margin:0 0 4px;color:#0f172a">${heading}</h1>
    <p style="font-size:12px;color:#94a3b8;margin:0 0 18px">Reference ${escapeHtml(id)}</p>
    <table style="border-collapse:collapse;width:100%">${renderRows(data)}</table>
  </div>`;
}

/** Plain-text alternative. HTML-only mail is a spam-filter penalty. */
function internalText(kind: LeadKind, id: string, data: Record<string, unknown>) {
  const heading = kind === "rfq" ? "New quote request" : "New contact enquiry";
  const rows = Object.entries(data)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${fieldLabel(key)}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
    .join("\n");
  return `${heading}\nReference ${id}\n\n${rows}\n`;
}

/**
 * The greeting has to survive a lead with no name — the hero Quick RFQ and the
 * capture modal both collect an email without one, and those buyers were silently
 * getting no acknowledgement at all.
 */
function greetingFor(data: Record<string, unknown>) {
  const name = typeof data.fullName === "string" ? data.fullName.trim() : "";
  if (name) return `Thank you, ${name}`;

  const contact = typeof data.email === "string" ? data.email : "";
  const local = contact.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  if (local && /^[a-z ]{2,40}$/i.test(local)) {
    return `Thank you, ${local.replace(/\b\w/g, (character) => character.toUpperCase())}`;
  }

  return "Thank you";
}

function acknowledgementEmail(greeting: string, reference: string) {
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px;color:#0f172a">
    <p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#0d9488;margin:0 0 6px">${escapeHtml(company.legalName)}</p>
    <h1 style="font-size:20px;margin:0 0 14px">${escapeHtml(greeting)} — we have your enquiry</h1>
    <p style="font-size:13px;color:#94a3b8;margin:0 0 18px">Your reference is ${escapeHtml(reference)}. Quote it in any reply and we will find your requirement instantly.</p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 14px">
      Our team is reviewing your requirement and will respond with pricing and availability.
      We reply within one working day, ${escapeHtml(company.hours.days)}, ${escapeHtml(company.hours.open)}–${escapeHtml(company.hours.close)} ${escapeHtml(company.hours.timezone)}.
    </p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 14px">
      If your requirement is urgent, reach us directly on
      <a href="${company.phones[0].href}" style="color:#0d9488">${escapeHtml(company.phones[0].label)}</a>
      or on WhatsApp.
    </p>
    <p style="font-size:13px;color:#64748b;line-height:1.6;margin:22px 0 0">
      ${escapeHtml(company.legalName)}<br>${escapeHtml(addressOneLine)}<br>
      GSTIN ${escapeHtml(company.statutory.gstin)} · LLPIN ${escapeHtml(company.statutory.llpin)}
    </p>
  </div>`;
}

function acknowledgementText(greeting: string, reference: string) {
  return [
    `${greeting} — we have your enquiry.`,
    ``,
    `Your reference is ${reference}.`,
    ``,
    `Our team is reviewing your requirement and will respond with pricing and availability.`,
    `We reply within one working day, ${company.hours.days}, ${company.hours.open}–${company.hours.close} ${company.hours.timezone}.`,
    ``,
    `If it is urgent, call ${company.phones[0].label} or message us on WhatsApp.`,
    ``,
    company.legalName,
    addressOneLine,
    `GSTIN ${company.statutory.gstin} · LLPIN ${company.statutory.llpin}`
  ].join("\n");
}

/**
 * No-credential email relay (FormSubmit and equivalents): POST a flat JSON body and the
 * service forwards it to one fixed mailbox. It buys a working lead-to-inbox path without
 * a transactional-email account, which is what a demo deployment needs. The tradeoffs are
 * a third party in the delivery path and a one-time activation click on the first send,
 * so a production launch should still move to RESEND_API_KEY.
 */
function relayPayload(kind: LeadKind, id: string, data: Record<string, unknown>) {
  const heading = kind === "rfq" ? "New quote request" : "New contact enquiry";
  const who = [data.companyName, data.fullName, data.email, data.phone]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .find(Boolean);

  const fields: Record<string, string> = {
    _subject: `[${kind === "rfq" ? "RFQ" : "Contact"} ${id}] ${heading}${who ? ` — ${who}` : ""}`,
    _template: "table",
    Reference: id
  };

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === "") continue;
    fields[fieldLabel(key)] = Array.isArray(value) ? value.join(", ") : String(value);
  }

  return fields;
}

/** Overridable so the delivery path can be exercised against a local stub. */
const RESEND_ENDPOINT = `${process.env.RESEND_BASE_URL ?? "https://api.resend.com"}/emails`;

async function sendEmail(payload: Record<string, unknown>) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}

async function persistToDisk(record: Record<string, unknown>, attachment?: LeadAttachment) {
  const directory = storeDir();
  await mkdir(directory, { recursive: true });
  await appendFile(join(directory, "leads.jsonl"), `${JSON.stringify(record)}\n`, "utf8");

  if (attachment) {
    await mkdir(join(directory, "attachments"), { recursive: true });
    await writeFile(
      join(directory, "attachments", `${record.id}-${attachment.filename}`),
      Buffer.from(attachment.content, "base64")
    );
  }
}

export function validateAttachment(attachment: LeadAttachment | undefined) {
  if (!attachment) return { ok: true as const };

  const size = Math.ceil((attachment.content.length * 3) / 4);
  if (size > MAX_ATTACHMENT_BYTES) {
    return { ok: false as const, error: "Attachment is larger than 4 MB." };
  }

  const allowed = /\.(pdf|docx?|xlsx?|csv|png|jpe?g)$/i;
  if (!allowed.test(attachment.filename)) {
    return { ok: false as const, error: "Attachment must be a PDF, Word, Excel, CSV or image file." };
  }

  return { ok: true as const };
}

export async function deliverLead(
  kind: LeadKind,
  data: Record<string, unknown>,
  attachment?: LeadAttachment
): Promise<DeliveryResult> {
  const id = `${kind.toUpperCase()}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const record = { id, kind, receivedAt: new Date().toISOString(), ...data };

  const delivered: string[] = [];
  const failed: string[] = [];

  // Storage first: a lead on disk survives every downstream failure.
  try {
    await persistToDisk(record, attachment);
    delivered.push("store");
  } catch (error) {
    failed.push(`store: ${(error as Error).message}`);
  }

  const channels: Array<Promise<void>> = [];

  if (process.env.RESEND_API_KEY && process.env.LEAD_FROM_EMAIL) {
    // Quotes are the export desk's job and enquiries are sales', but neither inbox
    // should be the single point of failure for a lead, so both are addressed.
    const recipients = process.env.LEAD_NOTIFY_EMAIL
      ? process.env.LEAD_NOTIFY_EMAIL.split(",").map((address) => address.trim()).filter(Boolean)
      : [...new Set([kind === "rfq" ? company.exportEmail : company.salesEmail, company.salesEmail])];

    // Empty strings are real here — a phone-only capture has no email — so the
    // fallback chain has to be truthiness, not nullishness.
    const who = [data.companyName, data.fullName, data.email, data.phone]
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .find(Boolean);

    const subject =
      kind === "rfq"
        ? `[RFQ ${id}] ${data.chemicalName || "Chemical requirement"}${who ? ` — ${who}` : ""}`
        : `[Contact ${id}] ${data.subject || "Enquiry"}${who ? ` — ${who}` : ""}`;

    channels.push(
      sendEmail({
        from: process.env.LEAD_FROM_EMAIL,
        to: recipients,
        reply_to: typeof data.email === "string" && data.email ? data.email : undefined,
        subject,
        html: internalEmail(kind, id, data),
        text: internalText(kind, id, data),
        attachments: attachment
          ? [{ filename: attachment.filename, content: attachment.content }]
          : undefined
      })
        .then(() => {
          delivered.push("email");
        })
        .catch((error: Error) => {
          failed.push(`email: ${error.message}`);
        })
    );

    // Buyer acknowledgement is a courtesy, never a gate on success. It goes to anyone
    // who left an address, named or not.
    if (typeof data.email === "string" && data.email) {
      const greeting = greetingFor(data);
      channels.push(
        sendEmail({
          from: process.env.LEAD_FROM_EMAIL,
          to: [data.email],
          reply_to: company.salesEmail,
          subject: `We have your enquiry — ${company.legalName} (${id})`,
          html: acknowledgementEmail(greeting, id),
          text: acknowledgementText(greeting, id)
        })
          .then(() => {
            delivered.push("acknowledgement");
          })
          .catch((error: Error) => {
            failed.push(`acknowledgement: ${error.message}`);
          })
      );
    }
  }

  if (process.env.LEAD_WEBHOOK_URL) {
    channels.push(
      fetch(process.env.LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record)
      })
        .then((response) => {
          if (!response.ok) throw new Error(`webhook responded ${response.status}`);
          delivered.push("webhook");
        })
        .catch((error: Error) => {
          failed.push(`webhook: ${error.message}`);
        })
    );
  }

  if (process.env.LEAD_RELAY_URL) {
    // FormSubmit refuses a post that carries no browser origin, so a server-to-server
    // call has to present one explicitly.
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vrajchem.com";

    channels.push(
      fetch(process.env.LEAD_RELAY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: origin,
          Referer: `${origin}/`
        },
        body: JSON.stringify(relayPayload(kind, id, data))
      })
        .then(async (response) => {
          const body = await response.text();
          if (!response.ok) throw new Error(`relay responded ${response.status}`);

          // The relay answers 200 with `success:"false"` when it declines — an unactivated
          // form, or a rejected origin. Trusting the status alone would count that as a
          // delivery and tell the buyer we had their enquiry when nobody received it.
          if (/"success"\s*:\s*"?false"?/i.test(body)) {
            throw new Error(`relay declined: ${body.slice(0, 200)}`);
          }

          delivered.push("relay");
        })
        .catch((error: Error) => {
          failed.push(`relay: ${error.message}`);
        })
    );
  }

  await Promise.all(channels);

  // "store" alone counts only when it is a configured, durable location. On Vercel
  // without LEAD_STORE_DIR the write lands in /tmp and cannot be relied on.
  const durableStore = delivered.includes("store") && (!process.env.VERCEL || !!process.env.LEAD_STORE_DIR);
  const ok =
    delivered.some((channel) => channel === "email" || channel === "webhook" || channel === "relay") ||
    durableStore;

  if (!ok) {
    console.error(`Lead ${id} reached no destination.`, { failed });
  }

  return { ok, id, delivered, failed };
}
