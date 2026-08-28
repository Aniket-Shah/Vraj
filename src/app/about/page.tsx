import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { StatsGrid } from "@/components/sections/StatsGrid";
import { company, formatOffice } from "@/data/company";
import { exportDocuments, exportFacts, incotermsOffered } from "@/data/export-terms";
import { pageMetadata } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileCheck2,
  Handshake,
  PackageCheck,
  ScrollText,
  ShieldCheck,
  Ship,
  Wallet
} from "lucide-react";
import Link from "next/link";

export const metadata = pageMetadata(
  "About Us",
  `${company.legalName} — an active importer, exporter and wholesale trader of high-grade industrial chemicals, incorporated ${company.statutory.incorporatedOn}. Statutory standing, product documentation and export terms.`,
  "/about"
);

const values = [
  {
    icon: ShieldCheck,
    title: "Quality assurance",
    body: "Supplier-backed material, shipped against batch documentation you can verify before use."
  },
  {
    icon: ScrollText,
    title: "Statutory compliance",
    body: `Registered LLP, active GST standing and e-invoicing readiness — LLPIN ${company.statutory.llpin}.`
  },
  {
    icon: Handshake,
    title: "Reliable supply chain",
    body: "Direct import channels and Mumbai stock-holding for dependable repeat supply."
  },
  {
    icon: Wallet,
    title: "Transparent wholesale pricing",
    body: "Clear quotations on your Incoterm and currency, with no surprises at invoice."
  }
];

/**
 * The full statutory record lives here, in one place. The compliance section below
 * deliberately does not repeat it — merging two pages should remove a duplicate
 * table, not create one.
 */
const corporateFacts = [
  ["Legal entity", company.legalName],
  ["Incorporated", company.statutory.incorporatedOn],
  ["LLPIN", company.statutory.llpin],
  ["GSTIN", company.statutory.gstin],
  ["Registrar", company.statutory.registrar],
  ["Status", company.statutory.status],
  ["Business", company.statutory.classification],
  ["Taxpayer type", company.statutory.taxpayerType],
  ["Contribution obligation", company.statutory.contribution]
];

/**
 * Product certifications (ISO, REACH, GMP) are deliberately NOT claimed — add them
 * only as named, dated certificates once verified. For the procurement teams this
 * page is written for, an unevidenced badge is worse than none.
 */
const practices = [
  {
    icon: ShieldCheck,
    title: "Supplier-backed sourcing",
    body: "We buy from established manufacturers and authorised channels, Indian and imported. Origin is stated on every product page, so you know what you are quoting against before you enquire."
  },
  {
    icon: ClipboardCheck,
    title: "Batch documentation",
    body: "Every consignment ships against a batch Certificate of Analysis from the manufacturer. The COA, not the website, is the binding specification for the material you receive."
  },
  {
    icon: PackageCheck,
    title: "Packing and identification",
    body: "Bags, drums, carboys, IBC totes and tanker supply in original or export-standard packing, labelled with product, batch and handling information."
  }
];

const documents = [
  ["Certificate of Analysis (COA)", "Batch-specific, issued with the consignment"],
  ["Safety Data Sheet (SDS)", "Available before dispatch on request"],
  ["Technical Data Sheet (TDS)", "Available on request, where the manufacturer publishes one"],
  ["Manufacturer's specification", "Shared during technical evaluation"],
  ["Certificate of Origin", "Arranged for export consignments"],
  ["GST-compliant e-invoice", "Issued for every domestic transaction"]
];

const exportSteps = [
  {
    title: "Send your requirement",
    body: "Product and grade, quantity, destination port and preferred Incoterm. A specification sheet helps us quote accurately first time."
  },
  {
    title: "We confirm and quote",
    body: "We check stock or supplier availability, confirm packing and lead time, and quote in your currency on your chosen Incoterm."
  },
  {
    title: "Order confirmation",
    body: "On acceptance we confirm the batch, arrange packing to export standard, and prepare the documentation set."
  },
  {
    title: "Dispatch and documents",
    body: `Goods move through ${exportFacts.portOfLoading}. Documents are couriered and sent electronically as soon as they are issued.`
  }
];

const commercialTerms = [
  ["Incoterms offered", incotermsOffered.join(" · ")],
  ["Port of loading", exportFacts.portOfLoading],
  ["Packing options", exportFacts.packingOptions],
  ["Minimum order", exportFacts.moq],
  ["Lead time", exportFacts.leadTime]
];

