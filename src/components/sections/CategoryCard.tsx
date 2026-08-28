import { categories } from "@/data/categories";
import { products } from "@/data/products";
import {
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

/** One glyph per category, matching the icon language of the approved screens. */
const icons: Record<string, LucideIcon> = {
  solvents: FlaskConical,
  acids: Beaker,
  industrial: Layers,
  specialty: Sparkles,
  pigments: PaintBucket,
  additives: Leaf,
  cleaning: Droplet
};

export function CategoryCard({ category }: { category: (typeof categories)[number] }) {
  const count = products.filter((product) => product.category === category.slug).length;
  const Icon = icons[category.slug] ?? FlaskConical;

  return (
    <Link
      href={`/chemicals/${category.slug}`}
      className="card group block p-4 text-center sm:p-6 sm:text-left"
    >
      <span className="icon-tile mx-auto mb-3 sm:mx-0 sm:mb-4" aria-hidden="true">
        <Icon size={22} />
      </span>
      {/* The two-up phone grid cannot carry the 24px headline or the blurb. */}
      <h3 className="mb-2 text-[16px] leading-snug sm:text-[24px] sm:leading-8">{category.name}</h3>
      <p className="body-sm hidden text-muted sm:block">{category.description}</p>
      <p className="label-caps mt-2 text-muted sm:mt-4">{count} products</p>
    </Link>
  );
}
