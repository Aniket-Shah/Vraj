import type { Metadata } from "next";
import { company } from "@/data/company";

/**
 * Canonical origin for metadata, canonical links, the sitemap and structured data.
 *
 * A variable that is unset and one set to an empty string have to behave identically.
 * Vercel stores a blank value as "" rather than omitting the key, and `??` falls back
 * only on null or undefined — so a blank NEXT_PUBLIC_SITE_URL reached `new URL("")`
 * and failed the production build outright.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  // Vercel exposes the deployment host with no scheme. It is the right answer for a
  // preview or a demo that has no custom domain attached yet.
  const deployment = process.env.NEXT_PUBLIC_VERCEL_URL?.trim();
  if (deployment) return `https://${deployment.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;

  return "https://vrajchem.com";
}

export const siteUrl = resolveSiteUrl();

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
