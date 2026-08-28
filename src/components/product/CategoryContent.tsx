"use client";

import { useMemo, useState } from "react";
import { ChevronDown, RotateCcw, Search, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import type { Chemical } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";

const ITEMS_PER_PAGE = 9;

/** Filter dimensions are derived from the catalogue, so every option returns results. */
function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function packagingKind(packaging: string) {
  const value = packaging.toLowerCase();
  if (value.includes("drum")) return "Drums";
  if (value.includes("bag")) return "Bags";
  if (value.includes("carboy")) return "Carboys";
  if (value.includes("ibc") || value.includes("tote")) return "IBC";
  if (value.includes("tanker")) return "Tanker";
  return "Other";
}

type FilterGroupProps = {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
};

function FilterGroup({ title, options, selected, onToggle }: FilterGroupProps) {
  const [open, setOpen] = useState(true);

  if (options.length === 0) return null;

  return (
    <div className="border-b border-border pb-5">
      <button
        type="button"
        className="flex w-full items-center justify-between py-2 text-left"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="text-[16px] font-semibold text-primary">{title}</span>
        <span className="flex items-center gap-2">
          {selected.length > 0 ? (
            <span className="badge-status">{selected.length}</span>
          ) : null}
          <ChevronDown
            size={16}
            className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {open ? (
        <div className="mt-2 grid max-h-56 gap-2.5 overflow-y-auto pr-1 custom-scroll">
          {options.map((option) => (
            <label
              key={option}
              className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px] text-text lg:min-h-0"
            >
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onToggle(option)}
                className="h-4 w-4 shrink-0 rounded-[2px] accent-[var(--color-primary)]"
              />
              {option}
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CategoryContent({
  initialProducts,
  categoryName
}: {
  initialProducts: Chemical[];
  categoryName: string;
}) {
  const [query, setQuery] = useState("");
  const [packaging, setPackaging] = useState<string[]>([]);
  const [origins, setOrigins] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("A-Z");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const options = useMemo(
    () => ({
      packaging: uniqueSorted(initialProducts.map((p) => packagingKind(p.packaging))),
      origins: uniqueSorted(initialProducts.map((p) => p.origin)),
      industries: uniqueSorted(initialProducts.flatMap((p) => p.industry)),
      availability: uniqueSorted(initialProducts.map((p) => p.availability))
    }),
    [initialProducts]
  );

  function toggle(list: string[], set: (next: string[]) => void, value: string) {
    setPage(1);
    set(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  function clearAll() {
    setQuery("");
    setPackaging([]);
    setOrigins([]);
    setIndustries([]);
    setAvailability([]);
    setPage(1);
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return initialProducts.filter((product) => {
      if (needle) {
        const haystack = [product.name, product.casNumber ?? "", product.formula ?? ""]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      if (packaging.length && !packaging.includes(packagingKind(product.packaging))) return false;
      if (origins.length && !origins.includes(product.origin)) return false;
      if (industries.length && !product.industry.some((item) => industries.includes(item))) return false;
      if (availability.length && !availability.includes(product.availability)) return false;
      return true;
    });
  }, [initialProducts, query, packaging, origins, industries, availability]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortBy === "A-Z") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "Z-A") list.sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === "In stock first") {
      list.sort((a, b) => Number(b.availability === "In Stock") - Number(a.availability === "In Stock"));
    }
    return list;
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const current = Math.min(page, totalPages);
  const paginated = sorted.slice((current - 1) * ITEMS_PER_PAGE, current * ITEMS_PER_PAGE);

  const activeCount =
    packaging.length + origins.length + industries.length + availability.length + (query ? 1 : 0);

  const filterPanel = (
    <div className="grid gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-semibold text-primary">Filters</h2>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-accent hover:underline"
          >
            <RotateCcw size={13} /> Clear all
          </button>
        ) : null}
      </div>

      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
          <Search size={16} />
        </span>
        <label htmlFor="filter-search" className="sr-only">
          Search within this category
        </label>
        <input
          id="filter-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Name, CAS or formula"
          className="input pl-9"
        />
      </div>

      <FilterGroup
        title="Packaging"
        options={options.packaging}
        selected={packaging}
        onToggle={(value) => toggle(packaging, setPackaging, value)}
      />
      <FilterGroup
        title="Origin"
        options={options.origins}
        selected={origins}
        onToggle={(value) => toggle(origins, setOrigins, value)}
      />
      <FilterGroup
        title="Industry"
        options={options.industries}
        selected={industries}
        onToggle={(value) => toggle(industries, setIndustries, value)}
      />
      <FilterGroup
        title="Availability"
        options={options.availability}
        selected={availability}
        onToggle={(value) => toggle(availability, setAvailability, value)}
      />

      <div className="flex gap-3 rounded-[var(--radius-lg)] border border-border bg-surface-low p-4">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-accent" />
        <div>
          <h3 className="text-[15px] font-semibold text-primary">Quality assured</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            Every consignment ships against a supplier-backed batch Certificate of Analysis. SDS and
            TDS available on request.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-[17rem_1fr]">
      <aside className="hidden h-fit lg:block">{filterPanel}</aside>

      <div>
        {/* Phones get the count on its own line and a full-width control row, so the
            filter button and the sort field never squeeze each other. */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <p className="body-sm text-muted">
            Showing {sorted.length} {sorted.length === 1 ? "product" : "products"} matching your
            criteria.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="btn btn-outline shrink-0 lg:hidden"
            >
              <SlidersHorizontal size={14} /> Filters
              {activeCount > 0 ? <span className="badge-status ml-1">{activeCount}</span> : null}
            </button>

            <label className="flex flex-1 items-center gap-2 text-[14px] text-muted sm:flex-none">
              <span className="shrink-0">Sort by:</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="input w-full min-w-0 sm:w-auto sm:min-w-[9rem]"
                aria-label="Sort products"
              >
                <option>A-Z</option>
                <option>Z-A</option>
                <option>In stock first</option>
              </select>
            </label>
          </div>
        </div>

        {paginated.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {paginated.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="panel mt-6 p-6 text-center sm:p-10">
            <h3>No chemicals match your criteria</h3>
            <p className="mx-auto mt-2 max-w-md text-[15px] text-muted">
              Try loosening the filters, or send us the chemical name or CAS number — we source well
              beyond the published {categoryName.toLowerCase()} list.
            </p>
            <button type="button" onClick={clearAll} className="btn btn-outline mt-6">
              Reset filters
            </button>
          </div>
        )}

        {totalPages > 1 ? (
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
            <button
              type="button"
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
              aria-label="Previous page"
              className="grid h-11 w-11 place-items-center rounded-[var(--radius-lg)] border border-border bg-surface-lowest text-muted disabled:pointer-events-none disabled:opacity-40"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              const isCurrent = pageNumber === current;
              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`grid h-11 w-11 place-items-center rounded-[var(--radius-lg)] border text-[14px] font-semibold ${
                    isCurrent
                      ? "border-primary bg-primary text-primary-fg"
                      : "border-border bg-surface-lowest text-text hover:bg-surface-low"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              type="button"
              disabled={current === totalPages}
              onClick={() => setPage(current + 1)}
              aria-label="Next page"
              className="grid h-11 w-11 place-items-center rounded-[var(--radius-lg)] border border-border bg-surface-lowest text-muted disabled:pointer-events-none disabled:opacity-40"
            >
              ›
            </button>
          </nav>
        ) : null}
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-scrim"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative h-full w-full max-w-md overflow-y-auto border-l border-border bg-surface-lowest p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-[20px] font-semibold text-primary">Filters</h2>
              <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            {filterPanel}
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="btn btn-primary mt-6 w-full"
            >
              Show {sorted.length} products
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
