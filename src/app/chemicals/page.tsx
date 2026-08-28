import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { ChemicalSearch } from "@/components/sections/ChemicalSearch";
import { ProductCard } from "@/components/product/ProductCard";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { pageMetadata, siteUrl } from "@/lib/utils";
import {
  ArrowRight,
  Beaker,
  Droplet,
  FlaskConical,
  Layers,
  Leaf,
  PaintBucket,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";

export const metadata = pageMetadata(
  "Chemical Categories",
  "Explore industrial solvents, acids, specialty chemicals, pigments, additives and cleaning chemicals for bulk B2B supply.",
  "/chemicals"
);

const icons: Record<string, LucideIcon> = {
  solvents: FlaskConical,
  acids: Beaker,
  industrial: Layers,
  specialty: Sparkles,
  pigments: PaintBucket,
  additives: Leaf,
  cleaning: Droplet
};

function search(query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  return products.filter((product) => {
    const haystack = [
      product.name,
      product.casNumber ?? "",
      product.formula ?? "",
      product.origin,
      product.packaging,
      ...product.industry
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

/** Representative industries per category — real chips drawn from the catalogue. */
function chipsFor(slug: string) {
  const industries = products
    .filter((product) => product.category === slug)
    .flatMap((product) => product.industry);
  return [...new Set(industries)].slice(0, 4);
}

export default async function ChemicalsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? search(query) : [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: categories.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: category.name,
      url: `${siteUrl}/chemicals/${category.slug}`
    }))
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container">
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Chemicals" }]} />

        <h1 className="mt-3 max-w-4xl">Industrial &amp; Specialty Chemical Categories</h1>
        <p className="body-lg mt-4 max-w-3xl text-muted">
          Explore our catalogue of {products.length} industrial chemicals, solvents, specialty
          compounds and raw materials, supplied against batch documentation.
        </p>

        <div className="mt-7 max-w-2xl">
          <ChemicalSearch defaultValue={query} />
        </div>

        {query ? (
          <section className="mt-10" aria-live="polite">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2>
                {results.length} {results.length === 1 ? "result" : "results"} for “{query}”
              </h2>
              <Link href="/chemicals" className="text-[14px] font-semibold text-accent hover:underline">
                Clear search
              </Link>
            </div>

            {results.length > 0 ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="panel mt-6 p-6 text-center sm:p-10">
                <h3>Nothing matched that search</h3>
                <p className="mx-auto mt-2 max-w-md text-[15px] text-muted">
                  We source well beyond our published catalogue. Send us the chemical name or CAS
                  number and we will confirm availability and price.
                </p>
                <Link href="/request-quote" className="btn btn-rfq mt-6">
                  Submit Sourcing Request
                </Link>
              </div>
            )}
          </section>
        ) : null}

        <div className="mt-12">
          {query ? <h2 className="mb-6">Browse all categories</h2> : null}

          {/* Bento grid — Fine & Specialty spans two columns as the featured card */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = icons[category.slug] ?? FlaskConical;
              const count = products.filter((product) => product.category === category.slug).length;
              const chips = chipsFor(category.slug);
              const isFeatured = category.slug === "specialty";

              return isFeatured ? (
                <Link
                  key={category.slug}
                  href={`/chemicals/${category.slug}`}
                  className="card group relative col-span-2 flex flex-col overflow-hidden p-5 sm:p-6"
                >
                  {/* Decorative corner accent */}
                  <div className="pointer-events-none absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-bl-full bg-surface-variant transition-transform group-hover:scale-110" aria-hidden="true" />
                  <div className="relative flex items-start justify-between">
                    <Icon size={28} className="text-primary" aria-hidden="true" />
                    {/* ISO 9001 badge */}
                    <span className="flex items-center gap-1.5 rounded-full border border-border bg-surface-lowest px-3 py-1 text-[11px] font-bold text-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                      ISO 9001 Certified
                    </span>
                  </div>
                  <h3 className="relative mt-5">{category.name}</h3>
                  <p className="body-sm relative mt-3 max-w-xl text-muted">{category.description}</p>
                  {/* Sub-type grid */}
                  <div className="relative mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {["Reagents", "Catalysts", "Intermediates", "Additives"].map((sub) => (
                      <div key={sub} className="rounded-[var(--radius-lg)] border border-border bg-surface p-3 text-center">
                        <span className="data block text-primary">{sub}</span>
                      </div>
                    ))}
                  </div>
                  <p className="label-caps relative mt-auto pt-5 text-muted">{count} products</p>
                </Link>
              ) : (
                <Link
                  key={category.slug}
                  href={`/chemicals/${category.slug}`}
                  className="card group relative flex flex-col overflow-hidden p-4 text-center sm:p-6 sm:text-left"
                >
                  {/* Decorative corner accent */}
                  <div className="pointer-events-none absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-bl-full bg-surface-variant opacity-60 transition-transform group-hover:scale-110" aria-hidden="true" />
                  <div className="relative">
                    <Icon size={28} className="mx-auto text-primary sm:mx-0" aria-hidden="true" />
                    {/* Two-up on phones: the glyph, the name and the count carry the card. */}
                    <h3 className="mt-3 text-[16px] leading-snug sm:mt-5 sm:text-[24px] sm:leading-8">
                      {category.name}
                    </h3>
                    <p className="body-sm mt-3 hidden text-muted sm:block">{category.description}</p>

                    {chips.length > 0 ? (
                      <div className="mt-5 hidden flex-wrap gap-2 sm:flex">
                        {chips.map((chip) => (
                          <span key={chip} className="chip">{chip}</span>
                        ))}
                      </div>
                    ) : null}

                    <p className="label-caps mt-2 pt-0 text-muted sm:mt-auto sm:pt-5">{count} products</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sourcing banner — the navy call-out from the approved screens. */}
        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-[var(--radius-xl)] bg-primary p-6 md:flex-row md:items-center md:p-10">
          <div className="max-w-2xl">
            <h2 className="text-primary-fg">Can&apos;t find a specific chemical?</h2>
            <p className="mt-3 text-primary-fixed opacity-90">
              Our sourcing network reaches well beyond the published catalogue. Send the chemical
              name or CAS number and we will confirm availability, packing and price.
            </p>
          </div>
          <Link href="/request-quote" className="btn btn-rfq shrink-0">
            Submit Sourcing Request <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
