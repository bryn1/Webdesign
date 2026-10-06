/* hero-drag.js — dragbar sax-sticker med tröghet (Milkshake-mönster, eget
   pattern, inga främde assets). Deklaration: utan JS = statisk klistermärkes
   look. Hoppar över vid pointer:coarse (touch) och prefers-reduced-motion —
   då finns ingen JS-drift alls, bara CSS-läget. Inga globals. */
(function () {
  "use strict";
  var el = document.querySelector("[data-hero-sticker]");
  if (!el) { return; }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia("(pointer: coarse)").matches;
  if (reduce || coarse) { return; } /* statiskt CSS-läge */

  document.documentElement.setAttribute("data-sticker-ready", "drag");
  var hint = document.querySelector("[data-sticker-hint]");
  if (hint) { hint.hidden = false; }

  var x = 0, y = 0, vx = 0, vy = 0;      /* offset + hastighet (px) */
  var dragging = false, lastT = 0, lastX = 0, lastY = 0;
  var raf = 0;
  var FRICTION = 0.95;
  var BOUNCE = -0.55;

  function bounds() {
    var host = el.parentElement;
    var hr = host.getBoundingClientRect();
    var er = el.getBoundingClientRect();
    return {
      minX: -(er.left - hr.left) + 4,
      maxX: hr.width - (er.right - hr.left) - 4,
      minY: -(er.top - hr.top) + 4,
      maxY: hr.height - (er.bottom - hr.top) - 4
    };
  }

  function apply() {
    el.style.translate = x + "px " + y + "px";
    var lean = Math.max(-18, Math.min(18, vx * 0.6));
    el.style.rotate = (-12 + lean) + "deg";
  }

  function clampToBounds() {
    var b = bounds();
    if (x < b.minX) { x = b.minX; vx *= BOUNCE; }
    if (x > b.maxX) { x = b.maxX; vx *= BOUNCE; }
    if (y < b.minY) { y = b.minY; vy *= BOUNCE; }
    if (y > b.maxY) { y = b.maxY; vy *= BOUNCE; }
  }

  function tick() {
    raf = 0;
    x += vx; y += vy;
    vx *= FRICTION; vy *= FRICTION;
    clampToBounds();
    apply();
    if (Math.abs(vx) > 0.05 || Math.abs(vy) > 0.05) { raf = requestAnimationFrame(tick); }
  }

  function kick() {
    if (!raf && !dragging) { raf = requestAnimationFrame(tick); }
  }

  el.addEventListener("pointerdown", function (e) {
    dragging = true;
    cancelAnimationFrame(raf); raf = 0;
    vx = vy = 0;
    lastT = e.timeStamp; lastX = e.clientX; lastY = e.clientY;
    el.classList.add("is-dragging");
    if (hint) { hint.hidden = true; }
    el.setPointerCapture(e.pointerId);
  });

  el.addEventListener("pointermove", function (e) {
    if (!dragging) { return; }
    var dt = Math.max(1, e.timeStamp - lastT);
    var dx = e.clientX - lastX, dy = e.clientY - lastY;
    x += dx; y += dy;
    vx = dx / dt * 12; vy = dy / dt * 12; /* px per tick, dämpat */
    lastT = e.timeStamp; lastX = e.clientX; lastY = e.clientY;
    clampToBounds();
    apply();
  });

  function release(e) {
    if (!dragging) { return; }
    dragging = false;
    el.classList.remove("is-dragging");
    try { el.releasePointerCapture(e.pointerId); } catch (err) { /* redo inte */ }
    kick();
  }
  el.addEventListener("pointerup", release);
  el.addEventListener("pointercancel", release);

  window.addEventListener("resize", function () { clampToBounds(); apply(); });
})();
