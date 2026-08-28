import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { company, addressOneLine } from "@/data/company";
import { pageMetadata } from "@/lib/utils";

export const metadata = pageMetadata(
  "Privacy Policy",
  `How ${company.legalName} collects, uses and protects the business contact details you share through this site.`,
  "/privacy"
);

const sections = [
  {
    heading: "What we collect",
    body: [
      "When you submit a quote request or contact form we collect the details you enter: your name, company name, email address, telephone number, country, the chemical and quantity you are enquiring about, your intended application, and any document you choose to attach.",
      "We do not collect payment details through this website, and we do not ask for personal information beyond what is needed to respond to a business enquiry."
    ]
  },
  {
    heading: "Why we use it",
    body: [
      "We use your details for one purpose: to respond to your enquiry with pricing, availability and technical information, and to carry out any resulting supply.",
      "Our lawful basis is your consent, which you give by ticking the consent box on the form, together with our legitimate interest in responding to a business-to-business enquiry."
    ]
  },
  {
    heading: "Who sees it",
    body: [
      "Your enquiry is received by our sales team. Where fulfilling your requirement needs it, we may share the relevant technical details with a manufacturer, supplier or freight forwarder.",
      "We do not sell your details, and we do not share them for anyone else's marketing."
    ]
  },
  {
    heading: "How long we keep it",
    body: [
      "Enquiries are retained for up to 24 months so we can service repeat requirements and honour previous quotations. Records connected to a completed transaction are kept for as long as tax and customs law requires.",
      "You can ask us to delete your enquiry sooner, and we will unless we are legally required to keep it."
    ]
  },
  {
    heading: "Your rights",
    body: [
      "You can ask us for a copy of the details we hold about you, ask us to correct them, ask us to delete them, or withdraw your consent at any time.",
      "Withdrawing consent does not affect anything we did before you withdrew it. If you are in the EU or UK you also have the right to complain to your data protection authority."
    ]
  },
  {
    heading: "Cookies and measurement",
    body: [
      "This site does not set advertising cookies. If analytics is enabled we use it only to understand which pages are useful and where enquiries come from, in aggregate."
    ]
  }
];

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container">
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3">Privacy Policy</h1>
        <p className="mt-4 max-w-3xl text-muted">
          This policy explains what {company.legalName} does with the business contact details you
          share through this website.
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

          <article>
            <h2 className="">Contacting us</h2>
            <p className="prose-lite mt-3">
              For any request about your data, write to{" "}
              <a className="text-accent hover:underline" href={`mailto:${company.salesEmail}`}>
                {company.salesEmail}
              </a>{" "}
              or to {company.legalName}, {addressOneLine}.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
