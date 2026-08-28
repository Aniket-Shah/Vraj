"use client";

import { useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rfqSchema, type RFQInput, PACKAGING_OPTIONS, INCOTERMS, CURRENCIES, QUANTITY_UNITS, INDUSTRY_CATEGORIES } from "@/lib/schemas";
import { company } from "@/data/company";
import { track } from "@/lib/analytics";
import { Send, Upload, X, FileText } from "lucide-react";
import Link from "next/link";

function encodeFile(file: File): Promise<{ filename: string; contentType: string; content: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve({ filename: file.name, contentType: file.type, content: base64 });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const MAX_BYTES = 4 * 1024 * 1024;
const ACCEPTED = ".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg";

export function B2BRFQForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<RFQInput>({
    resolver: zodResolver(rfqSchema),
    defaultValues: { quantityUnit: "Metric Tons", currency: "USD" },
  });

  const handleFile = (selected: File | null) => {
    if (!selected) return;
    if (selected.size > MAX_BYTES) {
      setFileError("File exceeds 4 MB limit.");
      setFile(null);
      return;
    }
    setFileError("");
    setFile(selected);
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, []);

  async function onSubmit(values: RFQInput) {
    setStatus("idle");
    setMessage("");
    let attachment: RFQInput["attachment"] = undefined;
    if (file) {
      try {
        attachment = await encodeFile(file);
      } catch {
        setStatus("error");
        setMessage("Could not read the attached file. Please try again.");
        return;
      }
    }
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, attachment }),
      });
      const payload = await response.json().catch(() => ({}));
      if (response.ok) {
        setStatus("success");
        setMessage(payload.message ?? "Thank you. Our team will respond within one working day.");
        track("rfq_submitted", { chemical: values.chemicalName, source: "b2b_rfq" });
        form.reset({ quantityUnit: "Metric Tons", currency: "USD" });
        setFile(null);
        return;
      }
      setStatus("error");
      setMessage(payload.error ?? `Something went wrong. Please call ${company.phones[0].label}.`);
    } catch {
      setStatus("error");
      setMessage(`We could not reach the server. Please call ${company.phones[0].label}.`);
    }
  }

  const firstError = Object.values(form.formState.errors)[0]?.message;

  return (
    <form className="grid gap-8" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label>Website<input tabIndex={-1} autoComplete="off" {...form.register("website")} /></label>
      </div>

      {/* ── Section 1: Company Details ── */}
      <div className="panel p-6 md:p-8">
        <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-3 text-xl font-semibold text-primary">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-[13px] font-bold text-primary-fg">1</span>
          Company Details
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="label sm:col-span-2">
            Company / Organization Name *
            <input className="input" autoComplete="organization" placeholder="Acme Chemicals Pvt Ltd" {...form.register("companyName")} />
          </label>
          <label className="label">
            Authorized Contact Name *
            <input className="input" autoComplete="name" placeholder="Ramesh Kumar" {...form.register("fullName")} />
          </label>
          <label className="label">
            Corporate Email *
            <input className="input" type="email" autoComplete="email" placeholder="procurement@company.com" {...form.register("email")} />
          </label>
          <label className="label">
            Phone / WhatsApp *
            <input className="input" type="tel" autoComplete="tel" placeholder="+91 98765 43210" {...form.register("phone")} />
          </label>
          <label className="label">
            Country *
            <input className="input" autoComplete="country-name" placeholder="India" {...form.register("country")} />
          </label>
          <label className="label">
            GSTIN <span className="font-normal text-muted">(optional)</span>
            <input className="input data" placeholder="27AATFV1194R1Z0" {...form.register("buyerGstin")} />
          </label>
          <label className="label">
            Business / Industry Type
            <select className="input" {...form.register("industryCategory")}>
              <option value="">Select industry</option>
              {INDUSTRY_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </label>
        </div>
      </div>

      {/* ── Section 2: Compliance & Commercial ── */}
      <div className="panel p-6 md:p-8">
        <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-3 text-xl font-semibold text-primary">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-[13px] font-bold text-primary-fg">2</span>
          Compliance &amp; Commercial Terms
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="label">
            Preferred Incoterm
            <select className="input" {...form.register("incoterm")}>
              <option value="">Select Incoterm</option>
              {INCOTERMS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="label">
            Quote Currency
            <select className="input" {...form.register("currency")}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="label">
            Target Delivery Date
            <input className="input" type="date" {...form.register("deliveryTime")} />
          </label>
          <label className="label">
            Delivery Destination
            <input className="input" placeholder="e.g. Nhava Sheva, Mumbai" {...form.register("deliveryPort")} />
          </label>
        </div>
      </div>

      {/* ── Section 3: Order Requirements ── */}
      <div className="panel p-6 md:p-8">
        <h2 className="mb-6 flex items-center gap-2 border-b border-border pb-3 text-xl font-semibold text-primary">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-[13px] font-bold text-primary-fg">3</span>
          Order Requirements
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="label">
            Chemical Category *
            <select className="input" {...form.register("chemicalCategory")}>
              <option value="">Select category</option>
              <option value="solvents">Industrial Solvents</option>
              <option value="acids">Acids</option>
              <option value="industrial">Industrial Chemicals</option>
              <option value="specialty">Fine &amp; Specialty Chemicals</option>
              <option value="pigments">Pigments &amp; Dyes</option>
              <option value="additives">Additives</option>
              <option value="cleaning">Cleaning Chemicals</option>
            </select>
          </label>
          <label className="label">
            Chemical Name / CAS Number *
            <input className="input" placeholder="e.g. Acetone / 67-64-1" {...form.register("chemicalName")} />
          </label>
          <label className="label">
            Required Volume *
            <input className="input text-right data" type="text" placeholder="e.g. 10000" {...form.register("requiredQuantity")} />
          </label>
          <label className="label">
            Packaging Requirement
            <select className="input" {...form.register("packagingType")}>
              <option value="">Select</option>
              {PACKAGING_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </label>
          <label className="label sm:col-span-2">
            Application / Purpose *
            <textarea className="input min-h-20" placeholder="Describe the intended use…" {...form.register("application")} />
          </label>
        </div>

        {/* ── File upload drag-and-drop zone ── */}
        <div className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-primary">
            <Upload size={18} className="text-accent" />
            Supporting Documents <span className="font-normal text-muted text-sm">(optional)</span>
          </h3>
          <div
            onDragEnter={() => setDragging(true)}
            onDragLeave={() => setDragging(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              dragging
                ? "border-primary bg-surface-low"
                : "border-border bg-surface-low hover:border-primary hover:bg-surface-mid"
            }`}
          >
            {file ? (
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-primary" />
                <span className="text-sm font-semibold text-primary">{file.name}</span>
                <button
                  type="button"
                  aria-label="Remove file"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="rounded p-0.5 text-muted hover:text-error"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={32} className="text-muted" />
                <p className="text-sm text-muted">
                  Drag and drop your Purchase Order (PO) or requirement list here
                </p>
                <p className="text-xs text-outline">Supported: PDF, DOCX, XLSX — Max 4 MB</p>
                <span className="rounded border border-border bg-surface-lowest px-4 py-2 text-[12px] font-bold uppercase tracking-[0.05em] text-primary hover:bg-surface-low">
                  Browse Files
                </span>
              </>
            )}
          </div>
          {fileError ? <p className="mt-2 text-xs text-error">{fileError}</p> : null}
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* Consent + submit */}
        <div className="mt-6">
          <label className="flex items-start gap-2 text-sm text-muted">
            <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-primary)]" {...form.register("terms")} />
            <span>
              I confirm that {company.legalName} may contact me about this requirement and store these details for that purpose.
            </span>
          </label>

          {firstError ? <p role="alert" className="form-error mt-3">{firstError}</p> : null}
          {status !== "idle" && message ? (
            <p role="status" className={`mt-3 ${status === "success" ? "form-success" : "form-error"}`}>{message}</p>
          ) : null}

          <button
            className="btn btn-rfq btn-submit mt-5 w-full py-4 text-base"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            <Send size={18} />
            {form.formState.isSubmitting ? "Submitting…" : "Submit Bulk RFQ"}
          </button>
          <p className="mt-3 text-center text-xs text-muted">Response within one working day.</p>
        </div>
      </div>
    </form>
  );
}
