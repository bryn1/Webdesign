/* Scroll-driven chrome theme switch: while a light section owns the viewport
   centre, <html> gets .theme-invert and the CSS tokens flip header/body/progress.
   Also the fallback driver for the progress hairline when the browser lacks
   CSS scroll timelines (@supports handles the CSS path). Guarded: page works
   fully without this file — sections swap themes in pure CSS regardless. */
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

  var bar = document.querySelector('.scroll-progress');
  if (!bar) { return; }
  if (window.CSS && CSS.supports && CSS.supports('animation-timeline', 'scroll(root)')) {
    return; /* CSS scrubs it; no JS needed */
  }
  var raf = null;
  function update() {
    raf = null;
    var root = doc;
    var max = root.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.pageYOffset / max)) : 0;
    bar.style.setProperty('--scroll-prog', String(p));
  }
  window.addEventListener('scroll', function () {
    if (!raf) { raf = window.requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', function () {
    if (!raf) { raf = window.requestAnimationFrame(update); }
  }, { passive: true });
  update();
}());
