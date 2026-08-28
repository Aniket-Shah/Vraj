"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { track } from "@/lib/analytics";

/**
 * Routes to the catalogue with the query applied. Kept as a real navigation so a search
 * result is a shareable, indexable URL rather than transient client state.
 */
export function ChemicalSearch({ defaultValue = "" }: { defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    track("catalogue_search", { query: trimmed });
    router.push(`/chemicals?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={onSubmit} role="search" className="relative w-full">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
        <Search size={18} />
      </span>
      <label htmlFor="chemical-search" className="sr-only">
        Search the chemical catalogue
      </label>
      <input
        id="chemical-search"
        type="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by Chemical Name, CAS Number, or Industry Application..."
        className="input input-search"
      />
    </form>
  );
}
