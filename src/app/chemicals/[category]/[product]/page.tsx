import { InlineRFQ } from "@/components/forms/InlineRFQ";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductTabs } from "@/components/product/ProductTabs";
import { HazardBadge } from "@/components/product/HazardBadge";
import { DocumentButtons } from "@/components/product/DocumentButtons";
import { getCategory } from "@/data/categories";
import { getProduct, getProductsByCategory, products } from "@/data/products";
import { company } from "@/data/company";
import { pageMetadata, siteUrl } from "@/lib/utils";
import { notFound } from "next/navigation";

/** Bordered tile on phones, plain column from the small breakpoint up. */
const specTile =
  "rounded-[var(--radius-lg)] border border-border bg-surface-lowest p-3 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0";

export function generateStaticParams() {
  return products.map((product) => ({ category: product.category, product: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const { category, product } = await params;
  const item = getProduct(category, product);
  if (!item) return {};
  return pageMetadata(item.name, item.description, `/chemicals/${category}/${product}`);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const { category: categorySlug, product: productSlug } = await params;
  const category = getCategory(categorySlug);
  const product = getProduct(categorySlug, productSlug);
  if (!category || !product) notFound();

  const related = getProductsByCategory(categorySlug)
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id,
    category: category.name,
    offers: {
      "@type": "Offer",
      availability:
        product.availability === "In Stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/BackOrder",
      url: `${siteUrl}/chemicals/${categorySlug}/${productSlug}`,
      seller: { "@type": "Organization", name: company.legalName },
    },
  };

  return (
    <section className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="container">
        <BreadcrumbNav
          items={[
            { label: "Home", href: "/" },
            { label: "Chemicals", href: "/chemicals" },
            { label: category.name, href: `/chemicals/${category.slug}` },
            { label: product.name },
          ]}
        />

        {/* Three columns on desktop. On a phone the same children reflow to the order the
            mobile screens use — plate, identity and specs, documents, then the RFQ.
            min-w-0 is load-bearing: without it the tab strip's intrinsic width forces the
            single column wider than the viewport and the whole page scrolls sideways. */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[16rem_1fr_22rem] lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-3">

          {/* Product visual plate + hazard badge */}
          <div className="order-1 flex min-w-0 flex-col gap-3 lg:order-none lg:col-start-1 lg:row-start-1">
            <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-[var(--radius-xl)] bg-surface-mid lg:h-64">
              {/* Decorative gradient background */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(15,44,89,0.08) 0%, transparent 100%)",
                }}
                aria-hidden="true"
              />
              {/* Chemical flask icon */}
              <svg
                viewBox="0 0 80 80"
                className="h-14 w-14 opacity-25 text-primary-container"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M35 10h10v22l18 30H17L35 32V10z" />
                <rect x="30" y="8" width="20" height="4" rx="2" />
              </svg>

              {/* Hazard badge — absolute top-left */}
              <div className="absolute left-2 top-2">
                <HazardBadge category={product.category} />
              </div>

              {/* In stock indicator */}
              <div className="absolute bottom-2 right-2">
                <span
                  className={
                    product.availability === "In Stock" ? "badge-status" : "badge-neutral"
                  }
                >
                  {product.availability === "In Stock" ? (
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                  ) : null}
                  {product.availability}
                </span>
              </div>
            </div>

          </div>

          {/* SDS / TDS / COA document buttons */}
          <div className="order-3 min-w-0 lg:order-none lg:col-start-1 lg:row-start-2">
            <DocumentButtons productName={product.name} />
          </div>

          {/* MIDDLE — Product name, specs grid, and tabbed content */}
          <div className="order-2 flex min-w-0 flex-col gap-6 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <div>
              <p className="eyebrow">{category.name}</p>
              <h1 className="mt-2">{product.name}</h1>
              <p className="body-lg mt-3 text-muted">{product.description}</p>
            </div>

            {/* Key specs: 2-col grid between headline and tabs — matches reference layout.
                On a phone each pair becomes its own bordered tile, as in the mobile screens,
                because bare columns at 170px read as one run-on block. */}
            <div className="grid grid-cols-2 gap-3 border-y border-border py-5 sm:gap-x-8 sm:gap-y-4">
              {product.casNumber ? (
                <div className={specTile}>
                  <span className="label-caps mb-1 block text-muted">CAS Number</span>
                  <span className="data font-medium text-text">{product.casNumber}</span>
                </div>
              ) : null}
              <div className={specTile}>
                <span className="label-caps mb-1 block text-muted">Grade</span>
                <span className="inline-block rounded bg-surface-dim px-2 py-0.5 text-sm text-text">
                  {product.purity ? `Purity: ${product.purity}` : "Technical / Industrial"}
                </span>
              </div>
              {product.formula ? (
                <div className={specTile}>
                  <span className="label-caps mb-1 block text-muted">Chemical Formula</span>
                  <span className="data font-medium text-text">{product.formula}</span>
                </div>
              ) : null}
              <div className={specTile}>
                <span className="label-caps mb-1 block text-muted">Packaging</span>
                <span className="text-sm font-medium text-text">{product.packaging}</span>
              </div>
              <div className={specTile}>
                <span className="label-caps mb-1 block text-muted">Origin</span>
                <span className="text-sm font-medium text-text">{product.origin}</span>
              </div>
              {product.industry.length > 0 ? (
                <div className="col-span-2">
                  <span className="label-caps mb-2 block text-muted">Industries</span>
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

            {/* Tabbed interface: Overview · Specifications · Packaging & Handling · Safety */}
            <ProductTabs product={product} />
          </div>

          {/* RIGHT — Sticky Wholesale RFQ sidebar */}
          <InlineRFQ product={product} />
        </div>

        {/* Related products */}
        {related.length > 0 ? (
          <section className="mt-14">
            <h2 className="mb-5">Related Chemicals</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}
