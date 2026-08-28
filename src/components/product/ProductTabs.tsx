"use client";

import type { Chemical } from "@/data/products";
import { useState } from "react";

const tabs = [
  "Overview",
  "Specifications",
  "Packaging & Handling",
  "Safety & Regulatory",
] as const;

type Tab = (typeof tabs)[number];

export function ProductTabs({ product }: { product: Chemical }) {
  const [active, setActive] = useState<Tab>("Overview");

  return (
    <div className="panel overflow-hidden">
      {/* Tab bar — underline style matching reference */}
      <div
        className="flex gap-6 overflow-x-auto border-b border-border px-5 scrollbar-none"
        role="tablist"
        aria-label="Product information"
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={`shrink-0 whitespace-nowrap py-3.5 text-[13px] font-bold uppercase tracking-[0.05em] transition-colors ${
              active === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted hover:text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {active === "Overview" ? (
          <div className="prose-lite space-y-3 text-sm leading-relaxed text-muted">
            <p>{product.description}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5">
              <li>Bulk sourcing with full batch documentation (COA / TDS / SDS)</li>
              <li>Packaging aligned to industrial buyer requirements</li>
              <li>Available for RFQ-led commercial discussion on grade and volume</li>
            </ul>
            {product.industry.length > 0 ? (
              <div className="mt-4">
                <p className="label-caps mb-2 text-muted">Common Applications</p>
                <div className="flex flex-wrap gap-2">
                  {product.industry.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {active === "Specifications" ? (
          <table className="w-full border-collapse text-sm">
            <tbody>
              {(
                [
                  ["Appearance", "As per product grade"],
                  ["Chemical Formula", product.formula ?? "On request"],
                  ["Purity / Grade", product.purity ?? "As per commercial grade"],
                  ["Molecular Weight", "On request"],
                  ["Boiling Point", "On request"],
                  ["Melting Point", "On request"],
                  ["Density", "On request"],
                  ["Refractive Index", "On request"],
                ] as [string, string][]
              ).map(([key, value]) => (
                <tr key={key} className="border-b border-border last:border-0">
                  <th className="py-3 text-left font-medium text-muted">{key}</th>
                  <td className="data py-3 text-right text-text">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}

        {active === "Packaging & Handling" ? (
          <div className="space-y-4 text-sm text-muted">
            <p>
              Available packaging includes{" "}
              <strong className="text-text">{product.packaging}</strong>. Alternate packaging
              arrangements can be discussed depending on source, quantity and logistics route.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  { label: "Standard Pack", value: product.packaging },
                  { label: "MOQ", value: "As per enquiry" },
                  { label: "Lead Time", value: "Subject to stock / order" },
                  { label: "Port of Loading", value: "Nhava Sheva (JNPT), Mumbai" },
                ] as { label: string; value: string }[]
              ).map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-[var(--radius-lg)] border border-border bg-surface p-3"
                >
                  <span className="label-caps block text-muted">{label}</span>
                  <span className="mt-1 block text-sm font-medium text-text">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {active === "Safety & Regulatory" ? (
          <div className="space-y-4 text-sm text-muted">
            <p>
              Appropriate PPE, proper storage conditions, adequate ventilation and safe handling
              procedures are mandatory. Request the Safety Data Sheet (SDS/MSDS) before procurement
              and use.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-center">
                <span className="label-caps block text-muted">SDS Status</span>
                <span className="mt-1 block font-semibold text-accent">Available on Request</span>
              </div>
              <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-center">
                <span className="label-caps block text-muted">REACH Compliance</span>
                <span className="mt-1 block font-semibold text-text">Supplier Declared</span>
              </div>
              <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-center">
                <span className="label-caps block text-muted">UN Classification</span>
                <span className="mt-1 block font-semibold text-text">On Request</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
