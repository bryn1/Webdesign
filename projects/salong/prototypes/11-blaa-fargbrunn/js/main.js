/* 11 · Blå färgbrunn — progressive enhancement (MC 10088).
   Allt här är förbättring: sidan läses fullt utan JS. Ingen global; allt i IIFE.
   Scroll-rörelsen ligger i js/scroll-motion.js (GSAP + ScrollTrigger). */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Reveal + aria-current i nav (IntersectionObserver) ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });   // slutläge direkt
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { revealIO.observe(el); });
  }

  var navLinks = {};
  document.querySelectorAll('.site-nav a[href^="#"]').forEach(function (a) {
    navLinks[a.getAttribute('href').slice(1)] = a;
  });
  var navIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var link = navLinks[e.target.id];
      if (!link) return;
      if (e.isIntersecting) {
        Object.keys(navLinks).forEach(function (k) { navLinks[k].removeAttribute('aria-current'); });
        link.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  Object.keys(navLinks).forEach(function (id) {
    var sec = document.getElementById(id);
    if (sec) navIO.observe(sec);
  });

  /* ---- Boknings-mock (DEMO, ingen backend) ---- */
  var DAYS = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre'];
  var TIMES = ['10:00', '12:00', '14:00', '16:00', '18:00'];
  /* Fast demo-mönster: 1 = demo-ledig, 0 = demo-upptagen (row = tid, col = dag). */
  var FREE = [
    [1, 0, 1, 1, 0],
    [0, 1, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
    [1, 0, 1, 0, 1]
  ];
  var root = document.getElementById('cal-root');
  var dialog = document.getElementById('booking-dialog');
  var slotLabel = document.getElementById('bd-slot');

  if (root && dialog && slotLabel) {
    var grid = document.createElement('div');
    grid.className = 'cal-grid';
    grid.setAttribute('role', 'grid');
    grid.setAttribute('aria-label', 'Demokalender — välj en tid, bokning sker via telefon eller Instagram');

    var corner = document.createElement('span');
    corner.className = 'cal-day';
    corner.setAttribute('role', 'rowheader');
    grid.appendChild(corner);
    DAYS.forEach(function (d) {
      var h = document.createElement('span');
      h.className = 'cal-day';
      h.setAttribute('role', 'columnheader');
      h.textContent = d;
      grid.appendChild(h);
    });

    TIMES.forEach(function (t, ti) {
      var row = document.createElement('span');
      row.className = 'cal-time';
      row.setAttribute('role', 'rowheader');
      row.textContent = t;
      grid.appendChild(row);
      DAYS.forEach(function (d, di) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'slot';
        b.setAttribute('role', 'gridcell');
        var label = d + ' ' + t;
        if (FREE[ti][di]) {
          b.textContent = 'Ledig';
          b.setAttribute('aria-label', 'Demo-ledig tid ' + label);
          b.addEventListener('click', function () {
            slotLabel.textContent = label;
            if (typeof dialog.showModal === 'function') { dialog.showModal(); }
          });
        } else {
          b.textContent = '–';
          b.disabled = true;
          b.setAttribute('aria-label', 'Demo-upptagen tid ' + label);
        }
        grid.appendChild(b);
      });
    });
    root.appendChild(grid);

    dialog.querySelector('[data-close]').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) {           /* klick utanför kortet stänger */
      if (e.target === dialog) dialog.close();
    });
  }

  /* ---- Kontaktformulär: demo, skickas aldrig ---- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('cf-status');
  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = 'Demo: ingenting skickades — ingen backend är kopplad. ' +
        'Ring +46 70 123 45 67 eller skriv på Instagram @jane.cooper.';
    });
  }
})();
