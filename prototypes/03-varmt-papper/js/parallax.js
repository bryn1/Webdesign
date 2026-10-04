/* Sidans enda stora rörelse: layered parallax för porträtt-blocket.
   Lagren (data-parallax-depth) flyttar sig olika mycket längs scroll.
   Utan JS eller med prefers-reduced-motion: noll transform — statisk bild. */
(function () {
  "use strict";

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  var stages = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  if (!stages.length) return;

  var layers = [];
  stages.forEach(function (stage) {
    Array.prototype.forEach.call(
      stage.querySelectorAll("[data-parallax-depth]"),
      function (layer) {
        layers.push({
          stage: stage,
          el: layer,
          depth: parseFloat(layer.getAttribute("data-parallax-depth")) || 0
        });
      }
    );
  });
  if (!layers.length) return;

  var MAX_SHIFT = 48; /* px, mått — rörelsen ska kännas som andning, inte åkning */
  var ticking = false;

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  function paint() {
    ticking = false;
    var mid = window.innerHeight / 2;
    layers.forEach(function (layer) {
      var box = layer.stage.getBoundingClientRect();
      if (box.bottom < -60 || box.top > window.innerHeight + 60) return;
      var progress = clamp((mid - (box.top + box.height / 2)) / (mid + box.height / 2), -1, 1);
      var y = (progress * layer.depth * MAX_SHIFT).toFixed(1);
      layer.el.style.transform = "translate3d(0, " + y + "px, 0)";
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(paint);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  paint();
}());
