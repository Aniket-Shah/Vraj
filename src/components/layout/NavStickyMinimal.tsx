"use client";

import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { categories } from "@/data/categories";
import { company } from "@/data/company";
import { BrandMark } from "@/components/layout/BrandMark";

const chemicalCategories = categories.map((category) => ({
  label: category.name,
  href: `/chemicals/${category.slug}`,
  desc: category.description
}));

/** Every destination here resolves to a page that exists. */
const mainLinks = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/chemicals", dropdown: "chemicals" as const },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export function NavStickyMinimal() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setOpen(false);
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <>
      {/* Utility bar — light ground, statutory identifiers only. The phone number is
          the useful action on a phone, so it leads there and the GSTIN waits for width. */}
      <div className="border-b border-border bg-surface-high text-muted">
        <div className="container flex min-h-11 items-center justify-between gap-3 py-1 md:min-h-0">
          <div className="label-caps flex min-w-0 gap-4">
            <span className="truncate">LLPIN: {company.statutory.llpin}</span>
            <span className="hidden md:inline">GSTIN: {company.statutory.gstin}</span>
          </div>
          <a className="label-caps flex min-h-11 shrink-0 items-center transition-colors hover:text-primary md:min-h-0" href={company.phones[0].href}>
            {company.phones[0].label}
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border bg-header">
        <div className="container flex h-16 items-center justify-between gap-3 lg:h-[72px] lg:gap-4 2xl:gap-6">
          <Link href="/" className="flex min-w-0 items-center gap-2" aria-label={`${company.legalName} home`}>
            <BrandMark />
            {/* The suffix is dropped until there is real room for it, exactly as the
                mobile screens show. The full legal name still carries the link's
                accessible name, the utility bar, the footer and the structured data. */}
            <span className="truncate font-[family-name:var(--font-display)] text-[17px] font-bold leading-tight text-white sm:text-[20px] md:text-[24px] lg:text-[20px] xl:text-[24px]">
              {company.legalName.replace(/\s+LLP$/i, "")}
              <span className="hidden xl:inline"> LLP</span>
            </span>
          </Link>

          <nav ref={dropdownRef} className="hidden items-center gap-4 lg:flex 2xl:gap-6" aria-label="Primary">
            {mainLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label} className="relative flex items-center gap-1 py-6">
                  <Link
                    href={link.href}
                    className="label-caps whitespace-nowrap text-white transition-colors hover:text-accent-soft"
                  >
                    {link.label}
                  </Link>
                  <button
                    type="button"
                    className="cursor-pointer p-0.5 text-white transition-colors hover:text-accent-soft"
                    aria-expanded={activeDropdown === link.dropdown}
                    aria-haspopup="true"
                    aria-label={`${activeDropdown === link.dropdown ? "Hide" : "Show"} categories`}
                    onClick={() =>
                      setActiveDropdown((current) => (current === link.dropdown ? null : link.dropdown))
                    }
                  >
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${activeDropdown === link.dropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {activeDropdown === link.dropdown ? (
                    <div className="absolute left-0 top-[68px] w-72 rounded-[var(--radius-xl)] border border-border bg-menu p-2 shadow-[var(--shadow-md)]">
                      <ul className="grid gap-0.5">
                        {chemicalCategories.map((sub) => (
                          <li key={sub.label}>
                            <Link
                              href={sub.href}
                              className="block rounded-[var(--radius-lg)] p-2.5 transition-colors hover:bg-surface-low"
                            >
                              <span className="block text-[14px] font-semibold text-primary">{sub.label}</span>
                              <span className="mt-0.5 block text-[12px] leading-snug text-muted">
                                {sub.desc.slice(0, 54)}…
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="label-caps whitespace-nowrap py-6 text-white transition-colors hover:text-accent-soft"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-2 lg:gap-4">
            {/* Narrow phones get the RFQ pill from the mobile screens rather than no CTA at all. */}
            <Link className="btn btn-rfq px-3 py-2 sm:px-4" href="/request-quote">
              <span className="sm:hidden">RFQ</span>
              <span className="hidden sm:inline">Request a Quote</span>
            </Link>
            <button
              type="button"
              className="-mr-2 grid h-11 w-11 place-items-center text-white lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open ? (
          <div id="mobile-menu" className="border-t border-border bg-menu lg:hidden">
            <div className="container grid max-h-[70vh] gap-0.5 overflow-y-auto py-3">
              {mainLinks.map((link) =>
                link.dropdown ? (
                  <details key={link.label} className="group">
                    <summary className="label-caps flex min-h-11 cursor-pointer list-none items-center justify-between rounded-[var(--radius-lg)] px-3 py-2.5 text-primary transition-colors hover:bg-surface-low">
                      <span>{link.label}</span>
                      <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="ml-3 grid gap-0.5 border-l border-border py-1 pl-3">
                      {chemicalCategories.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="flex min-h-11 items-center rounded p-2 text-[14px] text-muted transition-colors hover:bg-surface-low hover:text-primary"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="label-caps flex min-h-11 items-center rounded-[var(--radius-lg)] px-3 py-2.5 text-primary transition-colors hover:bg-surface-low"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Link className="btn btn-rfq mt-3 w-full" href="/request-quote">
                Request a Quote
              </Link>
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}
