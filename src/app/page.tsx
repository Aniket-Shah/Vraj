import { RFQForm } from "@/components/forms/RFQForm";
import { HeroSplit } from "@/components/sections/HeroSplit";
import { TrustBadges } from "@/components/sections/TrustBadges";
import { CategoryCard } from "@/components/sections/CategoryCard";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { categories } from "@/data/categories";
import { company } from "@/data/company";
import { jsonLd, pageMetadata, siteUrl } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = pageMetadata(
  `${company.legalName} | Industrial & Specialty Chemical Solutions`,
  "Global importer, exporter and wholesale trader of high-purity industrial chemicals, solvents, fine chemicals and chemical intermediates."
);

export default function HomePage() {
  return (
    <>
      {jsonLd({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: company.legalName,
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        email: company.salesEmail,
        telephone: company.phones.map((entry) => entry.label),
        foundingDate: company.statutory.incorporatedIso,
        taxID: company.statutory.gstin,
        identifier: company.statutory.llpin,
        description:
          "Importer, exporter and wholesale trader of industrial and specialty chemicals, solvents, fine chemicals and chemical intermediates.",
        address: company.offices.map((office) => ({
          "@type": "PostalAddress",
          streetAddress: `${office.line1}, ${office.line2}, ${office.locality}`,
          addressLocality: office.city,
          postalCode: office.postalCode,
          addressRegion: office.region,
          addressCountry: office.countryCode
        })),
        founder: company.partners.map((partner) => ({ "@type": "Person", name: partner.name }))
      })}

      <HeroSplit />
      <TrustBadges />

      <section id="categories" className="bg-surface-bright py-12 md:py-16">
        <div className="container">
          <div className="mb-8 text-center md:mb-12">
            <h2 className="mb-4">Chemical Solutions</h2>
            <p className="body-lg text-muted">
              Explore our comprehensive range of high-purity chemicals and solvents.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link href="/chemicals" className="btn btn-outline">
              View Full Catalog <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section id="quote" className="section">
        <div className="container grid gap-[var(--gutter)] lg:grid-cols-[1fr_22rem]">
          <div className="panel p-6 md:p-8">
            <h2 className="mb-2">Send us your requirement</h2>
            <p className="body-sm mb-6 text-muted">
              Grade, volume, packaging and destination. We reply within one working day.
            </p>
            <RFQForm />
          </div>
          <div>
            <h3 className="mb-4">Why buyers choose us</h3>
            <WhyChooseUs />
          </div>
        </div>
      </section>
    </>
  );
}
