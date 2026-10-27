---
name: Operations Console
colors:
  surface: '#10141a'
  surface-dim: '#10141a'
  surface-bright: '#353940'
  surface-container-lowest: '#0a0e14'
  surface-container-low: '#181c22'
  surface-container: '#1c2026'
  surface-container-high: '#262a31'
  surface-container-highest: '#31353c'
  on-surface: '#dfe2eb'
  on-surface-variant: '#e0c0b0'
  inverse-surface: '#dfe2eb'
  inverse-on-surface: '#2d3137'
  outline: '#a78b7c'
  outline-variant: '#584236'
  surface-tint: '#ffb68d'
  primary: '#ffb68d'
  on-primary: '#532200'
  primary-container: '#f57200'
  on-primary-container: '#532200'
  inverse-primary: '#9b4600'
  secondary: '#cebff3'
  on-secondary: '#352954'
  secondary-container: '#4e426e'
  on-secondary-container: '#c0b1e4'
  tertiary: '#00daf3'
  on-tertiary: '#00363d'
  tertiary-container: '#00a8bb'
  on-tertiary-container: '#00363e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbc9'
  primary-fixed-dim: '#ffb68d'
  on-primary-fixed: '#331200'
  on-primary-fixed-variant: '#763300'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cebff3'
  on-secondary-fixed: '#20143d'
  on-secondary-fixed-variant: '#4c406c'
  tertiary-fixed: '#9cf0ff'
  tertiary-fixed-dim: '#00daf3'
  on-tertiary-fixed: '#001f24'
  on-tertiary-fixed-variant: '#004f58'
  background: '#10141a'
  on-background: '#dfe2eb'
  surface-variant: '#31353c'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
  code-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.03em
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an uncompromising, mission-critical operations console for enterprise IT asset management within hospitality infrastructure. It balances high-velocity hardware tracking with dense, mission-ready oversight across distributed hotel networks, POS terminals, server closets, and guest-facing hardware fleets.

The style unites brutalist developer precision with refined enterprise utility:
- **Zero-Tolerance Precision:** 90-degree edges, technical hairline dividers, and monospaced data alignment eliminate decorative excess in favor of rapid scanning and zero latency.
- **High-Visibility Telemetry:** High-contrast neon orange accents cut through dark slate and deep indigo-toned panels, drawing immediate attention to active states, critical lifecycles, and network alerts.
- **Enterprise Command:** Built for systems engineers, regional IT directors, and field technicians who require dense data legibility, low eye fatigue in high-stress shifts, and immediate hardware state comprehension.

## Colors

The palette is engineered for low-light command environments and intense operational workloads, anchoring high-contrast functional roles against deep, low-reflective slate surfaces:

- **Primary (`#F57200`):** Electric tech orange directly derived from hardware status emitters. Used strictly for focus indicators, high-priority telemetry, active tab markers, primary triggers, and destructive confirmations.
- **Secondary (`#4B3F6B`):** Deep slate-indigo directly sourced from brand foundation. Deployed for secondary panel containers, structural group headers, inactive technical chips, and auxiliary action states.
- **Tertiary (`#00E5FF`):** High-voltage cyan telemetry accent for real-time ping monitors, network sync flags, and connected device indicators.
- **Neutral Surface Palette:**
  - `Canvas / Base`: `#090D12` (Void Black)
  - `Panel Surface`: `#0F141C` (Dark Slate Core)
  - `Raised Surface`: `#161C26` (Terminal Layer)
  - `Hairline Borders`: `#222B38` (Low-contrast separation)
  - `Text Primary`: `#F0F4F8` (High-contrast operational starkness)
  - `Text Muted`: `#7E8B9E` (Hardware metadata, serial strings, timestamps)
- **Status Badges:**
  - `Asignado (Active)`: Border `#10B981`, Background `rgba(16, 185, 129, 0.12)`, Text `#34D399`
  - `En almacén (Inventory)`: Border `#0284C7`, Background `rgba(2, 132, 199, 0.12)`, Text `#38BDF8`
  - `Mantenimiento (Alert)`: Border `#F57200`, Background `rgba(245, 114, 0, 0.12)`, Text `#FF9838`

## Typography

Geist provides mechanical balance, uncompromising legibility, and geometric sharpness across dense tables and telemetry dashboards.

- **Tabular Figures & Monospace Alignment:** All numerical outputs, MAC addresses, serial identifiers, IP ranges, and stock quantities must invoke tabular numbers (`font-variant-numeric: tabular-nums`) to prevent layout shift during live refreshes.
- **Micro-Labels:** `label-sm` utilizes uppercase rendering with `0.06em` tracking for technical headers (e.g., `SERIAL NO`, `ASSET TAG`, `RACK POS`, `STATUS`).
- **Hierarchy Rules:** Limit `headline-xl` to top-level facility or global aggregate metrics. Secondary interfaces and nested modal consoles anchor to `headline-md` and `headline-sm` to maintain dense information ratios.

## Layout & Spacing

