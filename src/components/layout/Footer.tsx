import Link from "next/link";
import { company, registeredOffice } from "@/data/company";

const columns = [
  {
    heading: "Legal & Compliance",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Regulatory Compliance", href: "/about#compliance" }
    ]
  },
  {
    heading: "Operations",
    links: [
      { label: "Export & Logistics", href: "/about#export" },
      { label: "Chemical Catalog", href: "/chemicals" },
      { label: "Contact Support", href: "/contact" }
    ]
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Request a Quote", href: "/request-quote" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="w-full bg-footer py-10 text-primary-fg md:py-12">
      <div className="container grid grid-cols-2 gap-[var(--gutter)] md:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
          <div className="font-[family-name:var(--font-display)] text-[24px] font-bold leading-8">
            {company.legalName}
          </div>
          <p className="body-sm text-primary-fixed opacity-80">
            Trusted wholesale partner in industrial &amp; specialty chemical solutions. Global
            importer, exporter, and wholesale trader.
          </p>
          <div className="body-sm mt-auto pt-4 text-primary-fixed opacity-80">
            &copy; {new Date().getFullYear()} {company.legalName}.
            <br />
            {registeredOffice.locality}, {registeredOffice.city}.
            <br />
            All Rights Reserved.
          </div>
        </div>

        {columns.map((column) => (
          <nav key={column.heading} className="flex flex-col md:gap-1" aria-label={column.heading}>
            <h4 className="label-caps mb-2 text-primary-fg">{column.heading}</h4>
            {column.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                /* A 20px link is not a touch target; the row carries the 44px instead. */
                className="body-sm flex min-h-11 items-center text-primary-fixed opacity-80 transition-opacity hover:opacity-100 md:min-h-0 md:py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="container mt-10 border-t border-white/15 pt-6">
        <dl className="label-caps flex flex-wrap gap-x-8 gap-y-2 text-primary-fixed opacity-80">
          <div className="flex gap-2">
            <dt>GSTIN</dt>
            <dd className="data">{company.statutory.gstin}</dd>
          </div>
          <div className="flex gap-2">
            <dt>LLPIN</dt>
            <dd className="data">{company.statutory.llpin}</dd>
          </div>
          <div className="flex gap-2">
            <dt>Email</dt>
            <dd>{company.salesEmail}</dd>
          </div>
        </dl>
      </div>
    </footer>
  );
}
