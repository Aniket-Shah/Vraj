# Vraj Chem Impex LLP — Condition Report & Revamp Plan

**Date:** 23 August 2026
**Scope:** Full audit of the Next.js site, plus a phased revamp toward professional presentation, global expansion and lead generation.

---

## Corporate identity correction

The site previously carried the wrong company name. It is **Vraj Chem Impex LLP**, not
"Vraj Chem Impact LLP", and the registered footprint is Mumbai, not Bhiwandi. Verified
statutory data is now the single source of truth in `src/data/company.ts` and drives
every page, the footer, the utility bar and all structured data.

| Field | Value |
| --- | --- |
| Legal name | Vraj Chem Impex LLP |
| LLPIN | AAT-2573 |
| GSTIN | 27AATFV1194R1Z0 |
| Incorporated | 07 August 2020 |
| Registrar | RoC — Mumbai I |
| Status | Active |
| GST compliance score | 883 / 1000, e-invoice enabled |
| Designated partners | Chandresh Dhirajlal Mehta · Bhargav Chandresh Mehta |
| Registered office | A 1401, Gokul Vrindavan CHS Ltd, Irani Wadi, Kandivali West, Mumbai 400067 |
| Corporate office | 610 One World, SV Road, Malad West, Mumbai 400064 |
| Email | vrajchemimpexllp@gmail.com |
| Hours | Mon–Sat, 09:00–19:00 IST |

This also resolves **VC-05** and **VC-07** differently than originally planned. The email
is now the officially registered corporate address rather than an unrelated personal
mailbox, and the unverifiable statistics are replaced by statutory facts that a buyer can
check against the public record before raising a vendor account.

**Still to confirm:** the two phone numbers carried over from the previous site are not in
the corporate filing. Verify they route to the Impex sales desk before launch.

---

## Verified baseline

Tested against a real production build served locally — not read from source.

| Check | Result |
| --- | --- |
| Production build | Passing |
| Routes prerendered | 95 |
| Products in catalogue | 76 |
| First load JS | 139 KB (target &lt;200 KB) |
| All routes return 200 | Yes |
| Unknown route 404s correctly | Yes |
| **Leads reaching a human** | **0** |

---

## The one finding that matters

A complete, realistic RFQ was submitted to the running site. The API validated it, returned
`200`, and told the buyer *"our team will connect with you within 24 hours."* The lead was
then written to standard output and dropped. No email, no database, no CRM, no notification.

On Vercel those logs are ephemeral, so an enquiry from an overseas buyer for 20 MT of acetone
is gone within minutes and nobody at Vraj Chem ever knows it existed.

```
POST /api/inquiry → 200 {"ok":true,"message":"...within 24 hours."}
server stdout     → New RFQ inquiry for Vraj Chem { fullName: 'Test Buyer', ... }
destination       → none
```

Everything else in this document is worth doing. This is the item that makes the difference
between a site that markets the business and one that actively damages it — a buyer who never
hears back does not enquire twice, and does not recommend you.

---

## Implementation status

Phases 1, 3 and 5 are built and verified. Phase 2 is built to the point where the remaining
work is a client decision, not code. Phase 4 is content production and has not started.

| ID | Status | What was done |
| --- | --- | --- |
| VC-00 | **Done** | Beaker illustration and bubble animation deleted; spec-led cards |
| VC-01 | **Done** | Real lead pipeline — persist first, then email + webhook fan-out |
| VC-02 | **Done** | File upload registered, validated, transmitted and stored |
| VC-03 | **Done** | Honeypot + 5/min IP rate limit on both endpoints |
| VC-04 | **Done** | `track()` conversion events, provider-agnostic |
| VC-05 | **Config** | Contact centralised in `company.ts`; set `NEXT_PUBLIC_SALES_EMAIL` to switch |
| VC-06 | **Done** | Single brand mark — "VC Interconnect" removed everywhere |
| VC-07 | **Done** | Stats now derived from the catalogue; unverifiable claims removed |
| VC-08 | **Done** | `/quality` and `/export` built; nav points only at pages that exist |
| VC-09 | **Partial** | Documentation-request path built; the PDFs themselves are Phase 4 |
| VC-10 | **Done** | Incoterms, currency, destination port on the RFQ; export terms on product pages |
| VC-11 | **Done** | `/privacy` and `/terms` shipped; consent now required in the schema |
| VC-12 | **Done** | Hours labelled in IST with CET and US Eastern conversions |
| VC-13 | **Done** | Unsplash and the glow render removed; dead `image` field dropped |
| VC-14 | **Done** | All 28 hardcoded hex values replaced with tokens |
| VC-15 | **Done** | `aria-expanded`, `aria-haspopup`, Escape, click-outside, skip link |
| VC-16 | **Open** | Write-back to `shapekraft-lib` still outstanding |
| VC-17 | **Done** | `background-attachment: fixed` replaced with a single fixed layer |

