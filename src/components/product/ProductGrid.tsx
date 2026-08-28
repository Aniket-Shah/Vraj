import { ProductCard } from "@/components/product/ProductCard";
import type { Chemical } from "@/data/products";

export function ProductGrid({ products }: { products: Chemical[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
