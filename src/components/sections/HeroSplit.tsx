import { ArrowRight, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { QuickRFQ } from "@/components/forms/QuickRFQ";
import { ChemicalSearch } from "@/components/sections/ChemicalSearch";

export function HeroSplit() {
  return (
    <section className="border-b border-border bg-surface-low">
      <div className="container grid grid-cols-1 items-center gap-[var(--gutter)] pb-12 pt-10 md:pb-24 md:pt-16 lg:grid-cols-2 lg:pb-32 lg:pt-24">
        <div className="z-10 flex flex-col gap-5 md:gap-6">
          <span className="pill">
            <BadgeCheck size={14} className="text-accent" />
            Quality Assured Importer
          </span>

          <h1>Your Trusted Partner in Industrial &amp; Specialty Chemical Solutions</h1>

          <p className="body-lg max-w-2xl text-muted">
            Global importer, exporter, and wholesale trader of high-purity industrial chemicals,
            solvents, fine chemicals, and chemical intermediates.
          </p>

          <div className="w-full max-w-xl">
            <ChemicalSearch />
          </div>

          <div className="mt-2 flex flex-wrap gap-3 md:mt-4 md:gap-4">
            <Link href="/request-quote" className="btn btn-rfq">
              Request a Quote <ArrowRight size={14} />
            </Link>
            <Link href="/chemicals" className="btn btn-outline">
              Explore Chemical Catalog <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="z-10 w-full lg:pl-12">
          <QuickRFQ />
        </div>
      </div>
    </section>
  );
}