### The critical behaviour change

The lead endpoints no longer claim success for a lead that reached nobody. With no delivery
channel configured they return `502` and tell the buyer to phone or WhatsApp instead:

```
POST /api/inquiry  (no channel configured)
→ 502 {"error":"We could not record your request. Please call +91 99308 76815 ..."}

POST /api/inquiry  (LEAD_STORE_DIR set)
→ 200 {"ok":true,"reference":"RFQ-B6E5942D","message":"... reference is RFQ-B6E5942D ..."}
   stored: /leads.jsonl + /attachments/RFQ-B6E5942D-spec.pdf
```

**Before going live, set at least one delivery channel in `.env`** — see `.env.example`.
Until then the site correctly refuses enquiries rather than silently swallowing them.

---

## Audit register

Severity: **BLOCKER** = costs leads or credibility today · **MAJOR** = blocks global buyers ·
**MINOR** = quality debt.

### Already fixed

| ID | Finding | Severity |
| --- | --- | --- |
| VC-00 | Chemical-solution illustration and bubble animation removed | DONE |

`ChemicalIllustration.tsx` — an animated beaker of coloured solution heading every product
card, category card and product page — has been deleted. It ran a perpetual CSS bubble
animation on every card in a grid, injected a `<style>` block per instance via
`dangerouslySetInnerHTML`, and hardcoded fourteen hex colours in a tree that is supposed to
run entirely on CSS variables. It also read as a chemistry set rather than a stockist with 76
grades and real CAS numbers. Cards now lead with the specification, which is what a
procurement officer scans for.

### Lead capture

| ID | Finding | Severity |
| --- | --- | --- |
| VC-01 | Both lead endpoints discard the lead — `console.info` only, no delivery of any kind | BLOCKER |
| VC-02 | RFQ file upload is decorative — unregistered input, never transmitted | BLOCKER |
| VC-03 | No honeypot, rate limit or captcha on public endpoints | MAJOR |
| VC-04 | No analytics or conversion tracking anywhere | MAJOR |

### Credibility

| ID | Finding | Severity |
| --- | --- | --- |
| VC-05 | Personal Gmail is the company contact in footer, contact page, action bar and both schema.org blocks | BLOCKER |
| VC-06 | Two company names — nav/footer show "VC Interconnect", all metadata says "Vraj Chem Impact LLP" | MAJOR |
| VC-07 | Unverifiable statistics — 500 clients, 50 countries, 15 years, 24/7 support (contradicts Mon–Sat 9–6 hours) | MAJOR |
| VC-08 | "Certifications" nav → the quote form; "Resources" nav → the Why-Choose-Us list. Neither destination exists | MAJOR |
| VC-09 | No SDS, TDS or CoA for any of the 76 products — the strongest lead magnet in the category is absent | BLOCKER |

### Global readiness

| ID | Finding | Severity |
| --- | --- | --- |
| VC-10 | No Incoterms, HS codes, port of loading, packing detail or lead times; `priceCurrency` hardcoded to INR | BLOCKER |
| VC-11 | No privacy policy or terms page; consent checkbox declared `z.boolean().optional()` so the form submits without it | BLOCKER |
| VC-12 | Contact model assumes an Indian buyer — one WhatsApp number, IST hours with no timezone label, no locale handling | MAJOR |
| VC-13 | About page hero hotlinked from Unsplash; category records carry a dead `image` field no component renders | MINOR |

### Technical debt

| ID | Finding | Severity |
| --- | --- | --- |
| VC-14 | 28 hardcoded hex values across 10 files — Constraint 1 violations | MINOR |
| VC-15 | Nav dropdown triggers lack `aria-expanded`/`aria-haspopup` and open on hover only — unreachable by keyboard | MINOR |
| VC-16 | `NavStickyMinimal`, `FadeIn`, `FadeUp`, `NumberCounter` forked from `shapekraft-lib`; local nav has diverged with improvements | MINOR |
| VC-17 | `background-attachment: fixed` plus a fixed full-viewport grid overlay — repaint cost on mobile | MINOR |

---

## Revamp plan

Ordered by commercial return, not by effort. Phase 1 pays for the rest.

### Phase 1 — Stop losing leads (Week 1)

*Resolves VC-01, VC-02, VC-03, VC-04*

- **Wire real delivery.** Transactional email on the company domain to a shared sales inbox —
  never a personal one. Immediate branded auto-acknowledgement to the buyer; that email is the
  first thing they judge you on.
- **Persist every lead** *before* attempting delivery, so an email failure can never destroy an
  enquiry.
