import { company } from "@/data/company";

/**
 * Export commercial terms.
 *
 * These are business facts, not marketing copy — they belong to the client and must be
 * confirmed before launch. Anything not confirmed reads "On request" rather than being
 * invented: HS codes and MOQs are regulatory and commercial commitments, and a wrong
 * value on a public page is worse than no value.
 */

export const incotermsOffered = ["EXW", "FOB", "CIF", "CFR", "DAP"] as const;

export const exportDocuments = [
  { name: "Commercial Invoice & Packing List", note: "Issued with every shipment" },
  { name: "Certificate of Analysis (CoA)", note: "Batch-specific, supplier-backed" },
  { name: "Safety Data Sheet (SDS)", note: "Provided on request before dispatch" },
  { name: "Certificate of Origin", note: "Arranged through the relevant chamber" },
  { name: "Bill of Lading / Airway Bill", note: "Issued by the appointed carrier" },
  { name: "Dangerous Goods Declaration", note: "Where the classification requires it" }
];

export const exportFacts = {
  portOfLoading: company.portOfLoading,
  /** Confirm with the client before publishing anything more specific. */
  hsCode: "On request",
  moq: "On request — varies by grade and packing",
  leadTime: "Subject to stock; confirmed at quotation",
  packingOptions: "Drums, bags, carboys and IBC / bulk, as per grade"
};
