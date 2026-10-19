/* 03-skola-larare — progressiv förbättring. Sidan är läsbar utan JS:
   sektionerna är statiska, navet är vanliga ankare. */
(function () {
  "use strict";
  // Angör vilken sektion som är aktiv i navet vid skroll.
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  var map = new Map();
  links.forEach(function (a) {
    var el = document.querySelector(a.hash);
    if (el) map.set(el, a);
  });
  if (!("IntersectionObserver" in window) || map.size === 0) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) { a.removeAttribute("aria-current"); });
      var a = map.get(e.target);
      if (a) a.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "0px 0px -70% 0px" });
  map.forEach(function (_a, el) { io.observe(el); });
})();
