# TEST-verdict-c4 — narrow re-verify of the twice-changed DoD gate (f5b2de9 + a010eaa)

Scope per task: section-slicing fix, visible-text demo honesty, photo-check bound
to the #galleri slice, and product-file hygiene. NO theme-quality re-sweep (prior
cycles cleared it). All probes against the real tree at HEAD ca5c834; mutations
only on /tmp copies that keep the real dir NAME (gate branches on `d.name`).
All items VERIFIED by direct execution this session.

## 1. Suite on the real tree — PASS (5 passed, twice)

```
run 1: 5 passed in 0.13s   wall 1.291s real
run 2: 5 passed in 0.14s   wall 1.263s real  (--durations: structure 0.07s, all-served 0.05s)
```
Live-HTTP included: PORT=8090 on this host (192.168.5.231), `curl /` → 200
independently confirmed, so `test_index_page_lists_all_prototypes` and
`test_all_prototypes_served` exercised the running server (a dead server would
raise URLError → fail). Wall-time ~1.3s is real loopback speed, not skipped tests.

## 2. Green control — PASS (20/20)

`assert_demo_honesty` + `assert_gallery_evidence` looped over all 20 real dirs →
`GREEN CONTROL: 20/20 clean` (proto_dirs() found exactly 20).

## 3. RED probes on /tmp copies — PASS (a–e all red, with the claimed assertion)

Real dir name preserved in each copy (PHOTO_FREE branches on d.name); real tree
untouched (verified: repo `git status` clean over prototypes/ before and after).

| probe | mutation | gate response |
|---|---|---|
| a | 4 gal-0N `<img>` deleted from #galleri, copy text untouched (theme 03) | RED — `gallery photos missing from #galleri — found none` |
| b | same + the 4 filenames present ONLY in an HTML comment | RED — same message (parser ignores comments) |
| c | every "demo" silenced file-wide (`demo→exempel`, incl. #boka and any #galleri label), one visible `demo` re-injected inside #kontakt only (theme 05) | RED on **boka**: `#boka lacks a visible demo/mock label` — file-global "demo" present, yet boka fails ⇒ per-section binding proven |
| d | photo-free theme 15 + real `<img src="../_assets/gal-01.jpeg">` injected inside #galleri | RED — `brief says photo-free, but real photos are embedded` (proves the check parses img srcs, not copy) |
| e | statement words (illustration/utan foto/typspecimen) silenced INSIDE 15's #galleri slice only; a statement word survives OUTSIDE the slice | RED — `photo-free theme must say so inside #galleri` — bound to the slice, not file-global |

Note: probe-d needed injection after the section's OPENING tag — injecting at the
slice end byte lands inside the next section's tag markup (my harness-script
mistake in the first attempt, not a gate defect; the gate then correctly saw the
valid injected img and went red).

## 4. Slice correctness, theme 01 (nested `id="galleri-rubrik") — PASS

```
len(section_slice(html, 'galleri')) = 2897
id="galleri-rubrik" inside slice: YES
gal-01.jpeg <img> tag inside slice: YES   (gal imgs in slice: 4 of 4)
```
The old bug (stop at ANY id= cut the slice at the nested heading id and produced
a false-red) is fixed: the slice runs to the next REQUIRED section id, and the
photos lie inside it — proven on the very file that exhibits the nested heading.

## 5. Hygiene — PASS

- `test_prototypes.py`: 190 lines ≤ 600; `grep -c 'TODO\|FIXME'` → 0 hits (exit 1).
- `f5b2de9` touches ONLY: out/test_prototypes.py + prototypes/08-organiskt-hantverk/index.html
  (08 hunk = the coding-discipline >400-line header reason comment; file now 454 lines ≤ 600). Matches its message.
- `a010eaa` touches ONLY: out/test_prototypes.py + prototypes/18-bara-typsnitt/index.html
  + prototypes/index.html (hunks = favicon requote, cards 18/19 desc fixes, "lugna"/"Vitt på svart"/"pixlade"+"scanlinjer" typos, gate visible-text change). Matches its message.
- prototypes/ tree: `git status --short` empty; whole repo clean outside .audits;
  /tmp probe copies deleted (`/tmp/c4-red` gone).

## Findings

None P0–P3. Every c4 claim verified green; gate reds on exactly the planted
attacks and stays green on the honest 20/20 tree. Residual (accepted, documented
in the gate itself): TextOnly yields text of class-hidden spans — the check
targets silent copy edits, not a deliberately forged file; acceptable per brief.

## JUDGED state

`dod_judged_hash.py` over the out dir was the LAST step; its verbatim output is
the # JUDGED line below.

# JUDGED: c802d6b1c21f1b6a243280f0483f85bd7860dfce7e598fefeedda165e76efee9
# VERDICT: PASS