export default function AboutPage() {
  const { gstComplianceScore, gstComplianceMax } = company.statutory;
  const scorePercent = Math.round((gstComplianceScore / gstComplianceMax) * 100);

  return (
    <>
      <section className="section">
        <div className="container">
          <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
            <div>
              <p className="eyebrow">About us</p>
              <h1 className="mt-3">About {company.legalName}</h1>
              <p className="prose-lite mt-5">
                {company.legalName} is an active importer, exporter and wholesale trader of
                high-grade industrial chemicals, incorporated on {company.statutory.incorporatedOn}{" "}
                and registered with {company.statutory.registrar}. We supply solvents, fine and
                specialty chemicals, and chemical intermediates to manufacturers across coatings,
                polymers, textiles, water treatment and agrochemical synthesis.
              </p>
              <p className="prose-lite mt-4">
                We are a trading house, not a manufacturer, and we do not present ourselves as one.
                What we are accountable for is knowing where material comes from, supplying it
                against the right batch documentation, and answering a technical question straight —
                including when the answer is that a grade is not one we can supply well.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/chemicals" className="btn btn-primary">
                  Browse the catalogue <ArrowRight size={16} />
                </Link>
                <Link href="#compliance" className="btn btn-outline">
                  Regulatory compliance
                </Link>
                <Link href="#export" className="btn btn-outline">
                  Export &amp; logistics
                </Link>
              </div>
            </div>

            <div className="panel p-5 sm:p-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-muted">
                Corporate details
              </h2>
              <dl className="mt-4 text-sm">
                {corporateFacts.map(([label, value]) => (
                  <div key={label} className="border-b border-border py-3 last:border-0">
                    <dt className="text-xs font-bold uppercase tracking-[0.05em] text-muted">{label}</dt>
                    <dd
                      className={
                        label === "LLPIN" || label === "GSTIN"
                          ? "data mt-1 text-text"
                          : "mt-1 font-semibold leading-relaxed"
                      }
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <StatsGrid />

      <section className="section">
        <div className="container">
          <p className="eyebrow">Leadership</p>
          <h2 className="mt-3">Designated partners</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:w-2/3">
            {company.partners.map((partner) => (
              <article key={partner.name} className="panel p-5 sm:p-6">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">
                  {partner.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-accent">{partner.role}</p>
                <p className="mt-3 text-sm text-muted">Associated since {partner.since}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <p className="eyebrow">Core values</p>
          <h2 className="mt-3">How we work</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, body }) => (
              <article key={title} className="panel p-5">
                <span
                  className="grid h-10 w-10 place-items-center rounded-[var(--radius)] bg-surface-mid text-primary"
                  aria-hidden="true"
                >
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="prose-lite mt-2 text-sm">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Was /compliance. The statutory record itself stays in Corporate details above;
          what belongs here is the standing, the practice and the paperwork. */}
      <section id="compliance" className="section scroll-mt-24 border-t border-border bg-surface-low">
        <div className="container">
          <p className="eyebrow">Regulatory compliance</p>
          <h2 className="mt-3">Statutory standing &amp; documentation</h2>
          <p className="mt-4 max-w-3xl text-muted">
            We are a registered LLP, an active GST-compliant wholesaler, and an e-invoice enabled
            supplier. Everything here is verifiable against the public record before you raise a
            vendor account.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
            <div className="grid gap-6">
              <div className="panel p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <BadgeCheck size={22} className="shrink-0 text-accent" />
                  <h3 className="text-[20px] font-semibold sm:text-[24px]">GST standing</h3>
                </div>
                <div className="mt-5 flex flex-wrap items-end gap-6">
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-accent">
                      {gstComplianceScore}
                      <span className="text-lg font-semibold text-muted">/{gstComplianceMax}</span>
                    </p>
                    <p className="mt-1 text-sm text-muted">GST compliance score</p>
                  </div>
                  {company.statutory.eInvoiceEnabled ? (
                    <span className="badge-status">E-invoice enabled</span>
                  ) : null}
                </div>
                <div
                  className="mt-5 h-2 w-full overflow-hidden rounded-full bg-surface-mid"
                  role="img"
                  aria-label={`GST compliance score ${gstComplianceScore} out of ${gstComplianceMax}`}
                >
                  <div className="h-full rounded-full bg-accent" style={{ width: `${scorePercent}%` }} />
                </div>
                <p className="prose-lite mt-4 text-sm">
                  A high compliance score and e-invoicing readiness mean your accounts payable team
                  gets clean, machine-readable invoicing and reliable input tax credit.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {practices.map(({ icon: Icon, title, body }) => (
                  <article key={title} className="panel p-5">
                    <Icon size={22} className="text-accent" />
                    <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                    <p className="prose-lite mt-2 text-sm">{body}</p>
                  </article>
                ))}
              </div>

              <div className="panel p-5 sm:p-6">
                <h3 className="text-[20px] font-semibold sm:text-[24px]">
                  Documents available on request
                </h3>
                <p className="prose-lite mt-3 text-sm">
                  Tell us the product and grade you are evaluating and we will send the current
                  documentation for it.
                </p>
                <ul className="mt-5">
                  {documents.map(([name, note]) => (
                    <li key={name} className="spec-row flex-col items-start gap-1 text-sm sm:flex-row sm:items-center sm:gap-4">
                      <span className="font-semibold">{name}</span>
                      <span className="text-muted sm:text-right">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="panel h-fit p-5 sm:p-6">
              <h3 className="text-xl font-semibold">Request documentation</h3>
              <p className="prose-lite mt-3 text-sm">
                Send the product name and grade. We will respond with the SDS, TDS or COA you need
                for your evaluation.
              </p>
              <Link href="/contact" className="btn btn-primary mt-5 w-full">
                Request documents <ArrowRight size={16} />
              </Link>
              <a href={`mailto:${company.salesEmail}`} className="btn btn-outline mt-3 w-full">
                Email us directly
              </a>
            </aside>
          </div>
        </div>
      </section>

      {/* Was /export. */}
      <section id="export" className="section scroll-mt-24 border-t border-border">
        <div className="container">
          <p className="eyebrow">For international buyers</p>
          <h2 className="mt-3">Export &amp; logistics</h2>
          <p className="mt-4 max-w-3xl text-muted">
            What we ship, how we ship it, and the paperwork that travels with it. If you need a
            term or a document that is not listed here, ask — most requirements can be arranged.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
            <div className="grid gap-6">
              <div className="panel p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <Ship size={22} className="shrink-0 text-accent" />
                  <h3 className="text-[20px] font-semibold sm:text-[24px]">Commercial terms</h3>
                </div>
                <dl className="mt-5 grid gap-3 text-sm">
                  {commercialTerms.map(([label, value]) => (
                    <div
                      key={label}
                      className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-border pb-3 last:border-0 last:pb-0"
                    >
                      <dt className="text-muted">{label}</dt>
                      <dd className="font-bold sm:text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="prose-lite mt-5 text-sm">
                  Quotations are issued in USD, EUR, GBP, AED or INR. Tell us the Incoterm you work
                  on and we will price to it.
                </p>
              </div>

              <div className="panel p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <FileCheck2 size={22} className="shrink-0 text-accent" />
                  <h3 className="text-[20px] font-semibold sm:text-[24px]">
                    Documentation we provide
                  </h3>
                </div>
                <ul className="mt-5 grid gap-3">
                  {exportDocuments.map((document) => (
                    <li
                      key={document.name}
                      className="flex flex-wrap justify-between gap-x-3 gap-y-1 border-b border-border pb-3 text-sm last:border-0 last:pb-0"
                    >
                      <span className="font-bold">{document.name}</span>
                      <span className="text-muted">{document.note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="panel p-5 sm:p-6">
                <h3 className="text-[20px] font-semibold sm:text-[24px]">How an export order runs</h3>
                <ol className="mt-5 grid gap-5">
                  {exportSteps.map((step, index) => (
                    <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-4">
                      <span className="grid h-8 w-8 place-items-center rounded-[var(--radius)] bg-surface-mid text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-bold">{step.title}</h4>
                        <p className="prose-lite mt-1 text-sm">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <aside className="panel h-fit p-5 sm:p-6">
              <h3 className="text-xl font-semibold">Talk to the export desk</h3>
              <p className="prose-lite mt-3 text-sm">
                Send your destination port and Incoterm with the requirement and we will come back
                with a landed price.
              </p>
              <Link href="/request-quote" className="btn btn-primary mt-5 w-full">
                Request an export quote <ArrowRight size={16} />
              </Link>
              <a href={`mailto:${company.exportEmail}`} className="btn btn-outline mt-3 w-full">
                Email the export desk
              </a>
              <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted">
                We reply {company.hours.days}, {company.hours.open}–{company.hours.close}{" "}
                {company.hours.timezone}. Enquiries received outside those hours are answered the
                next working morning.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container grid gap-4 md:grid-cols-2">
          {company.offices.map((office) => (
            <div key={office.id} className="panel p-5 sm:p-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.05em] text-muted">
                {office.label}
              </h2>
              <p className="mt-3 leading-relaxed">{formatOffice(office)}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
