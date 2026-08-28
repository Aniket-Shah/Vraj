import type { Metadata } from "next";
import { company } from "@/data/company";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vrajchem.com";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function titleCase(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function whatsappUrl(text: string) {
  return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function pageMetadata(title: string, description: string, path = ""): Metadata {
  const absolute = `${siteUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: absolute },
    openGraph: {
      title,
      description,
      url: absolute,
      siteName: company.legalName,
      type: "website"
    }
  };
}

export function jsonLd(data: unknown) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
