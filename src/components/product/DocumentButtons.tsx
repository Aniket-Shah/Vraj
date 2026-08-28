"use client";

import { FileText, FlaskConical, ClipboardCheck } from "lucide-react";
import { useState } from "react";

interface Props {
  productName: string;
}

export function DocumentButtons({ productName }: Props) {
  const [requested, setRequested] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-border bg-surface-lowest py-2.5 text-[12px] font-bold uppercase tracking-[0.05em] text-primary transition-colors hover:border-primary"
      >
        <FileText size={16} />
        Download SDS
      </button>
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-border bg-surface-lowest py-2.5 text-[12px] font-bold uppercase tracking-[0.05em] text-primary transition-colors hover:border-primary"
      >
        <FlaskConical size={16} />
        Download TDS
      </button>
      <button
        type="button"
        onClick={() => setRequested(true)}
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-border bg-surface-mid py-2.5 text-[12px] font-bold uppercase tracking-[0.05em] text-text transition-colors hover:bg-surface-high"
      >
        <ClipboardCheck size={16} />
        {requested ? "COA Requested ✓" : "Request COA"}
      </button>
      <p className="text-center text-[11px] text-muted">
        Documents for: {productName}
      </p>
    </div>
  );
}
