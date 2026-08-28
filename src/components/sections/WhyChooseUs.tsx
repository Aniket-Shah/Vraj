import { BadgeCheck, Globe2, Headphones, PackageCheck, WalletCards } from "lucide-react";

const reasons = [
  ["Quality assured", "Supplier-backed products with documentation support.", BadgeCheck],
  ["Global delivery", "Imported and Indian sourcing for bulk requirements.", Globe2],
  ["Competitive pricing", "Commercially sharp quotes for repeat B2B buyers.", WalletCards],
  ["Technical support", "Application-aware guidance before and after enquiry.", Headphones],
  ["Bulk supply", "Drums, bags, carboys and custom sourcing support.", PackageCheck]
] as const;

export function WhyChooseUs() {
  return (
    <ul className="grid gap-3">
      {reasons.map(([title, text, Icon]) => (
        <li key={title} className="panel flex gap-3 p-4">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius)] bg-surface-mid text-primary"
            aria-hidden="true"
          >
            <Icon size={18} />
          </span>
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-base font-semibold">{title}</h3>
            <p className="mt-0.5 text-sm text-muted">{text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
