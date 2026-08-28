"use client";

import { LayoutGrid, MessageSquare } from "lucide-react";
import Link from "next/link";
import { company } from "@/data/company";
import { track } from "@/lib/analytics";

/**
 * Desktop gets the single WhatsApp action from the approved screens. Mobile gets a
 * sticky conversion bar, since the header RFQ button scrolls out of reach there.
 */
export function FloatingContactBar() {
  const whatsapp = `https://wa.me/${company.whatsappNumber}`;

  return (
    <>
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp us"
        onClick={() => track("whatsapp_click", { source: "floating" })}
        className="fixed bottom-6 right-6 z-40 hidden h-12 w-12 place-items-center rounded-[var(--radius-xl)] bg-accent text-accent-fg shadow-[var(--shadow-md)] transition-transform hover:scale-105 lg:grid"
      >
        <MessageSquare size={22} />
      </a>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface-lowest p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-2px_12px_rgba(15,44,89,0.08)] lg:hidden">
        <div className="flex items-center gap-2">
          <Link
            href="/chemicals"
            aria-label="Browse the chemical catalogue"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius)] border border-border text-primary"
          >
            <LayoutGrid size={18} />
          </Link>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp us"
            onClick={() => track("whatsapp_click", { source: "mobile_bar" })}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius)] bg-accent text-accent-fg"
          >
            <MessageSquare size={18} />
          </a>
          <Link href="/request-quote" className="btn btn-rfq flex-1">
            Request a Quote
          </Link>
        </div>
      </div>

      {/* Clears the mobile sticky bar so it never covers page content. */}
      <div className="h-[calc(4.25rem+env(safe-area-inset-bottom))] lg:hidden" aria-hidden="true" />
    </>
  );
}
