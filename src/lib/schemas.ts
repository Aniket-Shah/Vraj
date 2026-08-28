import { z } from "zod";

const phone = z.string().min(7, "Enter a valid phone number");
const email = z.string().email("Enter a valid email address");

/**
 * Consent is required, not optional. Business contact details from EU buyers cannot be
 * collected on an unticked box, and the missing consent also blocks Google Ads verification.
 */
const consent = z.literal(true, {
  errorMap: () => ({ message: "Please confirm we may contact you about this requirement." })
});

/**
 * Hidden field. Real buyers never fill it; bots fill everything. Deliberately
 * unconstrained here so the route can accept and silently discard the submission —
 * a validation error would tell the bot which field gave it away.
 */
const honeypot = z.string().optional();

const attachment = z
  .object({
    filename: z.string().min(1),
    contentType: z.string().min(1),
    content: z.string().min(1)
  })
  .optional();

export const INCOTERMS = ["EXW", "FOB", "CIF", "CFR", "DAP", "Not sure yet"] as const;
export const CURRENCIES = ["USD", "EUR", "INR", "AED", "GBP"] as const;
export const QUANTITY_UNITS = ["Kg", "Litres", "Metric Tons", "Drums", "Bags", "IBC Totes"] as const;

export const PACKAGING_OPTIONS = [
  "25 kg Bags",
  "50 L Drums",
  "200 L HDPE Drums",
  "IBC Totes",
  "Tanker Supply",
  "Carboy"
] as const;

export const INDUSTRY_CATEGORIES = [
  "Paints, Inks & Coatings",
  "Polymers & Plastics",
  "Textiles & Apparel",
  "Water & Wastewater Treatment",
  "Construction Chemicals",
  "Pharmaceutical & Agrochemical Synthesis",
  "Other"
] as const;

/** GSTIN is optional but recommended — it speeds up vendor onboarding on both sides. */
const buyerGstin = z
  .string()
  .trim()
  .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]{3}$/i, "Enter a valid 15-character GSTIN")
  .optional()
  .or(z.literal(""));

export const rfqSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  companyName: z.string().min(2, "Company name is required"),
  email,
  phone,
  country: z.string().min(2, "Country is required"),
  buyerGstin,
  industryCategory: z.enum(INDUSTRY_CATEGORIES).optional(),
  chemicalCategory: z.string().min(1, "Select a category"),
  chemicalName: z.string().min(2, "Chemical name or CAS number is required"),
  requiredQuantity: z.string().min(1, "Required quantity is required"),
  quantityUnit: z.enum(QUANTITY_UNITS).optional(),
  packagingType: z.enum(PACKAGING_OPTIONS).optional(),
  deliveryTime: z.string().optional(),
  deliveryPort: z.string().optional(),
  incoterm: z.enum(INCOTERMS).optional(),
  currency: z.enum(CURRENCIES).optional(),
  application: z.string().min(2, "Application is required"),
  attachment,
  website: honeypot,
  terms: consent
});

/**
 * Hero "Quick RFQ" — the three fields the approved screens show. Consent here is given by
 * submission and disclosed as fine print under the button rather than as a checkbox; the
 * full RFQ page still takes an explicit ticked opt-in.
 */
export const quickRfqSchema = z.object({
  chemicalName: z.string().min(2, "Enter a chemical name or CAS number"),
  requiredQuantity: z.string().min(1, "Enter a quantity"),
  quantityUnit: z.enum(QUANTITY_UNITS).optional(),
  email,
  website: honeypot
});

export type QuickRFQInput = z.infer<typeof quickRfqSchema>;

/**
 * Exit-intent / dwell capture. Two fields is the most a prompted modal can ask for
 * without being dismissed, so quantity and name are absent by design — the reply
 * email opens that conversation instead. Either a phone or an email will do.
 */
export const leadCaptureSchema = z
  .object({
    chemicalName: z.string().min(2, "Tell us which chemical you need"),
    email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
    phone: z.string().min(7, "Enter a valid phone number").optional().or(z.literal("")),
    fullName: z.string().optional(),
    website: honeypot
  })
  .refine((value) => Boolean(value.email) || Boolean(value.phone), {
    message: "Add an email address or a phone number so we can send the quote",
    path: ["email"]
  });

export type LeadCaptureInput = z.infer<typeof leadCaptureSchema>;

export const contactSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email,
  phone,
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(5, "Message is required"),
  website: honeypot,
  terms: consent
});

export type RFQInput = z.infer<typeof rfqSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
