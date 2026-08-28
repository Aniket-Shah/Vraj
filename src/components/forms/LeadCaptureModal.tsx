"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { company } from "@/data/company";
import { track } from "@/lib/analytics";
import { leadCaptureSchema, type LeadCaptureInput } from "@/lib/schemas";

/**
 * Last-chance lead capture.
 *
 * Two triggers, matching how the two device classes actually abandon a page:
 *   · pointer devices — the cursor leaves through the top of the viewport, the
 *     established signal for "closing the tab or reaching for the address bar";
 *   · every device, phones especially — three minutes parked on the same section,
 *     which on a catalogue means the buyer found something and stalled.
 *
 * It asks for two fields. Anything longer gets dismissed, and the acknowledgement
 * email opens the real conversation anyway.
 */

/** Three minutes, tunable without a code change (and shortened in tests). */
const DWELL_MS = Number(process.env.NEXT_PUBLIC_LEAD_CAPTURE_DWELL_MS ?? "") || 3 * 60 * 1000;
/** A buyer mid-sentence in another form is not abandoning anything. */
const BUSY_RETRY_MS = 30 * 1000;
const SEEN_KEY = "vraj:capture:seen";
const SUPPRESS_KEY = "vraj:capture:suppressed-until";
const DISMISS_DAYS = 7;
const CONVERTED_DAYS = 90;

/** Pages that are already a form do not need a form thrown over them. */
const EXCLUDED = ["/request-quote", "/contact"];

function suppressedUntil() {
  try {
    return Number(window.localStorage.getItem(SUPPRESS_KEY) ?? 0);
  } catch {
    return 0;
  }
}

function suppressFor(days: number) {
  try {
    window.localStorage.setItem(SUPPRESS_KEY, String(Date.now() + days * 24 * 60 * 60 * 1000));
  } catch {
    /* Private mode. The session flag still stops a second prompt on this visit. */
  }
}

/** Which block of the page the viewport is centred on. */
function currentSection() {
  const sections = Array.from(document.querySelectorAll("main section, main > div > section"));
  const middle = window.scrollY + window.innerHeight / 2;
  const index = sections.findIndex((element) => {
    const box = element.getBoundingClientRect();
    const top = box.top + window.scrollY;
    return middle >= top && middle < top + box.height;
  });
  // No section under the midpoint (short pages, footers) still needs a stable key.
  return index === -1 ? `scroll:${Math.floor(window.scrollY / window.innerHeight)}` : `section:${index}`;
}

function isTyping() {
  const active = document.activeElement;
  if (!active) return false;
  const tag = active.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select";
}

