import type { Chemical } from "@/data/products";
import Link from "next/link";
import { Beaker, Droplet, FlaskConical, Package } from "lucide-react";

const glyphs = {
  solvents: Droplet,
  acids: FlaskConical,
  cleaning: Droplet,
  specialty: Beaker,
  pigments: Beaker,
  additives: Beaker,
  industrial: Package
} as const;

function packagingKind(packaging: string) {
  const value = packaging.toLowerCase();
  if (value.includes("drum")) return "Drums";
  if (value.includes("bag")) return "Bags";
  if (value.includes("carboy")) return "Carboys";
  if (value.includes("ibc") || value.includes("tote")) return "IBC";
  if (value.includes("tanker")) return "Tanker";
  return null;
}

export function ProductCard({ product }: { product: Chemical }) {
  const Glyph = glyphs[product.category as keyof typeof glyphs] ?? Beaker;
  const inStock = product.availability === "In Stock";
  const packKind = packagingKind(product.packaging);

  const specs: Array<[string, string]> = [
    ["CAS Number", product.casNumber ?? "On request"],
    ["Chemical Formula", product.formula ?? "On request"],
    ["Purity", product.purity ?? "As per grade"],
    ["Packaging", product.packaging]
  ];

  return (
    <article
      className={`card flex h-full flex-col overflow-hidden border-l-4 sm:border-l sm:border-l-border ${
        inStock ? "border-l-accent" : "border-l-gold"
      }`}
    >
      {/* Product plate — the catalogue has no photography, so the category glyph
          stands in rather than a broken or stock image. A phone cannot spare 160px
          for a placeholder, so the stock state moves inline instead. */}
      <div className="relative hidden h-40 items-center justify-center bg-surface-mid sm:flex">
        <Glyph size={40} className="text-primary-container opacity-40" aria-hidden="true" />
        <span className={`absolute right-3 top-3 ${inStock ? "badge-status" : "badge-neutral"}`}>
          {inStock ? <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" /> : null}
          {product.availability}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {product.industry.slice(0, 1).map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
          {packKind ? <span className="chip">{packKind}</span> : null}
          <span className={`sm:hidden ${inStock ? "badge-status" : "badge-neutral"}`}>
            {inStock ? <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" /> : null}
            {product.availability}
          </span>
        </div>

        <h3 className="mt-3 text-[20px] leading-7 sm:text-[22px]">{product.name}</h3>
        <p className="body-sm mt-1 text-muted">{product.origin}</p>

        <dl className="mt-4 rounded-[var(--radius-lg)] border border-border">
          {specs.map(([label, value], index) => (
            <div
              key={label}
              className={`flex items-center justify-between gap-3 px-3 py-2 ${
                index < specs.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <dt className="body-sm shrink-0 text-muted">{label}</dt>
              <dd className="data truncate text-right text-text">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Side by side these two labels wrap to two lines on a phone, so they stack. */}
        <div className="mt-4 grid gap-2 pt-0 sm:mt-5 sm:grid-cols-2 sm:gap-3">
          <Link
            className="btn btn-outline"
            href={`/chemicals/${product.category}/${product.id}`}
          >
            View Specifications
          </Link>
          <Link
            className="btn btn-rfq"
            href={`/chemicals/${product.category}/${product.id}#rfq`}
          >
            Request Bulk Price
          </Link>
        </div>
      </div>
    </article>
  );
}
