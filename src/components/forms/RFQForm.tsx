"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  rfqSchema,
  type RFQInput,
  INCOTERMS,
  CURRENCIES,
  QUANTITY_UNITS,
  PACKAGING_OPTIONS,
  INDUSTRY_CATEGORIES
} from "@/lib/schemas";
import { categories } from "@/data/categories";
import { company } from "@/data/company";
import { track } from "@/lib/analytics";

const MAX_FILE_BYTES = 4 * 1024 * 1024;

async function fileToAttachment(file: File) {
  const buffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let index = 0; index < bytes.byteLength; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return {
    filename: file.name,
    contentType: file.type || "application/octet-stream",
    content: btoa(binary)
  };
}

export function RFQForm({ compact = false, defaults }: { compact?: boolean; defaults?: Partial<RFQInput> }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fileError, setFileError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const initial = { ...defaults, currency: "USD", quantityUnit: "Metric Tons" } as Partial<RFQInput>;
  const form = useForm<RFQInput>({ resolver: zodResolver(rfqSchema), defaultValues: initial });

  async function onSubmit(values: RFQInput) {
    setStatus("idle");
    setMessage("");

    try {
      const attachment = file ? await fileToAttachment(file) : undefined;

      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, attachment })
      });

      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus("success");
        setMessage(payload.message ?? "Thank you. Our team will respond within one working day.");
        track("rfq_submitted", {
          category: values.chemicalCategory,
          chemical: values.chemicalName,
          country: values.country,
          hasAttachment: Boolean(attachment)
        });
        form.reset(initial);
        setFile(null);
        return;
      }

      setStatus("error");
      setMessage(
        payload.error ??
          `Something went wrong. Please call ${company.phones[0].label} or message us on WhatsApp.`
      );
      track("rfq_failed", { status: response.status });
    } catch {
      setStatus("error");
      setMessage(
        `We could not reach the server. Please call ${company.phones[0].label} or message us on WhatsApp.`
      );
      track("rfq_failed", { status: 0 });
    }
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setFileError("");

    if (selected && selected.size > MAX_FILE_BYTES) {
      setFileError("File is larger than 4 MB. Please email it to us instead.");
      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selected);
  }

  const firstError = Object.values(form.formState.errors)[0]?.message;

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" {...form.register("website")} />
        </label>
      </div>

      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        <label className="label">
          Full Name
          <input className="input" autoComplete="name" {...form.register("fullName")} />
        </label>
        <label className="label">
          Company Name
          <input className="input" autoComplete="organization" {...form.register("companyName")} />
        </label>
        <label className="label">
          Email
          <input className="input" type="email" autoComplete="email" {...form.register("email")} />
        </label>
        <label className="label">
          Phone / WhatsApp
          <input className="input" type="tel" autoComplete="tel" {...form.register("phone")} />
        </label>

        {!compact ? (
          <>
            <label className="label">
              Country
              <input className="input" autoComplete="country-name" {...form.register("country")} />
            </label>
            <label className="label">
              GSTIN <span className="font-normal text-muted">(optional, recommended)</span>
              <input
                className="input data"
                placeholder="27AATFV1194R1Z0"
                {...form.register("buyerGstin")}
              />
            </label>
            <label className="label md:col-span-2">
              Industry Category
              <select className="input" {...form.register("industryCategory")}>
                <option value="">Select industry</option>
                {INDUSTRY_CATEGORIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <label className="label">
            Country
            <input className="input" autoComplete="country-name" {...form.register("country")} />
          </label>
        )}

        <label className="label">
          Chemical Category
          <select className="input" {...form.register("chemicalCategory")}>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="label">
          Chemical Name / CAS Number
          <input className="input" placeholder="Acetone or 67-64-1" {...form.register("chemicalName")} />
        </label>

        <label className="label">
          Required Volume
          <input className="input" placeholder="Example: 20" {...form.register("requiredQuantity")} />
        </label>
        <label className="label">
          Unit
          <select className="input" {...form.register("quantityUnit")}>
            {QUANTITY_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label>

        {!compact ? (
          <>
            <label className="label">
              Packaging Requirement
              <select className="input" {...form.register("packagingType")}>
                <option value="">Select packaging</option>
                {PACKAGING_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="label">
              Target Delivery Timeline
              <select className="input" {...form.register("deliveryTime")}>
                <option value="">Select timeline</option>
                <option>Immediate</option>
                <option>Within 1 week</option>
                <option>Within 1 month</option>
                <option>Planning ahead</option>
              </select>
            </label>
            <label className="label">
              Quote Currency
              <select className="input" {...form.register("currency")}>
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </label>
            <label className="label">
              Incoterm
              <select className="input" {...form.register("incoterm")}>
                <option value="">Select Incoterm</option>
                {INCOTERMS.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </label>
            <label className="label md:col-span-2">
              Delivery Destination
              <input
                className="input"
                placeholder="Example: Hamburg, Germany or Ahmedabad, Gujarat"
                {...form.register("deliveryPort")}
              />
            </label>
          </>
        ) : null}
      </div>

      <label className="label">
        Application / Purpose
        <textarea className="input min-h-24" {...form.register("application")} />
      </label>

      {!compact ? (
        <label className="label">
          Purchase Order or Specification Sheet{" "}
          <span className="font-normal text-muted">(optional, max 4 MB)</span>
          <input
            className="input"
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
            onChange={onFileChange}
          />
          {file ? <span className="text-xs font-semibold text-accent">Attached: {file.name}</span> : null}
          {fileError ? <span className="text-xs font-semibold text-error">{fileError}</span> : null}
        </label>
      ) : null}

      <label className="flex items-start gap-2 text-sm text-muted">
        <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-primary)]" {...form.register("terms")} />
        <span>
          I agree that {company.legalName} may contact me about this requirement and store these
          details for that purpose.
        </span>
      </label>

      {firstError ? (
        <p role="alert" className="form-error">
          {firstError}
        </p>
      ) : null}
      {status !== "idle" && message ? (
        <p role="status" className={status === "success" ? "form-success" : "form-error"}>
          {message}
        </p>
      ) : null}

      <button className="btn btn-rfq btn-submit" type="submit" disabled={form.formState.isSubmitting}>
        <Send size={18} />
        {form.formState.isSubmitting ? "Submitting..." : compact ? "Submit RFQ" : "Submit Chemical RFQ"}
      </button>

      <p className="text-center text-xs text-muted">Response within one working day.</p>
    </form>
  );
}