export function LeadCaptureModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const armedRef = useRef(true);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<LeadCaptureInput>({
    resolver: zodResolver(leadCaptureSchema),
    defaultValues: { chemicalName: "", email: "", phone: "" }
  });

  const reveal = useCallback((trigger: "exit_intent" | "dwell") => {
    if (!armedRef.current) return;
    if (isTyping()) return;
    armedRef.current = false;
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignored */
    }
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
    track("lead_capture_shown", { trigger, path: window.location.pathname });
  }, []);

  const close = useCallback(
    (reason: "dismissed" | "converted") => {
      setOpen(false);
      suppressFor(reason === "converted" ? CONVERTED_DAYS : DISMISS_DAYS);
      if (reason === "dismissed") track("lead_capture_dismissed", {});
      restoreFocusRef.current?.focus?.();
    },
    []
  );

  // Arm the triggers. Re-runs per route so an excluded page disarms cleanly.
  useEffect(() => {
    if (EXCLUDED.includes(pathname)) return;

    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* ignored */
    }
    if (seen || suppressedUntil() > Date.now()) {
      armedRef.current = false;
      return;
    }

    let dwellTimer: ReturnType<typeof setTimeout> | undefined;
    let sectionKey = currentSection();
    let frame = 0;

    function startDwell() {
      clearTimeout(dwellTimer);
      dwellTimer = setTimeout(function fire() {
        if (!armedRef.current) return;
        // Do not interrupt someone filling in another form; look again shortly.
        if (isTyping()) {
          dwellTimer = setTimeout(fire, BUSY_RETRY_MS);
          return;
        }
        reveal("dwell");
      }, DWELL_MS);
    }

    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const next = currentSection();
        if (next !== sectionKey) {
          sectionKey = next;
          startDwell();
        }
      });
    }

    function onVisibility() {
      if (document.hidden) clearTimeout(dwellTimer);
      else startDwell();
    }

    // Exit intent is a pointer gesture; a touch device has no cursor to lose.
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    function onMouseOut(event: MouseEvent) {
      if (event.relatedTarget || event.clientY > 0) return;
      reveal("exit_intent");
    }

    startDwell();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (finePointer) document.addEventListener("mouseout", onMouseOut);

    return () => {
      clearTimeout(dwellTimer);
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [pathname, reveal]);

  // Escape, focus and scroll handling while the dialog is up.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close("dismissed");
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    firstFieldRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  async function onSubmit(values: LeadCaptureInput) {
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source: "lead_capture" })
      });
      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus("success");
        setMessage(payload.message ?? "Thank you. Our team will respond within one working day.");
        track("rfq_submitted", { chemical: values.chemicalName, source: "lead_capture" });
        suppressFor(CONVERTED_DAYS);
        return;
      }

      setStatus("error");
      setMessage(payload.error ?? `Something went wrong. Please call ${company.phones[0].label}.`);
      track("rfq_failed", { status: response.status, source: "lead_capture" });
    } catch {
      setStatus("error");
      setMessage(`We could not reach the server. Please call ${company.phones[0].label}.`);
      track("rfq_failed", { status: 0, source: "lead_capture" });
    }
  }

  if (!open) return null;

  const firstError = Object.values(form.formState.errors)[0]?.message;
  const { ref: chemicalRef, ...chemicalField } = form.register("chemicalName");

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        className="absolute inset-0 bg-scrim"
        onClick={() => close("dismissed")}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="capture-title"
        className="relative w-full max-w-md rounded-t-[var(--radius-xl)] border border-border bg-surface-lowest p-5 shadow-[var(--shadow-md)] sm:rounded-[var(--radius-xl)] sm:p-6"
      >
        <button
          type="button"
          onClick={() => close("dismissed")}
          aria-label="Close"
          className="absolute right-2 top-2 grid h-11 w-11 place-items-center text-muted transition-colors hover:text-primary"
        >
          <X size={18} />
        </button>

        {status === "success" ? (
          <div className="py-4 text-center">
            <h2 id="capture-title" className="text-[22px] leading-7">
              Thank you
            </h2>
            <p role="status" className="body-sm mt-3 text-muted">
              {message}
            </p>
            <button type="button" onClick={() => close("converted")} className="btn btn-outline mt-6">
              Continue browsing
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow">Before you go</p>
            <h2 id="capture-title" className="mt-1 pr-10 text-[22px] leading-7">
              Send us the requirement and we will quote it
            </h2>
            <p className="body-sm mt-2 text-muted">
              Two fields. We reply within one working day with price, packing and availability.
            </p>

            <form className="mt-5 flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
                <label>
                  Website
                  <input tabIndex={-1} autoComplete="off" {...form.register("website")} />
                </label>
              </div>

              <div>
                <label className="label" htmlFor="capture-chemical">
                  Chemical name or CAS number
                </label>
                <input
                  id="capture-chemical"
                  className="input"
                  placeholder="e.g. Isopropyl Alcohol / 67-63-0"
                  ref={(element) => {
                    chemicalRef(element);
                    firstFieldRef.current = element;
                  }}
                  {...chemicalField}
                />
              </div>

              <div>
                <label className="label" htmlFor="capture-email">
                  Email address
                </label>
                <input
                  id="capture-email"
                  className="input"
                  type="email"
                  placeholder="procurement@company.com"
                  {...form.register("email")}
                />
              </div>

              <div>
                <label className="label" htmlFor="capture-phone">
                  Phone or WhatsApp <span className="text-outline">(optional if email given)</span>
                </label>
                <input
                  id="capture-phone"
                  className="input"
                  type="tel"
                  placeholder="+91 99308 76815"
                  {...form.register("phone")}
                />
              </div>

              {firstError ? (
                <p role="alert" className="form-error">
                  {firstError}
                </p>
              ) : null}
              {status === "error" && message ? (
                <p role="alert" className="form-error">
                  {message}
                </p>
              ) : null}

              <button className="btn btn-rfq w-full" type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Sending…" : "Send my requirement"}
              </button>

              <p className="text-center text-[12px] leading-4 text-muted">
                By submitting you agree {company.legalName} may contact you about this requirement.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
