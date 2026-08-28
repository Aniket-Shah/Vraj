/**
 * Provider-agnostic conversion tracking.
 *
 * No-ops until a provider is present on the page, so nothing here depends on a vendor
 * choice being made first. Whichever of GTM, Plausible or Umami is installed picks the
 * events up; if none is, calls are silently discarded.
 *
 * Events worth reporting on: which chemical pages produce enquiries, which countries
 * buyers come from, and where the quote form is abandoned.
 */

type EventName =
  | "rfq_submitted"
  | "rfq_failed"
  | "contact_submitted"
  | "contact_failed"
  | "whatsapp_click"
  | "phone_click"
  | "catalogue_search"
  | "datasheet_request"
  | "lead_capture_shown"
  | "lead_capture_dismissed";

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    plausible?: (event: string, options?: { props: Props }) => void;
    umami?: { track: (event: string, data?: Props) => void };
  }
}

export function track(event: EventName, props: Props = {}) {
  if (typeof window === "undefined") return;

  try {
    window.dataLayer?.push({ event, ...props });
    window.plausible?.(event, { props });
    window.umami?.track(event, props);
  } catch {
    // Analytics must never break a form submission.
  }
}
