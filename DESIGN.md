---
name: Signalväg (workflow-explode hero surface)
description: Studio-rack world — a finished prototype unpacked into its signal path
colors:
  wall: "#1b2024"
  wall-hi: "#21272c"
  panel: "#262d33"
  inset: "#101519"
  bezel: "#22282d"
  alu: "#aab3b8"
  alu-hi: "#cfd6da"
  ink: "#14181b"
  silk: "#e9e4d9"
  amber: "#e8a13a"
  amber-safe: "#eeae54"
  green: "#6fbf8a"
  vermilion: "#d4552e"
  state-queued: "#8fa0aa"
typography:
  display:
    fontFamily: "'Saira Condensed', 'Arial Narrow', 'Liberation Sans Narrow', sans-serif"
    fontSize: "2.35rem"
    fontWeight: 600
    lineHeight: 1.05
  body:
    fontFamily: "'Saira', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Saira Condensed', 'Arial Narrow', sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    letterSpacing: "0.14em"
  mono:
    fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace"
    fontSize: "0.95rem"
rounded:
  rack: "6px"
spacing:
  xs: "0.375rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "2rem"
  xl: "3.5rem"
components:
  faceplate:
    backgroundColor: "{colors.alu}"
    textColor: "{colors.ink}"
    rounded: "{rounded.rack}"
    padding: "0.375rem 0.75rem"
  plate-dark:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.silk}"
    rounded: "{rounded.rack}"
  pill:
    backgroundColor: "{colors.inset}"
    textColor: "{colors.silk}"
  lamp-live:
    backgroundColor: "{colors.amber}"
  lamp-verified:
    backgroundColor: "{colors.green}"
  chip-honesty:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.ink}"
---

## Overview

The visitor is inside a dark studio rack. A finished prototype sits mounted in a unit; scrolling patches its signal out through code panels, a workflow chain, a task board and an orchestrator panel, then racks it back into the portfolio nav. Everything reads as hardware: powder-coated panels, aluminium faceplates, ivory silkscreen ink, signal lamps. One pinned scroll stage, one scrubbed timeline — the world moves as one machine.

## Colors

Materials first: graphite wall with a lighter band between the rack rails; powder-coated panel bodies; near-black recessed insets for screens and code; warm aluminium for faceplates carrying dark silkscreen type. Ivory is the only light ink on dark surfaces, with fixed alpha steps (86/72/62 percent) that keep AA on panels. Amber is the live signal and honesty chip; text-safe amber for amber body text. Green means verified. Vermilion appears only as the DA-grinden strike mark, never as body text. Board-state lamps use the fixed-cell palette (queued slate, running amber, verified green).

## Typography

One silkscreen superfamily: Saira Condensed for display and plate labels (600/700, wide letterspacing on labels), Saira variable for body. Mono is the system stack, reserved for displayed code and measured digits. Every visible UI/body text is at least 15px (mobile floor); captions sit at the condensed display size. Both display faces are vendored locally in `css/fonts.css`.

## Layout

Desktop: a full-viewport pinned stage; components sit at rack-anchored offsets and translate with parallax on the single timeline. Mobile 375px: one column, halved 3D offsets, the task board becomes a plain scroll list; no horizontal overflow. Below the stage the page is plain readable document flow (`#om`, `#projekt`, footer).

## Elevation & Depth

Depth is mechanical, not atmospheric: `translateZ` layering inside a preserved-3d stage (code panels forward of the hero slices), bezel insets, and rail shadows on the rack walls. No glows as decoration — amber glow belongs only to lamps.

## Shapes

A single machined radius. Panels and pills share the rack radius; screws, rails and patch-jacks are the only ornament.

## Components

Faceplates carry dark ink on aluminium (plate labels, URL pill). Dark plates carry ivory silkscreen text. Lamps are small filled dots — amber for live, green for verified — placed on a lamp strip. The honesty chip (`demo · fejkad data`) is amber with dark ink and never scrolls away. Timetable rows on the task board keep fixed state cells.

## Do's and Don'ts

- Do keep one pinned stage and one master timeline; scenes are labels on it.
- Do route all color/type/spacing through the token table in `tokens.css`.
- Don't paint vermilion or green as body text; lamps and marks only.
- Don't add a second font family, a second radius, or decorative glow on non-lamp elements.
- Don't show unlabelled data: any number on screen is invented and must be chip-labelled.
