/* ============================================================
   MYNTA — tema 20 «Pixelhall» (MC 10088)
   Progressive enhancement: allt innehåll finns i HTML:en.
   Ingen global scope — allt i IIFE, trådat med <script defer>.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1 · Scramble-avkodning på hero-ordet ----------
     Originaltexten står redan i markupen (läsbar utan JS och vid
     reduced-motion). JS kodar bara om tillfälligt, sedan decoded. */
  var GLYPHS = '▚▞░▒▓#@%&*+=<>/\\|ABCDEFGHKMNPRSTVXZ0123456789';
  function scramble(el) {
    var final = el.textContent;
    var frame = 0;
    var total = 26; /* frames until fully decoded */
    var timer = window.setInterval(function () {
      frame += 1;
      var revealed = Math.floor((frame / total) * final.length);
      var out = '';
      for (var i = 0; i < final.length; i += 1) {
        if (i < revealed || final[i] === ' ') {
          out += final[i];
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      el.textContent = out;
      if (frame >= total) {
        window.clearInterval(timer);
        el.textContent = final; /* slutligt decode, exakt original */
      }
    }, 55);
  }
  if (!reduced) {
    var targets = document.querySelectorAll('[data-scramble]');
    for (var t = 0; t < targets.length; t += 1) {
      scramble(targets[t]);
    }
  }

  /* ---------- 2 · INSERT COIN-dialog (demo-bokning) ---------- */
  var dialog = document.getElementById('coin-dialog');
  var picked = document.getElementById('coin-picked');
  var slots = document.querySelectorAll('.slot:not(.slot--full)');
  if (dialog && picked && typeof dialog.showModal === 'function') {
    for (var s = 0; s < slots.length; s += 1) {
      slots[s].addEventListener('click', function () {
        picked.textContent = 'Tid vald: ' + this.dataset.dag + ' ' + this.dataset.tid +
          ' — men detta är en demo.';
        dialog.showModal();
      });
    }
  }

  /* ---------- 3 · Kontaktformulär (demo, ingen backend) ---------- */
  var form = document.getElementById('kontakt-form');
  var result = document.getElementById('form-result');
  if (form && result) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      result.textContent = 'Tack — men detta är en demo: ingen backend är kopplad och ' +
        'inget meddelande skickades. Ring 07X-XXX XX XX eller DM:a @dinsalong.';
      form.reset();
    });
  }
})();
