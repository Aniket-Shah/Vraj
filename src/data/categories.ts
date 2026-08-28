import type { CategorySlug } from "@/data/products";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
}

export const categories: Category[] = [
  {
    slug: "solvents",
    name: "Solvents",
    description: "High purity solvents for coatings, ink, rubber, cosmetics, and processing applications.",
  },
  {
    slug: "acids",
    name: "Acids",
    description: "Industrial, technical, and food-grade acids sourced for consistent quality.",
  },
  {
    slug: "industrial",
    name: "Industrial Chemicals",
    description: "Essential chemicals for paper, pharma, food, paint, plywood, and bulk manufacturing.",
  },
  {
    slug: "specialty",
    name: "Specialty Chemicals",
    description: "Monomers, glycols, and performance chemicals for focused industrial requirements.",
  },
  {
    slug: "pigments",
    name: "Pigments & Dyes",
    description: "Pigments and dyeing chemicals for paint, plastic, ink, printing, and rubber markets.",
  },
  {
    slug: "additives",
    name: "Additives",
    description: "Processing aids, oils, emulsifiers, and additive chemistry for industry-specific use.",
  },
  {
    slug: "cleaning",
    name: "Cleaning Chemicals",
    description: "Cleaning, sanitation, and treatment chemicals with dependable local availability.",
  }
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
