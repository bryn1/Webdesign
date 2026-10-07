// scenes.js — pure builders: sceneN(tl, mobile) append tweens to the SHARED master timeline
// only at their own label window (CONCEPT §1/§6). Exports nothing to globals: `Scenes` is a
// top-level const in the shared script scope, read by main.js. A broken scene can be commented
// out in buildAll without touching the others. Times are timeline seconds; 1s = 120px scroll.
// Beat map is CONCEPT §1 (unchanged by the 2026-10 redesign — mechanism monogamy: one
// pinned stage, one scrubbed master timeline, scenes as labels). Motion is dressed as signal
// flow: cables draw, lamps light on their cue (PROJEKTIONSHÄNDNING), the tick rail advances.
const Scenes = (() => {
  "use strict";
  const cap = (n) => `.cap[data-scene="${n}"]`;
  const rad = (deg) => (deg * Math.PI) / 180;

  // Scene windows (s): SC0 0–10 · SC1 10–20 · SC2 20–30 · SC3 30–40 · SC4 40–50 · SC5 50–60.
  // Caption floor F2 is CSS-side (≥16px); captions are never 3D-transformed here.

  function scene0(tl) {
    // 0–2s rise. opacity starts at .35 (not 0): at scrub position 0 a literal 0→1 would load
    // a blank hero; .35 keeps the rise honest while the page top is never empty.
    tl.fromTo(".hero", { y: 24, opacity: 0.35 }, { y: 0, opacity: 1, duration: 2, ease: "power2.out" }, 0);
    // 6–10s scroll-zoom inhale (the Proto Homes move, run forward here)
    tl.to(".hero", { scale: 1.08, rotateX: 6, duration: 4 }, 6);
    // 8–10s hand-off: caption SC0 leaves
    tl.to(cap(0), { opacity: 0, y: -16, duration: 2 }, 8);
  }

  function scene1(tl, mobile) {
    const rx = mobile ? 12 : 22;
    const z = mobile ? 70 : 140;
    // 10–12s: the picture opens into three clip-path slice planes (§2; clip insets stay forever)
    tl.to(".slice-a", { rotateX: -rx, z: z, y: "-6%", x: "-3%", duration: 2, ease: "power2.inOut" }, 10);
    tl.to(".slice-b", { rotateX: rx * 0.2, z: z * 0.5, duration: 2, ease: "power2.inOut" }, 10.2);
    tl.to(".slice-c", { rotateX: rx, z: z, y: "6%", x: "3%", duration: 2, ease: "power2.inOut" }, 10.4);
    // 11–14s: module faceplates fly from z:-60 to z:30, html → css → js
    tl.set(".code", { opacity: 1 }, 10.5);
    if (mobile) {
      // §5.3: one panel at a time (stacked swap), not the trio spread
      const panels = gsap.utils.toArray(".code-panel");
      panels.forEach((p, i) => {
        const t = 11 + i * 2.2;
        tl.fromTo(p, { z: -60, scale: 0.7, opacity: 0 }, { z: 0, scale: 1, opacity: 1, duration: 0.6 }, t);
        tl.to(p, { opacity: 0, y: -16, duration: 0.6 }, t + 1.8);
      });
    } else {
      tl.fromTo(".code-panel",
        { z: -60, scale: 0.7, opacity: 0 },
        { z: 30, scale: 1, opacity: 1, duration: 1.6, stagger: 0.2, ease: "power2.out" }, 11);
      // 16–18s panels slide out left — the picture has become its parts
      tl.to(".code-panel", { x: "-8%", opacity: 0, duration: 2 }, 16);
    }
    // 18–20s: slices fade (re-assembly is SC5's job, same elements, F7) + the unit's frame
    // leaves with the shot (chrome rail + its screw foot, so no lone strip hangs on the wall)
    tl.to(".slice-a, .slice-b, .slice-c, .chrome, .unitfoot", { opacity: 0, duration: 2 }, 18);
    tl.set(".code", { opacity: 0 }, mobile ? 18 : 18.6);
  }

  // F-A (fix-cycle 2, DA P2): mobile SC2 — the row wraps to three lines, so a
  // connector that once ended on the next jack dangles off the line end, and the return
  // arc (fixed 560-unit viewBox on a 375px svg → CTM 0.67) painted its label at ~10px
  // under the §5.3 floor, detached from its jacks. Mobile: connectors are taken out of
  // the flow and RE-SEATED jack→jack in the measured gap when their two jacks share a
  // line, dropped when the chain wraps between them; the return cable is RE-ANCHORED to
  // the measured jack rects (Testa-zone → under the wrap → back up into the Bygg-zone,
  // arrow at the jack),
  // and the svg viewBox is rewritten to measured px so CTM = 1 → the label
  // `varv 1 · 2 · 3` paints at a true 15px. Desktop: the canonical markup attributes are
  // restored byte-for-byte (mobile→desktop resize never leaks mobile numbers). No new
  // ScrollTrigger, no new tween: the existing 24s dash-draw + pulse run on the new path
  // (pathLength=1 stays). Called at build, on resize and after webfonts (wrap depends on
  // loaded font metrics).
  let flowBase = null, flowHooks = false;
  function layoutFlow() {
    const svg = document.querySelector(".flow__loop");
    const row = document.querySelector(".flow__row");
    if (!svg || !row) return;
    const path = svg.querySelector("path"), poly = svg.querySelector("polygon"), text = svg.querySelector("text");
    if (!flowBase) flowBase = { vb: svg.getAttribute("viewBox"), d: path.getAttribute("d"), pts: poly.getAttribute("points"), x: text.getAttribute("x"), y: text.getAttribute("y") };
    const links = gsap.utils.toArray(".wf-link");
    const nodes = gsap.utils.toArray(".wf-node");
    const restore = () => {
      svg.setAttribute("viewBox", flowBase.vb); svg.removeAttribute("style");
      path.setAttribute("d", flowBase.d); poly.setAttribute("points", flowBase.pts);
      text.setAttribute("x", flowBase.x); text.setAttribute("y", flowBase.y);
      links.forEach((l) => { l.style.display = ""; l.style.position = ""; l.style.left = ""; l.style.top = ""; l.style.width = ""; });
    };
    if (!window.matchMedia("(max-width: 767px)").matches) { restore(); return; }
    const sameRow = (a, b) => Math.abs(a.offsetTop - b.offsetTop) < 8;
    // Connectors LEAVE the flow (absolute): hiding or re-seating one can then never
    // re-wrap the line it lives on — one pass over node-only flex is deterministic and
    // idempotent (hiding them in-flow made the wrap oscillate). A connector whose two
    // jacks do not share a line is dropped (its flex slot is gone anyway); one whose
    // jacks are adjacent is seated in the measured gap, jack→jack.
    links.forEach((l) => { l.style.display = ""; l.style.position = "absolute"; });
    const W = document.documentElement.clientWidth;
    const rowBot = row.offsetTop + row.offsetHeight, runY = rowBot + 14;
    links.forEach((l, i) => {
      const a = nodes[i], c = nodes[i + 1];
      const x0 = a.offsetLeft + a.offsetWidth, x1 = c.offsetLeft;
      if (!sameRow(a, c) || x1 - x0 < 8) { l.style.display = "none"; return; }
      l.style.left = x0 - 1 + "px";
      l.style.top = a.offsetTop + a.offsetHeight / 2 - 1.5 + "px";
      l.style.width = x1 - x0 + 2 + "px";
    });
    // Return cable geometry from real rects (offset* ignore the in-flight tweens).
    const b = nodes[2], t = nodes[3]; // Bygg, Testa — fixed order (§1 STATIONORDNING)
    const bBot = b.offsetTop + b.offsetHeight, tBot = t.offsetTop + t.offsetHeight;
    // a vertical may not cross another jack's pill on its way to the run line
    const clearAt = (x, fromY, self) => nodes.every((n) => n === self || !(
      x > n.offsetLeft - 2 && x < n.offsetLeft + n.offsetWidth + 2 &&
      n.offsetTop < runY - 2 && n.offsetTop + n.offsetHeight > fromY + 4));
    const xDrop = [t.offsetLeft + t.offsetWidth - 6, t.offsetLeft + t.offsetWidth + 5, t.offsetLeft - 5]
      .find((x) => clearAt(x, tBot, t)) ?? t.offsetLeft + t.offsetWidth - 6;
    const xRise = [b.offsetLeft + b.offsetWidth / 2, b.offsetLeft + 6, b.offsetLeft + b.offsetWidth - 6]
      .find((x) => clearAt(x, bBot, b)) ?? b.offsetLeft + b.offsetWidth / 2;
    const H = runY + 42;
    svg.style.cssText = `position:absolute;left:0;top:0;margin:0;width:${W}px;height:${H}px`;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`); // user unit = CSS px: CTM = 1
    path.setAttribute("d", `M ${xDrop} ${tBot} L ${xDrop} ${runY} L ${xRise} ${runY} L ${xRise} ${bBot + 13}`);
    poly.setAttribute("points", `${xRise},${bBot + 2} ${xRise - 6},${bBot + 13} ${xRise + 6},${bBot + 13}`);
    text.setAttribute("x", (xDrop + xRise) / 2); text.setAttribute("y", runY + 20);
    if (!flowHooks) {
      flowHooks = true;
      window.addEventListener("resize", layoutFlow);
      if (document.fonts) document.fonts.ready.then(layoutFlow); // webfont metrics can re-wrap the row
    }
  }

  function scene2(tl) {
    layoutFlow();
    tl.set(".flow", { opacity: 1 }, 20);
    // 20–24s: jacks pop in, patch segments draw jack→jack (STATIONORDNING: one fixed order)
    tl.fromTo(".wf-node", { scale: 0.6, y: 24, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "back.out(1.4)" }, 20.4);
    tl.fromTo(".wf-link", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1, stagger: 0.1 }, 21);
    // 24–26s: the coiled return cable Testa⇒Bygg draws (pathLength=1 in the markup), then 2 pulse
    // passes — current flowing the wrong way on purpose
    tl.set(".flow__loop path", { strokeDasharray: 1, strokeDashoffset: 1 }, 20);
    tl.to(".flow__loop path", { strokeDashoffset: 0, duration: 2 }, 24);
    tl.to(".flow__loop", { opacity: 0.35, duration: 0.5, yoyo: true, repeat: 3 }, 26);
    // 28–30s: unplug — the collapse toward stage centre leaves the wall BARE for two seconds
    // before SC3 (MA raise: one genuinely empty handoff beat; the rail keeps the only light)
    tl.to(".flow", { scale: 0.9, opacity: 0, duration: 2 }, 28);
  }

  function scene3(tl) {
    tl.set(".board", { opacity: 1 }, 30);
    // 30–32s bays bolt in (state lamps arrive with their bay), 32–36s cards land state-correct
    tl.fromTo(".kan-col", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.2 }, 30);
    tl.fromTo(".task-card",
      { x: 60, rotate: (i) => (i % 2 ? 6 : -6), opacity: 0 },
      { x: 0, rotate: 0, opacity: 1, duration: 1.4, stagger: 0.18, ease: "power2.out" }, 32);
    // 36–38s the two Kör cards pulse — work is happening
    tl.to(".kan-col--running .task-card", { scale: 1.03, duration: 1, yoyo: true, repeat: 1 }, 36);
    // 38–40s hand-off upward; the hub seeds from the two Kör cards' positions
    tl.to(".task-card", { y: -20, opacity: 0, duration: 1.6, stagger: 0.05 }, 38);
    tl.to(".kan-col", { opacity: 0, duration: 1.6 }, 38.6);
  }

  // Hub-and-spoke geometry: desktop spokes at 210°/330°/90° (§1). Mobile (calib A5b fix): a
  // downward cascade below the hub, given as direct stage-px — at 375px with the 15px text floor
  // a mono spoke pill measures ~208px wide, so §5.3's literal 180° arc physically piles pills
  // on each other and on the hub. Wires stay radial (rot = vector angle). Desktop unchanged.
  function spokeTargets(mobile) {
    if (mobile) {
      return [
        { dx: -60, dy: 62, rot: 134 },
        { dx: 60, dy: 112, rot: 62 },
        { dx: -60, dy: 162, rot: 110 },
      ];
    }
    const R = 200;
    const angles = [210, 330, 90];
    return angles.map((a) => ({ dx: Math.cos(rad(a)) * R, dy: -Math.sin(rad(a)) * R, rot: -a }));
  }

  function scene4(tl, mobile) {
    tl.set(".hubg", { opacity: 1 }, 40);
    // The <b>s carry their FINAL digits in HTML (the no-JS view must show real data), but with
    // immediateRender:false they would flash those digits from 40s and snap to 0 when the 43s
    // tween's onUpdate first writes — same pre-paint class as calib A1–A4. Zero them at reveal.
    tl.set(".counters b", { textContent: "0" }, 40);
    const tg = spokeTargets(mobile);
    // 40–43s hub plate scales up at centre; cables draw from the hub, workers fly out on them
    tl.fromTo(".hub", { xPercent: -50, yPercent: -50, scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6, ease: "back.out(1.6)" }, 40.2);
    tg.forEach((s, i) => {
      const spoke = `.spoke[data-a]:nth-of-type(${i + 1})`;
      // F-B (fix-c2, DA P3): wire reaches its pill — width = hub→spoke-center distance,
      // measured from the same targets, +10px tucked UNDER the pill (spokes paint over
      // wires: DOM order). Mobile cascade distances differ per spoke (86/127/173px), a
      // fixed 100px CSS width died ~65px short of worker-3 and 12px short of worker-2.
      // Desktop: hypot(±R components) is exactly 200 = the CSS width — set explicitly so
      // a mobile→desktop resize can never leak a mobile length. Pixel-identical.
      const wireLen = Math.round(Math.hypot(s.dx, s.dy)) + (mobile ? 10 : 0);
      tl.set(`.wire:nth-of-type(${i + 1})`, { rotation: s.rot, width: wireLen, scaleX: 0, yPercent: -50 }, 40);
      tl.to(`.wire:nth-of-type(${i + 1})`, { scaleX: 1, duration: 1.2, ease: "power1.inOut" }, 40.6 + i * 0.25);
      tl.fromTo(spoke,
        { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0.3, opacity: 0 },
        { x: s.dx, y: s.dy, scale: 1, opacity: 1, duration: 1.6, ease: "power2.out" }, 41 + i * 0.25);
    });
    // 43–46s meter bridge digits tween scrubbed (§1 onUpdate + Math.round), consistent with §3.2;
    // the unlit ghost "8" behind each digit is CSS (.counters b::before) — STRUKET SIFFER.
    gsap.utils.toArray(".counters b").forEach((el) => {
      const state = { v: 0 };
      const target = Number(el.dataset.count) || 0;
      tl.add(gsap.to(state, {
        v: target, duration: 3,
        onUpdate: () => { el.textContent = String(Math.round(state.v)); },
      }), 43);
    });
    // 48–50s collapse leaves the faint signal dot SC5 expands from
    tl.to(".hubg", { opacity: 0, scale: 1.1, duration: 2 }, 48);
    tl.to(".seed", { opacity: 0.5, duration: 1 }, 48.5);
  }

  function scene5(tl) {
    // 50–53s the SAME slice elements return transform-only to identity (§2 F7 — clip insets
    // stay, invisible at identity). No fragments tween: every SC1–SC4 layer is already
    // opacity:0 by now, so a tween there could not paint anything.
    tl.to(".slice-a, .slice-b, .slice-c", { rotateX: 0, z: 0, x: 0, y: 0, opacity: 1, duration: 2.5, ease: "power2.inOut" }, 50.2);
    tl.to(".seed", { scale: 3, opacity: 0, duration: 1 }, 50.2);
    // 53–56s the assembled plane shrinks and racks in at left as the nav preview card
    tl.to(".hero", { scale: 0.34, rotateX: 0, x: "-28%", duration: 3, ease: "power2.inOut" }, 53);
    tl.set(".outro", { opacity: 1, pointerEvents: "auto" }, 54.8);
    tl.to(".hero", { opacity: 0, duration: 0.8 }, 55.4);
    tl.fromTo(".docked-shot", { opacity: 0 }, { opacity: 1, duration: 1 }, 55.5);
    // 55–58s engraved nav plates slide in; 58–60s the pin releases into the real sections
    tl.fromTo(".nav-card", { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, stagger: 0.15 }, 55.6);
  }

  function captions(tl) {
    // one crossfade hand-off per scene edge (§1 caption mechanics)
    for (let n = 1; n <= 5; n++) {
      tl.fromTo(cap(n), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, n * 10 + 0.5);
      if (n < 5) tl.to(cap(n), { opacity: 0, y: -16, duration: 2 }, n * 10 + 8);
    }
  }

  function rail(tl) {
    // TIKRÄL (kept line, timetable rack): the story's extent and position, always on the wall.
    // One amber level travels the meter top→bottom across the whole 60s — the page's one
    // continuous instrument; hidden on mobile (§5.3 edge budget).
    tl.fromTo(".tickrail__fill", { scaleY: 0 }, { scaleY: 1, duration: 60, ease: "none" }, 0);
  }

  function buildAll(tl, mobile) {
    scene0(tl);
    scene1(tl, mobile);
    scene2(tl);
    scene3(tl);
    scene4(tl, mobile);
    scene5(tl);
    captions(tl);
    rail(tl);
    tl.to({}, { duration: 0.2 }, 59.8); // pad to the 60s total of §1
  }

  return { buildAll };
})();
