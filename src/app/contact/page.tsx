import { ContactForm } from "@/components/forms/ContactForm";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { company, formatOffice, registeredOffice } from "@/data/company";
import { jsonLd, pageMetadata, siteUrl } from "@/lib/utils";
import { Clock, Mail, MapPin, MessageSquare, Phone, ShieldCheck } from "lucide-react";

export const metadata = pageMetadata(
  "Contact Us",
  `Contact ${company.legalName} in Kandivali West and Malad West, Mumbai for chemical supply, RFQ and documentation support.`,
  "/contact"
);

export default function ContactPage() {
  return (
    <section className="section">
      {jsonLd({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: company.legalName,
        url: siteUrl,
        email: company.salesEmail,
        telephone: company.phones.map((entry) => entry.label),
        foundingDate: company.statutory.incorporatedIso,
        taxID: company.statutory.gstin,
        identifier: company.statutory.llpin,
        address: company.offices.map((office) => ({
          "@type": "PostalAddress",
          streetAddress: `${office.line1}, ${office.line2}, ${office.locality}`,
          addressLocality: office.city,
          postalCode: office.postalCode,
          addressRegion: office.region,
          addressCountry: office.countryCode,
        })),
      })}

      <div className="container">
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
        <p className="eyebrow">Contact</p>
        <h1 className="mt-3">Get in Touch</h1>
        <p className="mt-4 max-w-3xl text-muted">
          Send a product enquiry, a documentation request, or a procurement question. We reply
          within one working day.
        </p>

        {/* Two-column: Form left, HQ card right */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Direct Inquiry Form */}
          <div className="panel p-6 md:p-8">
            <h2 className="mb-6">Direct Inquiry Form</h2>
            <ContactForm />
          </div>

          {/* Right column: HQ card + hours card */}
          <div className="grid h-fit gap-6">

            {/* Headquarters — dark navy card matching reference */}
            <div
              className="rounded-[var(--radius-xl)] border p-5 shadow-sm sm:p-8"
              style={{
                backgroundColor: "var(--color-primary-container)",
                borderColor: "var(--color-primary)",
              }}
            >
              {/* Header row */}
              <div
                className="mb-6 flex items-center gap-4 border-b pb-4"
                style={{ borderColor: "rgba(255,255,255,0.15)" }}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-9 w-9 shrink-0"
                  style={{ color: "var(--color-gold-soft)" }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-primary-fg">Headquarters</h3>
                  <p className="text-sm opacity-70 text-primary-fg">{company.legalName}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {/* Registered address */}
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0 opacity-60" style={{ color: "var(--color-primary-fg)" }} />
                  <div>
                    <p className="label-caps mb-1 opacity-60 text-primary-fg">Registered Address</p>
                    <p className="text-sm leading-relaxed text-primary-fg">
                      A 1401, Gokul Vrindavan CHS Ltd,<br />
                      Kandivali West, Mumbai,<br />
                      Maharashtra, India
                    </p>
                  </div>
                </div>

                {/* Alternate facility */}
                <div className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-0.5 h-5 w-5 shrink-0 opacity-60"
                    style={{ color: "var(--color-primary-fg)" }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                  </svg>
                  <div>
                    <p className="label-caps mb-1 opacity-60 text-primary-fg">Alternate Facility</p>
                    <p className="text-sm leading-relaxed text-primary-fg">
                      610 One World, SV Road,<br />
                      Malad West, Mumbai,<br />
                      Maharashtra, India
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail size={20} className="mt-0.5 shrink-0 opacity-60" style={{ color: "var(--color-primary-fg)" }} />
                  <div>
                    <p className="label-caps mb-1 opacity-60 text-primary-fg">Official Email</p>
                    <a
                      href={`mailto:${company.salesEmail}`}
                      className="data inline-flex min-h-11 items-center break-all text-sm text-primary-fg transition-opacity hover:opacity-80 sm:min-h-0"
                    >
                      {company.salesEmail}
                    </a>
                  </div>
                </div>

                {/* Tax ID row */}
                <div
                  className="flex items-start gap-3 border-t pt-5"
                  style={{ borderColor: "rgba(255,255,255,0.15)" }}
                >
                  <ShieldCheck size={20} className="mt-0.5 shrink-0 opacity-60" style={{ color: "var(--color-primary-fg)" }} />
                  <div>
                    <p className="label-caps mb-2 opacity-60 text-primary-fg">Tax Identification</p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-primary-fg">
                      <span>GSTIN:</span>
                      <span
                        className="data rounded px-2 py-0.5"
                        style={{ background: "rgba(255,255,255,0.1)" }}
                      >
                        {company.statutory.gstin}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-primary-fg">
                      <span>LLPIN:</span>
                      <span
                        className="data rounded px-2 py-0.5"
                        style={{ background: "rgba(255,255,255,0.1)" }}
                      >
                        {company.statutory.llpin}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours card */}
            <div className="panel flex items-center gap-4 p-6">
              <Clock size={28} className="shrink-0 text-accent" />
              <div>
                <p className="label-caps text-muted">Business Hours</p>
                <p className="mt-1 font-medium text-text">
                  {company.hours.days}: {company.hours.open}–{company.hours.close}{" "}
                  {company.hours.timezone}
                </p>
                <p className="text-xs text-muted">{company.hours.closed}: Closed</p>
              </div>
            </div>

            {/* Direct contact */}
            <div className="panel p-5 sm:p-6">
              <h2 className="text-lg font-semibold">Direct Contact</h2>
              <address className="mt-4 grid gap-3 text-sm not-italic">
                {company.phones.map((entry) => (
                  <a
                    key={entry.href}
                    className="flex min-h-11 items-center gap-3 transition-colors hover:text-highlight"
                    href={entry.href}
                  >
                    <Phone size={17} className="shrink-0 text-primary" /> {entry.label}
                  </a>
                ))}
                <a
                  className="flex min-h-11 items-center gap-3 transition-colors hover:text-highlight"
                  href={`https://wa.me/${company.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare size={17} className="shrink-0 text-primary" /> WhatsApp enquiry
                </a>
                <a
                  className="flex min-h-11 items-center gap-3 break-all transition-colors hover:text-highlight"
                  href={`mailto:${company.salesEmail}`}
                >
                  <Mail size={17} className="shrink-0 text-primary" /> {company.salesEmail}
                </a>
              </address>
            </div>
          </div>
        </div>

        {/* Google Maps embed */}
        <div className="panel mt-6 h-96 overflow-hidden">
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(registeredOffice.mapQuery)}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${company.legalName} — ${registeredOffice.label}, ${registeredOffice.locality}`}
          />
        </div>
      </div>
    </section>
  );
}
