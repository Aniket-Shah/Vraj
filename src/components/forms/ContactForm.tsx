"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { contactSchema, type ContactInput } from "@/lib/schemas";
import { company } from "@/data/company";
import { track } from "@/lib/analytics";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const form = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactInput) {
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus("success");
        setMessage(payload.message ?? "Thank you. Our team will respond within one working day.");
        track("contact_submitted", { subject: values.subject });
        form.reset();
        return;
      }

      setStatus("error");
      setMessage(
        payload.error ??
          `Something went wrong. Please call ${company.phones[0].label} or message us on WhatsApp.`
      );
      track("contact_failed", { status: response.status });
    } catch {
      setStatus("error");
      setMessage(
        `We could not reach the server. Please call ${company.phones[0].label} or message us on WhatsApp.`
      );
      track("contact_failed", { status: 0 });
    }
  }

  const firstError = Object.values(form.formState.errors)[0]?.message;

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" {...form.register("website")} />
        </label>
      </div>

      <label className="label">Full Name / Organization<input className="input" autoComplete="name" placeholder="Ramesh Kumar / Acme Chemicals" {...form.register("fullName")} /></label>
      <label className="label">Corporate Email Address<input className="input" type="email" autoComplete="email" placeholder="procurement@company.com" {...form.register("email")} /></label>
      <label className="label">Phone Number<input className="input" type="tel" autoComplete="tel" placeholder="+91 98765 43210" {...form.register("phone")} /></label>
      <label className="label">
        Inquiry Type
        <select className="input" {...form.register("subject")}>
          <option value="">Select inquiry type</option>
          <option>Request for Quotation (RFQ)</option>
          <option>Compliance &amp; Documentation</option>
          <option>Technical Support</option>
          <option>Export &amp; Logistics</option>
          <option>General Inquiry</option>
        </select>
      </label>
      <label className="label">
        Message Details <span className="font-normal text-muted">(Include CAS numbers if applicable)</span>
        <textarea className="input min-h-32" placeholder="Describe your requirement…" {...form.register("message")} />
      </label>

      <label className="flex items-start gap-2 text-sm text-muted">
        <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-accent)]" {...form.register("terms")} />
        <span>
          I agree that {company.legalName} may contact me about this enquiry and store these
          details for that purpose.
        </span>
      </label>

      {firstError ? <p role="alert" className="form-error">{firstError}</p> : null}
      {status !== "idle" && message ? (
        <p role="status" className={status === "success" ? "form-success" : "form-error"}>
          {message}
        </p>
      ) : null}

      <button className="btn btn-rfq w-full py-4" type="submit" disabled={form.formState.isSubmitting}>
        <Send size={18} /> {form.formState.isSubmitting ? "Sending..." : "Submit Inquiry"}
      </button>
    </form>
  );
}
