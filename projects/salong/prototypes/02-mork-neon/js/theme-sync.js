/* Scroll-driven chrome theme switch: while a light section owns the viewport
   centre, <html> gets .theme-invert and the CSS tokens flip header/body/progress.
   Guarded: page works fully without this file — sections swap themes in pure
   CSS regardless. (The progress hairline is driven solely by GSAP
   ScrollTrigger in js/scroll-motion.js since 2026-10-05 — one mechanism.) */
(function () {
  'use strict';
  var doc = document.documentElement;
  var lights = document.querySelectorAll('.theme-light');

  if ('IntersectionObserver' in window && lights.length) {
    var io = new IntersectionObserver(function (entries) {
      var on = false;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { on = true; }
      });
      /* re-scan: entries only carry what changed */
      if (!on) {
        for (var i = 0; i < lights.length; i++) {
          var r = lights[i].getBoundingClientRect();
          var mid = window.innerHeight * 0.5;
          if (r.top < mid && r.bottom > mid) { on = true; break; }
        }
      }
      doc.classList.toggle('theme-invert', on);
    }, { rootMargin: '-45% 0px -45% 0px' });
    Array.prototype.forEach.call(lights, function (el) { io.observe(el); });
  }
}());
