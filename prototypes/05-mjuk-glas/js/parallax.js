/* Mjuk parallax på bakgrundskladdarna (data-speed).
   Kvittas helt vid prefers-reduced-motion; utan skript ligger kladdarna stilla. */
(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  var blobs = Array.prototype.slice.call(document.querySelectorAll("[data-speed]"));
  if (!blobs.length) {
    return;
  }

  var pending = false;

  function update() {
    var y = window.scrollY || window.pageYOffset || 0;
    blobs.forEach(function (blob) {
      var speed = parseFloat(blob.getAttribute("data-speed")) || 0;
      blob.style.transform = "translate3d(0," + (y * speed).toFixed(1) + "px,0)";
    });
    pending = false;
  }

  function onScroll() {
    if (!pending) {
      pending = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
})();
