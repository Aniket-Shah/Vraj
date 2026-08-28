import { B2BRFQForm } from "@/components/forms/B2BRFQForm";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { company } from "@/data/company";
import { pageMetadata } from "@/lib/utils";
import { Globe, MessageSquare, ReceiptText, ShieldCheck, Users } from "lucide-react";

export const metadata = pageMetadata(
  "Request for Quote",
  "Send your chemical requirement to Vraj Chem Impex LLP for a B2B quote in your currency and Incoterm.",
  "/request-quote"
);

const whyPartner = [
  {
    icon: ReceiptText,
    title: "E-Invoice Compliant",
    body: "Streamlined billing with strict adherence to the latest GST and E-invoicing mandates.",
  },
  {
    icon: Globe,
    title: "Global Sourcing Network",
    body: "Access to a wide range of high-quality chemicals sourced from reliable international and domestic partners.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assured",
    body: "Every batch ships with a Certificate of Analysis (COA) to guarantee chemical purity and grade specifications.",
  },
  {
    icon: Users,
    title: "Dedicated Procurement Support",
    body: "Direct access to experienced B2B account managers for complex sourcing requirements.",
  },
];

export default function RequestQuotePage() {
  return (
    <section className="section">
      <div className="container">
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Request a Quote" }]} />

        <div className="mt-2 grid gap-8 lg:grid-cols-[1fr_22rem]">
          {/* Main form area */}
          <div>
            <p className="eyebrow">B2B Enquiry</p>
            <h1 className="mt-2">Bulk Chemical RFQ</h1>
            <p className="body-lg mt-3 max-w-2xl text-muted">
              The more detail you provide — grade, volume, Incoterm and destination — the more
              accurate and faster your first quote will be.
            </p>
            <div className="mt-8">
              <B2BRFQForm />
            </div>
          </div>

          {/* "Why Partner with Vraj Chem Impex?" — dark navy sidebar matching reference */}
          <aside className="h-fit lg:sticky lg:top-28">
            <div className="rounded-[var(--radius-xl)] bg-primary p-6 text-primary-fg shadow-[var(--shadow-md)]">
              <h3
                className="mb-6 border-b pb-4 text-xl font-semibold leading-7"
                style={{ borderColor: "rgba(255,255,255,0.15)" }}
              >
                Why Partner with Vraj Chem Impex?
              </h3>
              <ul className="grid gap-6">
                {whyPartner.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="flex items-start gap-4">
                    <div
                      className="mt-0.5 shrink-0 rounded-full p-2"
                      style={{ background: "rgba(174,199,253,0.12)" }}
                    >
                      <Icon size={20} className="text-accent-soft" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold leading-tight text-primary-fixed">
                        {title}
                      </h4>
                      <p className="mt-1 text-[13px] leading-relaxed text-primary-fg opacity-75">
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div
                className="mt-8 border-t pt-6"
                style={{ borderColor: "rgba(255,255,255,0.15)" }}
              >
                <p className="mb-4 text-sm font-semibold text-primary-fixed">Prefer to talk?</p>
                <a
                  href={`https://wa.me/${company.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] border py-3 text-sm font-semibold text-primary-fg transition-colors hover:bg-white/10"
                  style={{ borderColor: "rgba(255,255,255,0.25)" }}
                >
                  <MessageSquare size={17} />
                  WhatsApp Enquiry
                </a>
                <a
                  href={company.phones[0].href}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] border py-3 text-sm font-semibold text-primary-fg transition-colors hover:bg-white/10"
                  style={{ borderColor: "rgba(255,255,255,0.25)" }}
                >
                  {company.phones[0].label}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
