import type { Chemical } from "@/data/products";
import { exportFacts } from "@/data/export-terms";

export function QuickInfoCard({ product }: { product: Chemical }) {
  /** [label, value, render as technical data] */
  const rows: Array<[string, string, boolean]> = [
    ["CAS Number", product.casNumber ?? "On request", true],
    ["Purity", product.purity ?? "As per grade", true],
    ["Origin", product.origin, false],
    ["Packaging", product.packaging, false],
    ["Availability", product.availability, false],
    ["MOQ", exportFacts.moq, false],
    ["Lead Time", exportFacts.leadTime, false],
    ["HS Code", exportFacts.hsCode, true],
    ["Port of Loading", exportFacts.portOfLoading, false]
  ];

  return (
    <div className="panel p-5">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">Specification</h2>
      <dl className="mt-4 text-sm">
        {rows.map(([label, value, isData]) => (
          <div key={label} className="spec-row">
            <dt className="shrink-0 text-muted">{label}</dt>
            <dd className={isData ? "data text-right text-text" : "text-right font-semibold"}>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
