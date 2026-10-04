/* scramble.js — N7 text-decode som temats primära språk.
   Markupen bär alltid sluttexten (sr-only + en synlig kopia); den synliga
   kopian är aria-hidden och animeras här FRÅN brus TILL sluttext. Utan JS
   eller under prefers-reduced-motion rör vi aldrig texten — den står redan
   decodad. Ingen global: allt i IIFE. */
(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789/·—#";

  function decodeOnce(el) {
    var final = el.textContent;
    var n = final.length;
    var frame = 0;
    var perFrame = 0.34; // tecken som hinner läckas per frame i snitt

    function tick() {
      frame += 1;
      var out = "";
      var pending = false;
      for (var i = 0; i < n; i += 1) {
        var c = final.charAt(i);
        if (c === " " || c === "\u00a0") { out += c; continue; }
        if (frame * perFrame > i + 3) {
          out += c;
        } else {
          out += GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
          pending = true;
        }
      }
      el.textContent = out;
      if (pending) {
        window.requestAnimationFrame(tick);
      } else {
        el.textContent = final; // exakt sluttext, aldrig restbrus
      }
    }
    window.requestAnimationFrame(tick);
  }

  var targets = document.querySelectorAll("[data-scramble]");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    for (var i = 0; i < targets.length; i += 1) decodeOnce(targets[i]);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    for (var j = 0; j < entries.length; j += 1) {
      if (entries[j].isIntersecting) {
        decodeOnce(entries[j].target);
        io.unobserve(entries[j].target);
      }
    }
  }, { threshold: 0.6 });

  for (var k = 0; k < targets.length; k += 1) io.observe(targets[k]);
})();
