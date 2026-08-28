import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { CategoryContent } from "@/components/product/CategoryContent";
import { getCategory, categories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { pageMetadata, siteUrl } from "@/lib/utils";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return pageMetadata(category.name, category.description, `/chemicals/${slug}`);
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const items = getProductsByCategory(slug);
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: `${siteUrl}/chemicals/${slug}/${product.id}`
    }))
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container">
        <BreadcrumbNav items={[{ label: "Home", href: "/" }, { label: "Chemicals", href: "/chemicals" }, { label: category.name }]} />
        <h1 className="mt-3">{category.name}</h1>
        <p className="body-lg mt-3 max-w-3xl text-muted">{category.description}</p>
        <CategoryContent initialProducts={items} categoryName={category.name} />
      </div>
    </section>
  );
}
