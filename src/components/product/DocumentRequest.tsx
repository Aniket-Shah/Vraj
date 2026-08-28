"use client";

import { FileText, FlaskConical, ScrollText } from "lucide-react";
import { company } from "@/data/company";
import { track } from "@/lib/analytics";

/**
 * These request documents rather than serving them. We do not hold redistributable SDS,
 * TDS or COA files yet, and a download button that produces nothing is worse than an
 * honest request path — it also captures a qualified contact at the moment of technical
 * evaluation, which is the highest-intent lead this catalogue produces.
 */
const documents = [
  { id: "sds", label: "Request Safety Data Sheet (SDS)", icon: ScrollText },
  { id: "tds", label: "Request Technical Data Sheet (TDS)", icon: FileText },
  { id: "coa", label: "Request Certificate of Analysis (COA)", icon: FlaskConical }
];

export function DocumentRequest({ productName }: { productName: string }) {
  return (
    <div className="panel p-5">
      <h2 className="text-lg font-semibold">Technical documentation</h2>
      <p className="mt-2 text-sm text-muted">
        Documentation is issued per batch and grade. Tell us which you need and we will send the
        current version.
      </p>
      <div className="mt-4 grid gap-2">
        {documents.map(({ id, label, icon: Icon }) => {
          const subject = `${label.replace("Request ", "")} — ${productName}`;
          const body = `Please send the ${label
            .replace("Request ", "")
            .toLowerCase()} for ${productName}.\n\nCompany:\nApplication:\nRequired quantity:`;

          return (
            <a
              key={id}
              className="btn btn-outline w-full justify-start gap-2 text-left"
              href={`mailto:${company.salesEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
              onClick={() => track("datasheet_request", { document: id, product: productName })}
            >
              <Icon size={16} className="shrink-0 text-primary" />
              {label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
