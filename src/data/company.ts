/**
 * Single source of truth for corporate identity, statutory registration and contact.
 *
 * Everything in the `statutory` block is verified public-record data from MCA filings
 * and the GST register. It is published deliberately: Indian B2B buyers and procurement
 * teams check LLPIN and GSTIN before raising a vendor record, so showing them is a
 * credibility asset rather than a disclosure risk.
 *
 * Contact values are environment-overridable so moving from the registered Gmail to a
 * domain mailbox is a deployment change, not a code change.
 */

export const company = {
  legalName: "Vraj Chem Impex LLP",
  shortName: "Vraj Chem Impex",
  tagline: "Importer · Exporter · Wholesale trader of industrial chemicals",

  statutory: {
    llpin: "AAT-2573",
    gstin: "27AATFV1194R1Z0",
    incorporatedOn: "07 August 2020",
    incorporatedIso: "2020-08-07",
    registrar: "RoC — Mumbai I",
    status: "Active",
    classification: "Manufacture and wholesale trade of chemicals & chemical products",
    taxpayerType: "Trader, wholesaler and distributor",
    gstComplianceScore: 883,
    gstComplianceMax: 1000,
    eInvoiceEnabled: true,
    contribution: "₹10,00,000"
  },

  partners: [
    { name: "Chandresh Dhirajlal Mehta", role: "Designated Partner", since: "07 August 2020" },
    { name: "Bhargav Chandresh Mehta", role: "Designated Partner", since: "07 August 2020" }
  ],

  salesEmail: process.env.NEXT_PUBLIC_SALES_EMAIL ?? "vrajchemimpexllp@gmail.com",
  exportEmail:
    process.env.NEXT_PUBLIC_EXPORT_EMAIL ??
    process.env.NEXT_PUBLIC_SALES_EMAIL ??
    "vrajchemimpexllp@gmail.com",

  /** Confirmed against the client's stock list ("Bhargav Mehta" contact block). */
  phones: [
    { label: "+91 99308 76815", href: "tel:+919930876815" },
    { label: "+91 93211 33556", href: "tel:+919321133556" },
    { label: "022-3596 4872", href: "tel:+912235964872" }
  ],

  /**
   * Link target for every WhatsApp button. Overridable so a demo or staging deployment
   * can route conversations to a different handset without touching the displayed
   * contact block — no WhatsApp control renders the number, only an icon or a label.
   */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919930876815",

  offices: [
    {
      id: "registered",
      label: "Registered Office",
      line1: "A 1401, Gokul Vrindavan CHS Ltd",
      line2: "Shantilal Modi Crossroad No 2, Irani Wadi",
      locality: "Kandivali West",
      city: "Mumbai",
      region: "Maharashtra",
      postalCode: "400067",
      country: "India",
      countryCode: "IN",
      mapQuery: "Irani Wadi, Kandivali West, Mumbai, Maharashtra 400067"
    },
    {
      id: "corporate",
      label: "Corporate Office & Operating Hub",
      line1: "610 One World, SV Road",
      line2: "Near N L High School",
      locality: "Malad West",
      city: "Mumbai",
      region: "Maharashtra",
      postalCode: "400064",
      country: "India",
      countryCode: "IN",
      mapQuery: "One World, SV Road, Malad West, Mumbai, Maharashtra 400064"
    }
  ],

  hours: {
    days: "Monday to Saturday",
    open: "09:00",
    close: "19:00",
    timezone: "IST (UTC+5:30)",
    closed: "Sunday"
  },

  portOfLoading: "Nhava Sheva (JNPT), Mumbai, India"
} as const;

export type Office = (typeof company.offices)[number];

export function formatOffice(office: Office) {
  return [
    office.line1,
    office.line2,
    `${office.locality}, ${office.city} ${office.postalCode}`,
    office.region,
    office.country
  ].join(", ");
}

/** Registered office — the address used for structured data and legal pages. */
export const registeredOffice = company.offices[0];
export const addressOneLine = formatOffice(registeredOffice);
