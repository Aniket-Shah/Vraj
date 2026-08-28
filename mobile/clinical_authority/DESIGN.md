---
name: Clinical Authority
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#44474f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#747780'
  outline-variant: '#c4c6d0'
  surface-tint: '#465e8e'
  primary: '#00173b'
  on-primary: '#ffffff'
  primary-container: '#0f2c59'
  on-primary-container: '#7c94c8'
  inverse-primary: '#aec7fd'
  secondary: '#006c47'
  on-secondary: '#ffffff'
  secondary-container: '#8af5be'
  on-secondary-container: '#00714b'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cca830'
  on-tertiary-container: '#4f3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#aec7fd'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#2d4674'
  secondary-fixed: '#8df7c1'
  secondary-fixed-dim: '#71dba6'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005235'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  data-row-height: 48px
---

## Brand & Style

The design system is engineered for the high-stakes B2B pharmaceutical sector, where precision and reliability are paramount. The brand personality is **Clinical, Professional, and Compliant**, reflecting the rigorous standards of wholesale chemical distribution. 

The visual style is **Corporate Modern with Functional Minimalism**. It prioritizes information density and clarity over decorative elements. By utilizing heavy whitespace, structured data grids, and a conservative color application, the UI evokes an emotional response of absolute trust and institutional stability. Every interface element is designed to facilitate quick scanning of complex technical data while maintaining a high-contrast, accessible environment for procurement officers and laboratory managers.

## Colors

The color palette is strategically chosen to balance authority with utility.
- **Primary (Peacock Blue):** Used for navigation, primary headings, and structural elements to establish a foundation of deep trust.
- **Secondary (Emerald Teal):** Dedicated to positive statuses, medical compliance indicators, and successful cold-chain verification.
- **Tertiary (Gold):** A high-contrast accent reserved exclusively for "Request for Quote" (RFQ) triggers and high-priority alerts to ensure clear conversion paths.
- **Neutral (Slate/Gray):** Used for metadata, labels, and secondary information to keep the focus on critical data points.
- **Backgrounds:** A crisp, clinical white is used for content surfaces, while a subtle light gray defines the application background, creating a clear distinction between the canvas and interactive components.

## Typography

Typography is focused on technical legibility. 
- **Headlines:** Use **Hanken Grotesk** for its sharp, contemporary, and professional appearance. It conveys modernity and precision.
- **Body:** Use **Inter** for all standard reading experiences. Its high x-height and neutral character make it ideal for long pharmaceutical catalogs.
- **Technical Data:** Use **JetBrains Mono** for CAS numbers, chemical formulas, and license IDs. The monospaced nature ensures that alphanumeric strings are distinct and error-free.
- **Labels:** Use uppercase Inter for category headers and license badges to provide structural hierarchy.

## Layout & Spacing

The layout utilizes a **Fixed Grid** model for desktop to ensure data tables remain legible without excessive stretching. 
- **Grid:** A 12-column system with 24px gutters.
- **Rhythm:** An 8px linear scale (with 4px increments for tight data) is used for all padding and margins.
- **Data Tables:** These are the heart of the system. Rows have a fixed height of 48px to balance information density with touch/click targets.
- **Mobile:** Elements reflow to a single column with 16px side margins. Complex data tables should switch to a "card-list" view on screens smaller than 768px.

## Elevation & Depth

This design system uses **Tonal Layers and Low-contrast Outlines** rather than aggressive shadows.
- **Surfaces:** Use 1px borders in a soft neutral color (#E2E8F0) to define containers.
- **Interactive States:** On hover, cards should lift slightly using a subtle, extra-diffused shadow (0px 4px 12px rgba(15, 44, 89, 0.08)) to maintain a professional, flat aesthetic.
- **Modals:** Use a heavy backdrop blur (8px) with a semi-transparent primary color overlay (10% opacity) to focus user attention on RFQ forms or license details.

## Shapes

The shape language is **Soft (0.25rem)**. This subtle rounding removes the harshness of a purely industrial look while remaining much more professional and "buttoned-up" than a consumer-facing app. 
- **Buttons and Inputs:** Use a 4px corner radius.
- **License Badges:** Use a 2px radius for a more "stamped" and official appearance.
- **Large Containers:** Use 8px (rounded-lg) for main content cards to provide a modern, organized feel.

## Components

### B2B Data Tables
The primary interface for chemical catalogs.
- **Header:** Sticky top with primary color text on a light gray background.
- **Cell Alignment:** Text is left-aligned; numerical quantities and CAS numbers are monospaced and right-aligned.
- **Action Column:** Always contains the Gold "RFQ" button.

### FDA License Badges (Form 20B/21B)
- **Style:** Small, rectangular badges with a 1px border.
- **Color:** Primary Blue text on a subtle blue tint background. 
- **Interaction:** Hovering displays a tooltip with the full license number and expiration date.

### Cold-Chain Status Indicators
- **Visual:** A small circular dot (Status Dot) paired with text.
- **States:** 
  - *Compliant:* Emerald Teal dot.
  - *Warning:* Amber/Gold dot for transit delays.
  - *Critical:* Red dot for temperature excursions.

### B2B RFQ Forms
- **Input Fields:** 1px solid border (#CBD5E1) that thickens and changes to Primary Blue on focus.
- **Labels:** Positioned above the input using `body-sm` font.
- **Submission:** A full-width Gold button with `headline-sm` bold text to drive conversion.

### Inventory Chips
- Used for therapeutic categories (e.g., "Analgesic", "Antipyretic"). 
- Low-saturation background colors with high-contrast text to ensure they don't distract from the main primary action.