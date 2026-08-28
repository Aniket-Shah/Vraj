import { NumberCounter } from "@/components/motion/NumberCounter";
import { categories } from "@/data/categories";
import { industries } from "@/data/industries";
import { products } from "@/data/products";

/**
 * Every figure here is derived from the catalogue, so it cannot drift out of date and
 * cannot be challenged by a buyer who counts.
 *
 * The previous version claimed 500 clients, 50 countries, 15 years and 24/7 support.
 * None of those are evidenced anywhere in the project, and the 24/7 claim contradicted
 * the published Mon–Sat hours. Add them back only once the client confirms real numbers.
 */

const inStock = products.filter((product) => product.availability === "In Stock").length;

const stats = [
  { label: "Chemicals in catalogue", value: products.length },
  { label: "Product categories", value: categories.length },
  { label: "Industries served", value: industries.length },
  { label: "Lines held in stock", value: inStock }
];

export function StatsGrid() {
  return (
    <section className="border-y border-border bg-surface-low py-10" aria-label="Catalogue at a glance">
      <div className="container grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-[family-name:var(--font-display)] text-4xl font-bold text-primary">
              <NumberCounter value={stat.value} suffix="" />
            </div>
            <p className="mt-1.5 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
