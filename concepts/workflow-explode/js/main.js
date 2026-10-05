// main.js — boot ONLY (CONCEPT §6): html.js flag, failure containment, matchMedia, the ONE
// pinned master timeline (§1 mechanism monogamy). Choreography lives in scenes.js.
// Scene N scroll window = pin top + N × 1200px (desktop) / N × 800px (mobile).
(() => {
  "use strict";
  document.documentElement.classList.add("js"); // §5.1: no JS → no class → no stage machinery

  const stage = document.getElementById("stage");
  if (!stage) return;

  // §5.5 failure containment: vendor copy corrupt / blocked → static readable page, ONE console note.
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined" || typeof Scenes === "undefined") {
    console.info("workflow-explode: GSAP/ScrollTrigger/Scenes unavailable — static readable view stays.");
    return;
  }
  try {
    gsap.registerPlugin(ScrollTrigger);
  } catch (err) {
    console.info("workflow-explode: ScrollTrigger registration failed — static readable view stays.", err.message);
    return;
  }

  // One scrubbed master timeline for the whole scroll story. Labels per §1 (sc0@0 … sc5@50).
  function buildTimeline(mobile) {
    const pinLength = mobile ? 4800 : 7200; // 6 scenes × (800 | 1200) px
    const tl = gsap.timeline({
      defaults: { ease: "none", immediateRender: false },
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: `+=${pinLength}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
    ["sc0", "sc1", "sc2", "sc3", "sc4", "sc5"].forEach((name, i) => tl.addLabel(name, i * 10));
    Scenes.buildAll(tl, mobile);
    return tl;
  }

  // §5.2: there is deliberately NO prefers-reduced-motion branch — with reduce the pinned
  // timeline is never created and CSS shows the static step-through (base.css stack).
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
    const tl = buildTimeline(false);
    return () => tl.kill();
  });
  mm.add("(prefers-reduced-motion: no-preference) and (max-width: 767px)", () => {
    const tl = buildTimeline(true);
    return () => tl.kill();
  });
})();
