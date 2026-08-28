import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { siteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/chemicals",
    "/request-quote",
    "/contact",
    "/privacy",
    "/terms"
  ].map((path) => ({ url: `${siteUrl}${path}`, lastModified }));

  const categoryRoutes = categories.map((category) => ({
    url: `${siteUrl}/chemicals/${category.slug}`,
    lastModified
  }));

  const productRoutes = products.map((product) => ({
    url: `${siteUrl}/chemicals/${product.category}/${product.id}`,
    lastModified
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
