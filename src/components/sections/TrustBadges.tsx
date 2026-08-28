import { Building2, Globe, ReceiptText, Truck, Verified } from "lucide-react";
import { company } from "@/data/company";

const pillars = [
  {
    icon: ReceiptText,
    tone: "text-accent",
    label: `E-Invoice Enabled (GST Rating: ${company.statutory.gstComplianceScore})`
  },
  { icon: Globe, tone: "text-primary-container", label: "Global Sourcing" },
  { icon: Verified, tone: "text-primary-container", label: "Quality Assured (COA/TDS)" },
  { icon: Truck, tone: "text-gold", label: "Bulk Logistics (Bags/Drums/IBC)" },
  { icon: Building2, tone: "text-primary-container", label: "Mumbai Advantage" }
];

export function TrustBadges() {
  return (
    <div className="overflow-x-auto border-b border-border bg-surface scrollbar-none" aria-label="What we provide">
      <div className="container flex min-w-max items-center justify-between gap-8 py-4">
        {pillars.map(({ icon: Icon, tone, label }) => (
          <div key={label} className="flex items-center gap-2 text-muted">
            <Icon size={18} className={`shrink-0 ${tone}`} />
            <span className="label-caps">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
