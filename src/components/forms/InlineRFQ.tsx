import type { Chemical } from "@/data/products";
import { whatsappUrl } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { RFQForm } from "@/components/forms/RFQForm";

export function InlineRFQ({ product }: { product: Chemical }) {
  return (
    <aside className="order-4 h-fit min-w-0 lg:order-none lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-28">
      {/* Wholesale RFQ card — matches reference sticky sidebar */}
      <div className="panel overflow-hidden shadow-[var(--shadow-md)]">
        <div
          className="border-b border-border px-4 py-4 sm:px-6"
          style={{ background: "var(--color-surface-low)" }}
        >
          <h3 className="text-lg font-semibold text-primary">Wholesale RFQ</h3>
          <p className="body-sm mt-0.5 text-muted">Pre-filled for {product.name}.</p>
        </div>
        <div className="p-4 sm:p-6">
          <RFQForm
            compact
            defaults={{
              chemicalName: product.name,
              chemicalCategory: product.category,
              application: product.industry.join(", "),
            }}
          />
          <a
            className="btn btn-outline mt-4 w-full"
            href={whatsappUrl(
              `Hi, I am interested in ${product.name}. Please share your best wholesale price.`
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} /> Instant WhatsApp Inquiry
          </a>
        </div>
      </div>
    </aside>
  );
}