The system enforces a dense 12-column architectural grid calculated for real-time operational displays, multi-pane asset inspectors, and low-scroll data tables.

- **Screen Scaling:**
  - `Desktop (>= 1280px)`: 12 columns, `gutter-desktop` (24px), persistent split-pane layout with a 260px collapsible command rail and a 380px contextual asset inspector drawer.
  - `Tablet (768px - 1279px)`: 8 columns, `gutter` (16px), command rail transforms into an icon-rail dock (64px), asset inspector transitions to an overlay pane.
  - `Mobile (< 768px)`: 4 columns, single-stream card feed, `margin` (16px), inspector drawer converts to a full-screen drawer sheet.
- **Internal Component Spacing:**
  - Compact inputs and table rows maintain strict vertical cadence (`space-sm` for table row cells, `space-md` for standard forms) to ensure high density without operational friction.

## Elevation & Depth

Shadows are replaced with structured boundary architecture, structural tiering, and micro-luminance borders:

- **Zero Diffusion:** Drop shadows and blurred drop-offs are completely eliminated. Depth is established purely through surface value shifting and 1px technical lines.
- **Surface Elevation Steps:**
  - `Layer 0 (Canvas)`: `#090D12` (Base frame).
  - `Layer 1 (Card/Table Container)`: `#0F141C` with `1px solid #222B38`.
  - `Layer 2 (Hover/Active Table Rows)`: `#161C26` with `1px solid #2F3B4D`.
  - `Layer 3 (Modals/Popovers/Inspectors)`: `#1A222E` framed with `1px solid #3E4C60`.
- **Telemetry Glows:** Focused elements, active indicators, and critical maintenance alerts deploy a tight, non-diffuse 1px outer accent border in `#F57200` without ambient spread.

## Shapes

The shape system is strictly sharp (`0px` border radius). Every UI primitive adheres to clean architectural corners, reinforcing an uncompromising developer and hardware console aesthetic.

- **Perimeter Edge:** Buttons, cards, popovers, dropdown menus, table headers, and badges have zero curvature.
- **Visual Dividers:** Panel segmentations utilize 1px orthogonal line divisions (`#222B38`) with no rounded caps or pill terminators.
- **Status Pills Rejected:** Status indicators are rendered as rectangular telemetry tags with micro-borders, never rounded pills.

## Components

### Buttons
- **Primary:** Background `#F57200`, text `#090D12`, font weight 600, sharp 0px corners, no shadow. Active state shifts to `#D96500`. Focus creates a `2px solid #FFFFFF` offset ring.
- **Secondary:** Background `#161C26`, text `#F0F4F8`, border `1px solid #3E4C60`. Hover: background `#222B38` and border `#F57200`.
- **Destructive/Critical:** Background `transparent`, text `#F87171`, border `1px solid #DC2626`. Hover: background `rgba(220, 38, 38, 0.1)`.

### Inputs & Search Bars
- Background `#0F141C`, border `1px solid #222B38`, text `#F0F4F8`, padding `8px 12px`.
- Monospace-styled placeholder in `#7E8B9E`.
- Focus state: border `1px solid #F57200`, zero outline ring.
- Integrated quick-filter tags sit directly inside search inputs as sharp rectangular blocks with `#161C26` background.

### Status Badges (Telemetry Tags)
- Height `22px`, font size `11px`, font weight `600`, text-transform `uppercase`, letter spacing `0.06em`, border `1px solid`.
- **Asignado:** Background `rgba(16, 185, 129, 0.12)`, border `#10B981`, text `#34D399`.
- **En almacén:** Background `rgba(2, 132, 199, 0.12)`, border `#0284C7`, text `#38BDF8`.
- **Mantenimiento:** Background `rgba(245, 114, 0, 0.15)`, border `#F57200`, text `#FF9838`. Lead with an inline rectangular indicator block (`4px x 4px`).

### KPI Metric Cards
- Background `#0F141C`, border `1px solid #222B38`, padding `16px`.
- Top edge: Optional 2px accent stripe (`#F57200` for critical operational pools, `#4B3F6B` for general ledger inventory).
- Metric figure: `32px` Geist tabular figures, high contrast `#F0F4F8`.
- Subtitle & delta: `12px` Geist, uppercase tracking, muted neutral `#7E8B9E`.

### Data Tables
- Header: Background `#161C26`, border-bottom `1px solid #222B38`, typography `label-sm` in `#7E8B9E`.
- Rows: Background `#0F141C`, alternating row shading omitted in favor of `1px solid #1C232E` hairline horizontal dividers.
- Hover: Row background illuminates to `#161C26`, displaying a 2px `#F57200` indicator mark along the left margin edge.
- Dense vertical padding of `8px` per row for maximum single-screen asset visibility.

### Checkboxes & Selection Controls
- Checkbox: 14px square, `0px` radius, background `#0F141C`, border `1px solid #3E4C60`.
- Checked State: Background `#F57200`, border `#F57200`, displaying an angular geometric check or solid inner square.