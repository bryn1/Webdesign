/* collage.js — kollagets rörelsekörning för tema 10 (MC 10088).
   IIFE: inga globals. defer. Utan JS eller under prefers-reduced-motion
   sätts aldrig html[data-motion] — CSS:an stannar då i sitt statiska
   rutnätsläge och allt innehåll är synligt. */
(() => {
  "use strict";

  const root = document.documentElement;
  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const WIDE = 900;
  let motionOK = false;

  const setMotion = (on) => {
    motionOK = on;
    if (on) root.setAttribute("data-motion", "on");
    else root.removeAttribute("data-motion");
  };

  /* ---------- Parallax: hero-omslag + collagekort (--py per element) ---------- */
  const floaters = Array.prototype.slice.call(document.querySelectorAll("[data-speed]"));
  let ticking = false;

  const paintParallax = () => {
    ticking = false;
    if (!motionOK) return;
    const wide = window.innerWidth >= WIDE;
    const vh = window.innerHeight;
    for (const el of floaters) {
      if (!wide) { el.style.setProperty("--py", "0px"); continue; }
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) continue; // utanför: spara arbetet
      const mid = rect.top + rect.height / 2;
      const offset = (vh / 2 - mid) * (parseFloat(el.getAttribute("data-speed")) || 0);
      el.style.setProperty("--py", offset.toFixed(1) + "px");
    }
  };
  const requestParallax = () => {
    if (!ticking) { ticking = true; window.requestAnimationFrame(paintParallax); }
  };

  /* ---------- Konturbyte: rubriker som bilderna glider över ---------- */
  const outlineTargets = Array.prototype.slice.call(document.querySelectorAll("[data-outline]"));
  const outlineObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      entry.target.classList.toggle("is-outline", entry.isIntersecting);
    }
  }, { rootMargin: "-28% 0px -28% 0px", threshold: 0 });

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
    if (event.pointerType !== "mouse" || !motionOK) return;
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

  const bindDrag = () => {
    if (!finePointer.matches) return;
    document.querySelectorAll(".postcard").forEach((card) => {
      card.addEventListener("pointerdown", onPointerDown);
    });
  };

  /* ---------- Aktivering ---------- */
  let wired = false;
  const activate = () => {
    setMotion(!reduceQuery.matches);
    if (!reduceQuery.matches && !wired) {
      wired = true;
      // Startläge för parallax-axeln: gör transform-uttrycket giltigt direkt,
      // så att rotationen sitter från början och korten inte "poppar in".
      floaters.forEach((el) => el.style.setProperty("--py", "0px"));
      bindDrag();
      outlineTargets.forEach((el) => outlineObserver.observe(el));
      window.addEventListener("scroll", requestParallax, { passive: true });
      window.addEventListener("resize", requestParallax);
    }
    if (!reduceQuery.matches) paintParallax();
  };

  reduceQuery.addEventListener("change", () => {
    // Byter användaren inställning mitt under farten: lägg av direkt.
    window.removeEventListener("scroll", requestParallax);
    activate();
  });

  activate();
})();
