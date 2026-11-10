# web-craft — adopted defaults for hero-page builds

ADOPTED operational defaults drawn from the gated reddit web-craft research run
`.audits/202611090959-18124c4f/out/research-doc.md` (MC 12307, lanes 12308–12313, knut PASS ×6,
173 VERIFIED quotes re-grepped at close, 0 fabricated). Covers adopted items **1, 2, 3 and 6**
of MC 12355; items 4–5 are deliberately not in this file. Written for humans AND as rows an
impeccable audit prompt can check mechanically — one rule per line, each carrying its source.

**How to read the SRC refs:** `SRC §N` = section N of the research doc named above, re-read in
full this session (VERIFIED against that artifact). The URLs are transcribed verbatim from the
research doc's own SRC lines; they were quote-verified there (lane `## VERIFY` grep runs, MC
12308–12313) but NOT re-fetched in this session — treat a bare URL here as VERIFIED-in-upstream-run,
not VERIFIED-today. Nothing is carried that the research doc does not state.

## 1. 3D decision ladder

Climb cheapest-first; a rung may be used ONLY when the rung below cannot answer the page's need.

- Default for product/model showcase slots is `@google/model-viewer`: one script import + one custom element gives orbit controls, poster, shadow and AR, with DRACO/KTX2/Meshopt/Lottie decoders lazy-loaded only when used. (SRC §1 · https://modelviewer.dev/ · https://modelviewer.dev/docs/faq.html)
- Use three.js for a designed, code-driven HERO scene only — WebGL default renderer = maximum compatibility, and a three.js hero is NOT Safari/iOS-blocked today (WebGPU only when needed). (SRC §1 · https://raw.githubusercontent.com/mrdoob/three.js/dev/docs/llms-full.txt)
- Deliver a three.js hero as ONE `.glb` via GLTFLoader with a progress callback — that is the standard delivery unit. (SRC §1 · https://raw.githubusercontent.com/mrdoob/three.js/dev/docs/llms-full.txt)
- In a React design system use react-three-fiber (no wrapper overhead — "Components render outside of React") and drei's `ScrollControls`/`useScroll` for scroll-linked model motion — a solved primitive, do not hand-roll scroll rigs. (SRC §1 · https://raw.githubusercontent.com/pmndrs/react-three-fiber/master/readme.md · https://pmndrs.github.io/drei/controls/scroll-controls)
- Designer-driven 3D hero without build code: Spline embeds as the native `<spline-viewer>` web component and officially exports Vanilla JS / React / Next / three.js / r3f, so handoff into a real codebase is tool-supported — record which export a Spline-sourced hero came in on. (SRC §1 · https://docs.spline.design/exporting-your-scene/web/exporting-as-spline-viewer.md · https://docs.spline.design/exporting-your-scene/web/exporting-as-code.md)
- For agent-built web 3D pick three.js: it is the de-facto AI-3D target (coding agents one-shot it best) and zero-install is the demo's selling point — "bare minimum you just need a browser to open it". (SRC §1 · https://www.reddit.com/r/aigamedev/comments/1xj52f8/threejs_is_underrated · https://www.reddit.com/r/TopologyAI/comments/1xjns4n/what_is_this_sorcery_threejs_is_insane_blender_too)
- After an agent writes a 3D page, run a draw-call/scene-graph pass — audited commenters find per-object DRAW-CALL WASTE in generated pure-code scenes. (SRC §1 · https://www.reddit.com/r/TopologyAI/comments/1xngb4e/this_robot_octopus_is_2616_lines_of_threejs_built)
- Raw image-to-3D meshes have NO topology control: run a decimate/quadremesh pass before real-time use, and keep 3D showcase slots for OBJECTS, not people (photo-to-3D humans are still mannequin-grade). (SRC §1 · https://www.reddit.com/r/StableDiffusion/comments/1bbyzg6/dont_you_think_that_triposr_nodes_could_be_good/ · https://www.reddit.com/r/comfyui/comments/1p29s88/meta_just_dropped_sam_3d_you_can_auto_select_any)
- First-load is a workstream of its own: preload/warm shaders before the visitor acts, intercept keyboard/mouse inside the canvas so keys don't leak to browser controls. (SRC §1 · https://www.reddit.com/r/aigamedev/comments/1xn2rp5/one_month_building_hiraeth_a_moebiusinspired · https://www.reddit.com/r/TopologyAI/comments/1xprlhj/a_solo_dev_built_a_browserbased_fighter_jet)
- Add a USDZ link on showcase pages — an AR quick-look costs little and is proven wow-factor there. (SRC §1 · https://www.reddit.com/r/TopologyAI/comments/1xqeped/image_to_3d_to_your_living_room_tripo_models_in)
- Zero-asset procedural heroes (SDF blend-shell characters, per-vertex cost, ~15 lines of JSON each) are a BENCH LEAD, not yet a default — one throwaway prototype before adopting. (SRC §1 · SRC §6 lead 2 · https://www.reddit.com/r/aigamedev/comments/1umiurs/fable_5_just_oneshot_crazy_cool_procedural)
- Gaussian splats are NOT for the next hero page: memory cost + the streaming/cloud-delivery decision is unresolved in-corpus. (SRC §6 · https://www.reddit.com/r/TopologyAI/comments/1xbq9s2/gaussian_splatting_is_the_future)

## 2. Delivery budget

- Budget textures FIRST: textures, not geometry, set the KB floor — ship KTX2/Basis Universal (one file transcoded per-GPU); caveat: the transcoder is WASM and needs WebAssembly. (SRC §1 · findings-webstack §A, KTX2Loader docs)
- Pick the mesh codec per page on delivery-size vs runtime-cost: Draco maximizes ratio but scrambles render order (slower GPU render); Meshopt keeps order and decode speed. A/B both with glTF-Transform before locking one. (SRC §1 · SRC §6 lead 1 · findings-webstack §A, meshopt/Draco docs)
- Run glTF-Transform as a build step — it is the optimizer that ENFORCES the budget; a hero page without it is unbudgeted. (SRC §1 · SRC §6 lead 1 · findings-webstack §A, glTF-Transform docs)
- Hero-fidelity triangle budget: ~30k tris PER higher-fidelity asset (measured in a shipped Three.js RTS); ~25k-tri meshes textured cleanly where denser quads failed. (SRC §1 · https://www.reddit.com/r/aigamedev/comments/1vwrjp5/i_built_a_3d_fantasy_rts_in_threejs_using_claude · https://www.reddit.com/r/TopologyAI/comments/1xmzbn2/codex_3d_ai_opus_55_from_a_notebook_sketch_to_an)
- Set the budget AT GENERATION, and keep in-tool pre-decimation (~10k) as a possible shortcut only — its own source hedges ("that might save a step it might not"), so it never substitutes for the verification pass. (SRC §1 · https://www.reddit.com/r/TopologyAI/comments/1xmzbn2/codex_3d_ai_opus_55_from_a_notebook_sketch_to_an)
- Generated meshes get a SCRIPTED normalization pass (headless-Blender decimate + texture down/brighten), never a manual one. (SRC §1 · https://www.reddit.com/r/TopologyAI/comments/1xmzbn2/codex_3d_ai_opus_55_from_a_notebook_sketch_to_an)
- Ship GLB — it is what web viewers consume; export GLB alongside FBX from one pipeline so the web slot never hand-converts. (SRC §1 · https://www.reddit.com/r/aigamedev/comments/1xrmexs/i_made_rigged_mythic_warrior_characters_with_ai)

## 3. Video-hero hard rules

- Autoplay only `muted` (or no audio track) + `playsinline` — the only reliable hero-video autoplay recipe; never design video that requires sound. (SRC §2 · https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay · https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- Always set `poster`: it is the official shown-while-downloading surface AND the LCP-safe placeholder. (SRC §2 · https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
- A video must not steal the hero image's LCP: `fetchpriority=high` goes on the ONE likely LCP resource, and more than one or two high-priority resources cancels the benefit. (SRC §2 · https://web.dev/articles/optimize-lcp)
- Keep an H.264 fallback `<source>` beside any AV1: AV1 saves up to ~50% vs H.264 royalty-free, but Safari plays AV1 only with a hardware decoder (M3+/iPhone 15 Pro+). (SRC §2 · https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/video_codecs)
- No VP9/WebM alpha overlays in Safari-bound pages — transparent overlay video is NOT supported there; plan a fallback or use Lottie/Rive instead. (SRC §2 · findings-webstack §B)
- `prefers-reduced-motion` is the accessibility gate EVERY motion design must answer — reduce or replace, never ignore. (SRC §2 · https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- Keep hero video on SLOW camera moves and short loops — fast motion visibly morphs/deforms; AI generation is a BATCH job for site media (7–8 min per 8 s FHD clip on 16GB VRAM, community-measured on OTHER hardware — UNKNOWN-for-our-fleet). (SRC §2 · SRC §6 · https://www.reddit.com/r/StableDiffusion/comments/1qae922/ltx2_i2v_isnt_perfect_but_its_still_awesome_my/)
- Prefer short SEAMLESS loops triggered on demand over one long ambient loop. (SRC §2 · https://www.reddit.com/r/comfyui/comments/1osskyi/built_an_open_source_viewer_for_face_looker)
- AI video handoff: Runway `.mp4` and Luma `assets.video` mp4 are web-playable H.264 straight from generation — pick ~720p for a web hero. (SRC §2 · https://docs.dev.runwayml.com/assets/outputs/ · https://docs.lumalabs.ai/docs/video-generation)
- Make hero clips build artifacts, not one-off edits: deterministic engine capture (swap the clock for a virtual one, drive real input events, one PNG per step) re-runs BYTE FOR BYTE; generate-many-records → human picks one is the cheap quality dial. (SRC §2 · https://www.reddit.com/r/aigamedev/comments/1vjv3z8/i_left_claude_code_running_for_24h_it_built_a_3d)

## 6. License-chain hygiene

- Check EVERY link of the license chain before generated output lands on a public site — chains are layered traps (Apache-2.0 code over non-commercial SMPL-X body model over research-licensed weights). (SRC §5 · https://www.reddit.com/r/TopologyAI/comments/1x48eqn/free_opensource_tool_that_turns_a_video_into)
- An MIT tool does NOT make everything it touches MIT: even MIT tools exclude NAMED asset packs for license reasons — read the exclusions, not just the top-level LICENSE. (SRC §5 · https://www.reddit.com/r/TopologyAI/comments/1xqfa2s/opensource_ai_that_animates_any_rigged_3d_model)
- Provenance as credibility on public-site assets: keep AI out of the originals and print the human artist's name — AI only for derived printings. (SRC §5 · https://www.reddit.com/r/TopologyAI/comments/1xq0z0g/solo_dad_built_a_tcg_app_with_ai_after_a_sold_out)
- Treat undisclosured tool praise as an ad; sponsored reviews carry in-body disclosure, and self-interest gets disclosed in one line. (SRC §3 · https://www.reddit.com/r/aigamedev/comments/1vmdx2q/8player_survival_pong_built_with_opus_the_arena)
- Present RESULTS, not UI demos: the credible launch shape is the end-to-end result artifact — demo post first → later a "proper site + guide" edit; body stays story+specs with download/CTA links a scroll down. (SRC §4 · https://www.reddit.com/r/3Dprinting_AI/comments/1vtzm2a/i_put_an_ai_agent_inside_orcaslicer_it_can · https://www.reddit.com/r/3Dprinting_AI/comments/1xr3d7b/a_little_bit_of_help_from_the_community)
- Any "best 3D tool" claim without a measured, metric-defined comparison stays PLAUSIBLE — bench before choosing (the one in-corpus metric run, Meshy 94/98/78 vs Tripo 97/96/72 vs Rodin 89/94/81 vs Hunyuan 82/88/61, is community numbers: UNKNOWN-for-our-workflow). (SRC §6 · https://www.reddit.com/r/aigamedev/comments/1ucirid/meshy_vs_tripo_vs_rodin_vs_hunyuan_for_game)

---
Maintained by MC 12355/12357 · 2026-11-10 · source run 202611090959-18124c4f. A new research
run supersedes this file per workspace-convention §Versioned-truth (new version; old copy
archived `SUPERSEDED — DO NOT USE`).
