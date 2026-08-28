import type { CategorySlug } from "@/data/products";

const hazardMap: Partial<Record<CategorySlug, { label: string; bg: string; text: string; dot: string }>> = {
  solvents:  { label: "Flammable Liquid",  bg: "#fce8e6", text: "#c5221f", dot: "#c5221f" },
  acids:     { label: "Corrosive Liquid",  bg: "#fff4e5", text: "#9c4700", dot: "#f57c00" },
  industrial:{ label: "Irritant",          bg: "#e8f5e9", text: "#1b5e20", dot: "#2e7d32" },
  specialty: { label: "Handle with Care",  bg: "#e8eaf6", text: "#1a237e", dot: "#3949ab" },
  pigments:  { label: "Sensitiser",        bg: "#fff8e1", text: "#f57f17", dot: "#f9a825" },
  additives: { label: "Handle with Care",  bg: "#e8eaf6", text: "#1a237e", dot: "#3949ab" },
  cleaning:  { label: "Irritant",          bg: "#e8f5e9", text: "#1b5e20", dot: "#2e7d32" },
};

export function HazardBadge({ category }: { category: CategorySlug }) {
  const hazard = hazardMap[category];
  if (!hazard) return null;
  return (
    <span
      className="flex items-center gap-1.5 rounded border px-2 py-1 text-[11px] font-bold leading-none shadow-sm"
      style={{
        backgroundColor: hazard.bg,
        color: hazard.text,
        borderColor: `${hazard.dot}33`,
      }}
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: hazard.dot }}
        aria-hidden="true"
      />
      {hazard.label}
    </span>
  );
}
