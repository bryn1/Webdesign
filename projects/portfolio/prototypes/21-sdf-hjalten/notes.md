# BENCH — 21-sdf-hjalten (MC 12359, child of 12355, item 4)

Zero-asset hero: the moving visual is a signed-distance field (six spheres fused by polynomial
smooth-min, blend-shell style) raymarched in a WebGL fragment shader — per-pixel cost only, no
textures, no images, no web fonts, no scripts, no network requests beyond the HTML itself.
Subtle pointer reactivity (camera + key light ease toward the pointer); `prefers-reduced-motion`
renders ONE static frame and takes no listeners; WebGL failure falls back silently to the CSS
gradient. Marker `SDF_HJALTEN` in the index.html source comment (exactly one).

## Compared against

**13-krom-soluppgang** (Chrome Sunrise, MC 10096 wave) — chosen as the current strongest hero under
`projects/portfolio/prototypes/`: it is the CSS/DOM "animated sun + chrome wordmark + floating blobs"
hero (4 `@keyframes`, the largest animated hero of the set); all 20 siblings gate PASS, none uses
WebGL/canvas, so this is the honest incumbent for a moving-hero bench.

## Shots (committed under shots/, both pages at 1440 + 375)

- `shots/21-sdf-hjalten-1440.png`
- `shots/21-sdf-hjalten-375.png`
- `shots/13-krom-soluppgang-1440.png`
- `shots/13-krom-soluppgang-375.png`

Captured with `node ~/.dsh/skills/describe-image/scripts/screenshot.mjs <file> --widths 1440,375
--wait-ms 4000` (verdict `clean` for both pages: 0 console errors, 0 failed requests, no overflow).

## Transfer size per page (measured, this session)

| page | raw html | gzip -k of html | external requests | folder du (excl. shots/, .audits/) |
|---|---|---|---|---|
| 21-sdf-hjalten | 13,744 B | **5,680 B** | **0** (all inline, data-URI favicon, system font stack) | 17,260 B |
| 13-krom-soluppgang | 40,789 B | **13,205 B** | Google Fonts (css2 + woff2 files, not counted here) | 41,428 B |

_Folder totals re-measured 2026-11-10 (DA F2): git-blob sum of TRACKED files excluding `shots/`, taken after all files exist (`git ls-tree -rl … | grep -v /shots/ | awk '{s+=$4}'`) — the original du row was measured before notes.md existed and was stated as a folder du (method drift)._

No separate JS files exist in either page — both are single self-contained index.html files.

## Quality gate (workflow-webdesign 1.3.0, run 2026-11-10T08:32:52Z, exit 0)

Verdict line from `bash ~/.dsh/skills/workflow-webdesign/scripts/quality-gate.sh <this-dir>`:

```
# QUALITY: PASS
```

All 19 rows PASS (brief-scope, detect, contrast, console, overflow375/1440/1280, scroll-overlap,
reduced, nojs, links, gb1–gb9). Non-gating REVIEW: wide-tracking x3, cramped-padding x1,
gpt-thin-border-wide-shadow advisory x1.

## Signature look or tech demo? (honest three lines)

1. At 1440 it reads closer to a **signature look than the usual metaball screensaver**: the fused
   graphite cluster with an amber fresnel rim is the portfolio palette made physical, and the copy
   panel in front of it gives the shot a composition rather than a wallpaper.
2. But the underlying shape language is still metaballs — the hello-world of SDF — so anyone who
   knows Shadertoy will clock it as a **tech demo wearing the brand**; the rim + palette do the
   signature work, not the geometry.
3. At 375 the panel covers most of the scene (only amber fringe survives at the edges), so on
   mobile the look collapses back toward **tech demo behind a window** — the scene needs a mobile
   camera move to earn the signature claim at small widths.

## DoD reading used

"Do NOT edit the prototype's own copy quality beyond readability": copy is verbatim spec.md canon
(pitch, three verified numbers, contact, notice) — no invented facts. ">=4 PNGs": 4 committed.
shots/ committed as bench evidence, no .gitignore added in this folder (per brief).