- **Make the upload real.** Register the input, validate type and size, transmit it, attach it
  to the notification.
- **Harden the endpoints.** Honeypot, IP rate limit, required consent, and an error path that
  tells the buyer to phone or WhatsApp if submission genuinely fails.
- **Instrument it.** Conversion events on every RFQ, contact and WhatsApp click.

### Phase 2 — Make it credible (Week 2)

*Resolves VC-05, VC-06, VC-07, VC-08, VC-13*

- **Move to a domain mailbox** — `sales@` and `export@` — replaced everywhere including both
  structured-data blocks. Highest credibility gain per hour of work on this list.
- **Settle the brand mark.** One name in the logo, the metadata and the schema.
- **Re-cut the statistics** to only what can be evidenced. Replace "24/7 support" with the real
  hours, stated in IST plus one target-market timezone.
- **Build the pages the nav promises**, or remove the nav items until they exist.
- **Shoot the warehouse.** Real photographs of the Bhiwandi facility, drum stock and loading.

### Phase 3 — Open the export channel (Weeks 3–4)

*Resolves VC-10, VC-11, VC-12*

- **Add export terms to the product model** — HS code, Incoterms, port of loading, container
  and packing options, lead time, MOQ — surfaced in the Quick Info panel.
- **Quote in the buyer's terms.** Currency and Incoterm selectors on the RFQ; stop hardcoding
  INR in structured data.
- **Write an Export & Logistics page** covering documentation provided, freight partners and
  typical transit times.
- **Ship privacy and terms pages**, make consent required in the schema, add both to the sitemap.
- **Serve the buyer's timezone.** Label hours in IST with a converted local time; offer a
  callback request outside the overlap.

### Phase 4 — Generate demand (Weeks 5–8)

*Resolves VC-09, builds on VC-04*

- **Publish the datasheets.** SDS and TDS per product behind a short form. Highest-intent lead
  source available to a chemical distributor.
- **Deepen the product pages** — applications, specification tables, handling and storage,
  related grades. Forty substantial pages rank for long-tail CAS and grade queries; ninety-five
  thin ones rank for nothing.
- **Build industry landing pages** for textiles, coatings, pharma and water treatment, each
  with its own RFQ path.
- **Add the trust layer** — named references with permission, and a case study of a fulfilled
  export order.

### Phase 5 — Clear the debt, close the project (Ongoing)

*Resolves VC-14, VC-15, VC-16, VC-17*

- Retire the hardcoded hex values to tokens.
- Fix nav accessibility: `aria-expanded`, `aria-haspopup`, keyboard open, Escape to close.
- **Write back to `shapekraft-lib`** — the improved `NavStickyMinimal` and the new spec-led
  `ProductCard`/`CategoryCard` are better than what the b2b type carries. This must happen
  before the project folder is deleted.
- Measure against targets: LCP &lt;2.0s, INP &lt;100ms, CLS &lt;0.05, Lighthouse &gt;90.

---

## Decisions needed from the client

Phase 1 can start today. These block Phases 2 and 3.

| Decision | Why it blocks work |
| --- | --- |
| Where should leads land? | Shared inbox is enough to start; a CRM is better if more than one person chases enquiries. Determines the Phase 1 integration. |
| Domain and mailbox for sales | Needed before any transactional email can be sent — an unauthenticated sender domain lands in spam, recreating the lost-lead problem in a new form. |
| VC Interconnect, or Vraj Chem Impact LLP? | Every logo, page title and structured-data block depends on the answer. |
| Which statistics can be evidenced? | Anything unverifiable comes off the site rather than being softened. |
| Which certifications are actually held? | ISO, REACH, GMP, supplier authorisations. Determines whether the Certifications page is built or the nav item removed. |
| Target export markets, in priority order | Drives currency, Incoterms, transit-time content, timezone handling and future locale work. |
| Are supplier SDS/TDS redistributable? | Phase 4's main lead magnet depends on it. If not, we write our own specification sheets. |

---

## Notes on the other directories

**Vraj-1** — Empty. A single file, `plans/Logo.png`; no source, no configuration, no git
history of its own. Nothing to compare or merge. Worth confirming whether that logo is the
intended brand mark, since the site draws its logo as an inline SVG instead.

**shapekraft-lib** — The b2b type already specifies exactly the components this project needs
(`CategoryCard`, `FilterSidebar`, `QuickInfoCard`, `RFQForm`, `BreadcrumbNav`) and all five
exist here. The animation rules were being violated by the beaker component: perpetual
decorative motion is not on the allowed list of FadeUp, FadeIn and NumberCounter, and the b2b
guidance is explicit that trust beats animation. Removing it brought the project back into
line. The outstanding library work is the write-back in Phase 5.
