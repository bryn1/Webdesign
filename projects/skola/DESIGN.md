---
name: Skola prototypes
description: Operate-mode learning-platform UI. [SUPERSEDED 2026-10-22 MC 11056: the shipped
  world is The Weekly Schema Grid (owner comp pick "C") — paper #e1e9eb, deep navy #0d283a,
  printed-sheet plan; live tokens are each surface's css/tokens.css + world css under
  prototypes/*/css/, comps under .impeccable/mocks/. The zinc/indigo token set below is the
  pre-remake world, kept only as history.]
colors:
  ink: "#16171a"
  ink-secondary: "#6e737c"
  paper: "#ffffff"
  paper-tinted: "#f9fafb"
  paper-inset: "#f3f4f7"
  hairline: "#e9ebef"
  stroke: "#dfe1e6"
  indigo: "#564ef3"
  indigo-deep: "#4332d5"
  indigo-rail: "#3425a8"
  indigo-veil: "rgba(86,78,243,0.08)"
  ink-dark: "#f3f4f7"
  ink-secondary-dark: "#c6c9d0"
  paper-dark: "#060708"
  surface-dark: "#16171a"
  hairline-dark: "#25272b"
  stroke-dark: "#303238"
  indigo-dark: "#7682ff"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "25.0px"
    fontWeight: 600
    lineHeight: 1.45
  title:
    fontFamily: "same"
    fontSize: "20.0px"
    fontWeight: 600
    lineHeight: 1.45
  body:
    fontFamily: "same"
    fontSize: "16.0px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "same"
    fontSize: "12.8px"
    fontWeight: 500
    lineHeight: 1.45
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.indigo}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.indigo-deep}"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  state-rail-item:
    backgroundColor: "{colors.paper-tinted}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  state-rail-item-active:
    backgroundColor: "{colors.indigo-veil}"
    textColor: "{colors.ink}"
---

# Design System: Skola prototypes

## Overview

**Creative North Star: "The Ordered Desk"**

The system reads like a well-laid-out school desk: every object has its place, nothing
ornaments for its own sake. A cool zinc ground carries near-black ink; one indigo is the
only voice, and it appears where a decision is. Density is generous but tight — small
labels, comfortable body, more space above a heading than below it.

The world lends four things only: type, palette, density, and one signature move (the
numbered state rail that doubles as the route map). Layout, navigation model and controls
stay the standard ones for the web.

**Key Characteristics:**
- One accent doing real jobs: active state, focus, primary action.
- 4px spacing rhythm; groups tight, sections separated.
- Light and dark from `prefers-color-scheme`, same roles in both.
- All controls are native web components: labels, inputs, buttons.

## Colors

Cool, desaturated, near-neutral ground with a single committed indigo.

### Primary
- **Indigo Voice** (`{colors.indigo}`): active rail item, links, focus ring, primary button fill. On dark: **Indigo Dark** (`{colors.indigo-dark}`).

### Neutral
- **Ink** (`{colors.ink}`): headings and body text on paper.
- **Quiet Ink** (`{colors.ink-secondary}`): labels, meta, placeholder text — AA-passing on both grounds.
- **Paper / Tinted / Inset** (`{colors.paper}` → `{colors.paper-tinted}` → `{colors.paper-inset}`): background, card-in-context, inline surface steps.
- **Hairline / Stroke** (`{colors.hairline}`, `{colors.stroke}`): card borders and input strokes.
- On dark: **Night Ink** (`{colors.ink-dark}`), **Night Surface** (`{colors.surface-dark}`) on **Night Ground** (`{colors.paper-dark}`).

### Named Rules
**The One Voice Rule.** Indigo carries active state, focus and the primary action — nothing else. Its rarity is the point.

## Typography

**Display Font:** system stack (Segoe UI / SF / Roboto class)
**Body Font:** system stack, same family
**Label/Mono Font:** same stack at 12.8px

**Character:** neutral, fast, no display face; hierarchy comes from the Major Third scale (ratio 1.25) and weight steps 400/500/600.

### Hierarchy
- **Display** (600, 25px, 1.45): page heading, one per surface.
- **Title** (600, 20px, 1.45): form card headings.
- **Body** (400, 16px, 1.5): inputs, hints; measure capped by the 440px card.
- **Label** (500, 12.8px, 1.45): field labels, rail items, meta strip.

## Layout

Two-column work area: a 220px state rail beside one form card (max 440px), in a 1080px centered container with 24px inline padding. At ≤760px the rail becomes a wrapped row above the card; single column, reading order preserved. Spacing scale is 4px-based (4/8/12/16/24/32); the rhythm is one scale throughout.

## Elevation & Depth

One shadow step only, structural not decorative: cards rest with a whisper, everything else is layered by tonal steps of the zinc ramp. Depth in dark mode comes from lighter surfaces over darker ground, not shadows.

### Shadow Vocabulary
- **Rest** (`box-shadow: 0 1px 2px rgba(0,0,0,0.04)`): card at rest.

## Shapes

Gently curved, consistent: 6px on interactive controls and rail items, 8px on cards and the plate image. 1px hairline borders; no nesting of cards; no clipping masks.

## Components

### Buttons
- **Shape:** gently curved (6px).
- **Primary:** indigo fill, white 16px/600 label, 8px × 16px padding.
- **Hover / Focus:** hover deepens to indigo-deep; press scales 0.98; `:focus-visible` shows a 2px indigo ring offset 2px.

### Inputs / Fields
- **Style:** white surface, 1px stroke border, 6px radius, 8×12px padding; label above in 12.8px/500 quiet ink.
- **Focus:** border turns indigo plus a 3px indigo-veil halo (no outline).
- **Placeholder:** quiet ink, AA-passing.

### Navigation (state rail)
- The signature component: four numbered steps (1–4) naming the routes of the auth family. Tinted ground at rest, indigo-veil + indigo border when active, hover lightens. Implemented with native radio inputs + `:checked` selectors — works with no JS.

### Cards / Containers
- **Corners:** 8px. **Background:** paper on tinted ground. **Shadow:** the one Rest step. **Border:** hairline. **Padding:** 24px; internal gap 16px.

## Do's and Don'ts

### Do:
- Do keep the 4px rhythm: 8px between field parts, 16px inside a card, 24px card padding, 32px between regions.
- Do label every input; do keep labels at 12.8px/500 in Quiet Ink (4.8:1 AA on both grounds).
- Do respect `prefers-reduced-motion` (transitions collapse to none).

### Don't:
- Don't add a second accent or a gradient; the system has one voice.
- Don't nest cards or stack shadows; one Rest shadow max.
- Don't ship text below 4.5:1 contrast; the zinc-500 step is only for 3:1-large or non-text.
