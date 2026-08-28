import type { Metadata } from "next";
import { Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { NavStickyMinimal } from "@/components/layout/NavStickyMinimal";
import { FloatingContactBar } from "@/components/layout/FloatingContactBar";
import { LeadCaptureModal } from "@/components/forms/LeadCaptureModal";
import { company } from "@/data/company";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

/** Headings — the face used throughout the approved screens. */
const display = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap"
});

/** Body — high x-height, neutral, built for long technical catalogues. */
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap"
});

/** Technical data — CAS numbers, formulae and quantities stay unambiguous. */
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.legalName} | Industrial Chemical Stockist & Exporter`,
    template: `%s | ${company.legalName}`
  },
  description:
    "B2B supplier and stockist for chemicals, solvents, monomers, pigments, additives and industrial chemicals, serving buyers in India and overseas."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[var(--radius)] focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-primary-fg"
        >
          Skip to content
        </a>
        <NavStickyMinimal />
        <main id="main">{children}</main>
        <FloatingContactBar />
        <LeadCaptureModal />
        <Footer />
      </body>
    </html>
  );
}
