import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { company } from "@/data/company";
import { pageMetadata } from "@/lib/utils";

export const metadata = pageMetadata(
  "Terms of Use",
  `The terms on which ${company.legalName} makes this website and its product information available.`,
  "/terms"
);

const sections = [
  {
    heading: "About this site",
    body: [
      `This website is operated by ${company.legalName}. By using it you accept these terms.`
    ]
  },
  {
    heading: "Product information is indicative",
    body: [
      "Specifications, purity grades, packaging and availability shown here are indicative and are drawn from supplier documentation. They do not form part of any contract.",
      "The binding specification for any supply is the one stated on our quotation and the batch Certificate of Analysis issued with the shipment."
    ]
  },
  {
    heading: "Quotations",
    body: [
      "Nothing on this site is an offer to sell. Prices, lead times and availability are confirmed only in a written quotation, and quotations are valid for the period stated on them.",
      "All supply is subject to our terms of sale, stock at the time of order confirmation, and any licence or permit the destination country requires."
    ]
  },
  {
    heading: "Safe handling is the buyer's responsibility",
    body: [
      "Chemical products require competent handling, storage and disposal. Buyers are responsible for satisfying themselves that a product is suitable for their intended application, and for complying with the health, safety and environmental law that applies to them.",
      "Always read the Safety Data Sheet before handling any product. We will provide it on request."
    ]
  },
  {
    heading: "Export compliance",
    body: [
      "Buyers are responsible for import permits, registrations and end-use declarations required in the destination country. We will not supply where doing so would breach sanctions or export control law."
    ]
  },
  {
    heading: "Liability",
    body: [
      "We take care to keep this site accurate but do not warrant that it is free from error or always current. To the extent the law allows, we are not liable for loss arising from reliance on the information published here."
    ]
  },
  {
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of India, and the courts at Mumbai, Maharashtra have jurisdiction."
    ]
  }
];

export default function TermsPage() {
  return (
    <section className="section">
      <div className="container">
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]} />
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3">Terms of Use</h1>
        <p className="mt-4 max-w-3xl text-muted">
          The basis on which we publish product information and respond to enquiries.
        </p>

        <div className="mt-10 grid max-w-3xl gap-8">
          {sections.map((section) => (
            <article key={section.heading}>
              <h2 className="">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="prose-lite mt-3">{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
