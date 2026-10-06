/* collage.js — icke-scroll-interaktion för tema 10 (MC 10088).
   All scroll-mekanik (parallax, konturbyte) har flyttat till
   js/scroll-motion.js (GSAP + ScrollTrigger, vendor) och är borttagen här.
   Kvar bor draget för kollagekorten — det är en musinteraktion, inte scroll.
   IIFE: inga globals. defer. Dra-spärren läses live ur html[data-motion],
   som enbart scroll-motion.js sätter i no-preference-grenen med biblioteken
   på plats: utan JS, under prefers-reduced-motion eller utan GSAP går inte
   att dra — och kollaget står då som ett vanligt, synligt rutnät. */
(() => {
  "use strict";

  const root = document.documentElement;
  const finePointer = window.matchMedia("(pointer: fine)");

  /* ---------- Drag: bara med muspekare (pointer: fine) ---------- */
  const dragState = new WeakMap();

  const onPointerMove = (event) => {
    const state = dragState.get(event.currentTarget);
    if (!state) return;
    const card = event.currentTarget;
    card.style.setProperty("--dx", (state.baseX + event.clientX - state.startX) + "px");
    card.style.setProperty("--dy", (state.baseY + event.clientY - state.startY) + "px");
  };

  const onPointerUp = (event) => {
    const card = event.currentTarget;
    card.classList.remove("is-dragging");
    card.releasePointerCapture(event.pointerId);
    card.removeEventListener("pointermove", onPointerMove);
    card.removeEventListener("pointerup", onPointerUp);
    card.removeEventListener("pointercancel", onPointerUp);
  };

  const onPointerDown = (event) => {
    if (event.pointerType !== "mouse") return;
    if (!root.hasAttribute("data-motion")) return; // reduce / no-JS / inga bibliotek
    const card = event.currentTarget;
    event.preventDefault();
    const styles = getComputedStyle(card);
    dragState.set(card, {
      startX: event.clientX,
      startY: event.clientY,
      baseX: parseFloat(styles.getPropertyValue("--dx")) || 0,
      baseY: parseFloat(styles.getPropertyValue("--dy")) || 0
    });
    card.classList.add("is-dragging");
    card.setPointerCapture(event.pointerId);
    card.addEventListener("pointermove", onPointerMove);
    card.addEventListener("pointerup", onPointerUp);
    card.addEventListener("pointercancel", onPointerUp);
  };

  if (finePointer.matches) {
    document.querySelectorAll(".postcard").forEach((card) => {
      card.addEventListener("pointerdown", onPointerDown);
    });
  }
})();
