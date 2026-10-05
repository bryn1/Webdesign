// scenes.js — pure builders: sceneN(tl, mobile) append tweens to the SHARED master timeline
// only at their own label window (CONCEPT §1/§6). Exports nothing to globals: `Scenes` is a
// top-level const in the shared script scope, read by main.js. A broken scene can be commented
// out in buildAll without touching the others. Times are timeline seconds; 1s = 120px scroll.
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
    // 11–14s: code panels fly from z:-60 to z:30, html → css → js
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
    // 18–20s: slices fade (re-assembly is SC5's job, same elements, F7) + chrome leaves with shot
    tl.to(".slice-a, .slice-b, .slice-c, .chrome", { opacity: 0, duration: 2 }, 18);
    tl.set(".code", { opacity: 0 }, mobile ? 18 : 18.6);
  }

  function scene2(tl) {
    tl.set(".flow", { opacity: 1 }, 20);
    // 20–24s: chain nodes pop in, connectors draw left→right
    tl.fromTo(".wf-node", { scale: 0.6, y: 24, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "back.out(1.4)" }, 20.4);
    tl.fromTo(".wf-link", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1, stagger: 0.1 }, 21);
    // 24–26s: back-edge Testa⇒Bygg draws (pathLength=1 in the markup), then 2 opacity pulses
    tl.set(".flow__loop path", { strokeDasharray: 1, strokeDashoffset: 1 }, 20);
    tl.to(".flow__loop path", { strokeDashoffset: 0, duration: 2 }, 24);
    tl.to(".flow__loop", { opacity: 0.35, duration: 0.5, yoyo: true, repeat: 3 }, 26);
    // 28–30s: collapse toward stage centre seeds SC3
    tl.to(".flow", { scale: 0.9, opacity: 0, duration: 2 }, 28);
  }

  function scene3(tl) {
    tl.set(".board", { opacity: 1 }, 30);
    // 30–32s columns, 32–36s cards land state-correct inside their column
    tl.fromTo(".kan-col", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.2 }, 30);
    tl.fromTo(".task-card",
      { x: 60, rotate: (i) => (i % 2 ? 6 : -6), opacity: 0 },
      { x: 0, rotate: 0, opacity: 1, duration: 1.4, stagger: 0.18, ease: "power2.out" }, 32);
    // 36–38s the two Kör cards pulse — work is happening
    tl.to(".kan-col--running .task-card", { scale: 1.03, duration: 1, yoyo: true, repeat: 1 }, 36);
    // 38–40s hand-off upward; hub seeds from the two Kör cards' positions
    tl.to(".task-card", { y: -20, opacity: 0, duration: 1.6, stagger: 0.05 }, 38);
    tl.to(".kan-col", { opacity: 0, duration: 1.6 }, 38.6);
  }

  // Hub-and-spoke geometry: desktop spokes at 210°/330°/90° (§1), mobile on a 180° arc (§5.3).
  function spokeTargets(mobile) {
    const R = mobile ? 100 : 200;
    const angles = mobile ? [150, 90, 30] : [210, 330, 90];
    return angles.map((a) => ({ dx: Math.cos(rad(a)) * R, dy: -Math.sin(rad(a)) * R, rot: -a }));
  }

  function scene4(tl, mobile) {
    tl.set(".hubg", { opacity: 1 }, 40);
    const tg = spokeTargets(mobile);
    // 40–43s hub scales up at centre; spokes fly outward radially on their wires
    tl.fromTo(".hub", { xPercent: -50, yPercent: -50, scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6, ease: "back.out(1.6)" }, 40.2);
    tg.forEach((s, i) => {
      const spoke = `.spoke[data-a]:nth-of-type(${i + 1})`;
      tl.set(`.wire:nth-of-type(${i + 1})`, { rotation: s.rot, scaleX: 0, yPercent: -50 }, 40);
      tl.to(`.wire:nth-of-type(${i + 1})`, { scaleX: 1, duration: 1.2, ease: "power1.inOut" }, 40.6 + i * 0.25);
      tl.fromTo(spoke,
        { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: 0.3, opacity: 0 },
        { x: s.dx, y: s.dy, scale: 1, opacity: 1, duration: 1.6, ease: "power2.out" }, 41 + i * 0.25);
    });
    // 43–46s counter digits tween scrubbed (§1 onUpdate + Math.round), consistent with §3.2
    gsap.utils.toArray(".counters b").forEach((el) => {
      const state = { v: 0 };
      const target = Number(el.dataset.count) || 0;
      tl.add(gsap.to(state, {
        v: target, duration: 3,
        onUpdate: () => { el.textContent = String(Math.round(state.v)); },
      }), 43);
    });
    // 48–50s collapse leaves the faint seed dot SC5 expands from
    tl.to(".hubg", { opacity: 0, scale: 1.1, duration: 2 }, 48);
    tl.to(".seed", { opacity: 0.5, duration: 1 }, 48.5);
  }

  function scene5(tl) {
    // 50–53s the SAME slice elements return transform-only to identity (§2 F7 — clip insets
    // stay, invisible at identity). No fragments tween: every SC1–SC4 layer is already
    // opacity:0 by now, so a tween there could not paint anything.
    tl.to(".slice-a, .slice-b, .slice-c", { rotateX: 0, z: 0, x: 0, y: 0, opacity: 1, duration: 2.5, ease: "power2.inOut" }, 50.2);
    tl.to(".seed", { scale: 3, opacity: 0, duration: 1 }, 50.2);
    // 53–56s the assembled plane shrinks and docks left as the nav preview card
    tl.to(".hero", { scale: 0.34, rotateX: 0, x: "-28%", duration: 3, ease: "power2.inOut" }, 53);
    tl.set(".outro", { opacity: 1, pointerEvents: "auto" }, 54.8);
    tl.to(".hero", { opacity: 0, duration: 0.8 }, 55.4);
    tl.fromTo(".docked-shot", { opacity: 0 }, { opacity: 1, duration: 1 }, 55.5);
    // 55–58s outro nav cards slide in; 58–60s the pin releases into the real sections
    tl.fromTo(".nav-card", { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, stagger: 0.15 }, 55.6);
  }

  function captions(tl) {
    // one crossfade hand-off per scene edge (§1 caption mechanics)
    for (let n = 1; n <= 5; n++) {
      tl.fromTo(cap(n), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 2, ease: "power2.out" }, n * 10 + 0.5);
      if (n < 5) tl.to(cap(n), { opacity: 0, y: -16, duration: 2 }, n * 10 + 8);
    }
  }

  function buildAll(tl, mobile) {
    scene0(tl);
    scene1(tl, mobile);
    scene2(tl);
    scene3(tl);
    scene4(tl, mobile);
    scene5(tl);
    captions(tl);
    tl.to({}, { duration: 0.2 }, 59.8); // pad to the 60s total of §1
  }

  return { buildAll };
})();
