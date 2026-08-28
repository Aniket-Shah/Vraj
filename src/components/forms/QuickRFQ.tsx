"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { quickRfqSchema, type QuickRFQInput, QUANTITY_UNITS } from "@/lib/schemas";
import { company } from "@/data/company";
import { track } from "@/lib/analytics";

/** The three-field hero capture from the approved screens. */
export function QuickRFQ() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const form = useForm<QuickRFQInput>({
    resolver: zodResolver(quickRfqSchema),
    defaultValues: { quantityUnit: "Metric Tons" }
  });

  async function onSubmit(values: QuickRFQInput) {
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus("success");
        setMessage(payload.message ?? "Thank you. Our team will respond within one working day.");
        track("rfq_submitted", { chemical: values.chemicalName, source: "quick_rfq" });
        form.reset({ quantityUnit: "Metric Tons" });
        return;
      }

      setStatus("error");
      setMessage(payload.error ?? `Something went wrong. Please call ${company.phones[0].label}.`);
      track("rfq_failed", { status: response.status, source: "quick_rfq" });
    } catch {
      setStatus("error");
      setMessage(`We could not reach the server. Please call ${company.phones[0].label}.`);
      track("rfq_failed", { status: 0, source: "quick_rfq" });
    }
  }

  const firstError = Object.values(form.formState.errors)[0]?.message;

  return (
    <div className="panel p-5 sm:p-6">
      <h3 className="mb-2">Quick RFQ Request</h3>
      <p className="body-sm mb-6 text-muted">Submit your bulk requirement for an expedited quote.</p>

      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" {...form.register("website")} />
          </label>
        </div>

        <div>
          <label className="label" htmlFor="quick-chemical">
            Chemical Name / CAS Number
          </label>
          <input
            id="quick-chemical"
            className="input"
            placeholder="e.g. Isopropyl Alcohol / 67-63-0"
            {...form.register("chemicalName")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="quick-qty">
              Quantity
            </label>
            <input id="quick-qty" className="input" placeholder="Qty" {...form.register("requiredQuantity")} />
          </div>
          <div>
            <label className="label" htmlFor="quick-unit">
              Unit
            </label>
            <select id="quick-unit" className="input" {...form.register("quantityUnit")}>
              {QUANTITY_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="quick-email">
            Email Address
          </label>
          <input
            id="quick-email"
            className="input"
            type="email"
            placeholder="procurement@company.com"
            {...form.register("email")}
          />
        </div>

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

        <button className="btn btn-rfq btn-submit mt-2" type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting…" : "Submit Request"}
        </button>

        <p className="text-center text-[12px] leading-4 text-muted">
          We reply within one working day. By submitting you agree {company.legalName} may contact
          you about this requirement.
        </p>
      </form>
    </div>
  );
}
