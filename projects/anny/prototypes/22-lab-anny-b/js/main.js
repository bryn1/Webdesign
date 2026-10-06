/* ============================================================
   Anny Morin — scroll-koreografi (valfri förbättring).
   Utan GSAP, utan JS eller med prefers-reduced-motion: reduce
   är allt innehåll fullt synligt och effekterna körs inte.
   ============================================================ */
(function () {
  'use strict';

  var html = document.documentElement;
  html.classList.add('interactive'); /* bokningsgrindets fallgrind är .js .interactive (REVIEW F9) */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var motionOK = !reduceMotion.matches;
  var wide = window.matchMedia('(min-width: 52.01rem)');
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  function onScroll(cb) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () { ticking = false; cb(); });
      }
    }, { passive: true });
    cb();
  }

  /* ---------- 1. Sidhuvud: solid vid scroll ---------- */
  var head = document.getElementById('siteHead');
  onScroll(function () {
    if (window.scrollY > 10) head.classList.add('is-scrolled');
    else head.classList.remove('is-scrolled');
  });

  /* ---------- 2. Scrollindikator (position, inte rörelse) ---------- */
  var bar = document.getElementById('scrollBar');
  onScroll(function () {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  });

  /* ---------- 3. Aktiv navigeringslänk ---------- */
  if ('IntersectionObserver' in window) {
    var links = Array.prototype.slice.call(document.querySelectorAll('.main-nav a'));
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && byId[en.target.id]) {
          links.forEach(function (a) { a.removeAttribute('aria-current'); });
          byId[en.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['top', 'om', 'tjanster', 'galleri', 'boka', 'kontakt'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  /* ---------- 4. Demobokning: vald tid → dialog ---------- */
  var dlg = document.getElementById('bookingDialog');
  var chosen = document.getElementById('bkChosen');
  var lastSlot = null;
  Array.prototype.forEach.call(document.querySelectorAll('.slot'), function (btn) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('is-taken')) return;
      lastSlot = btn;
      chosen.textContent = btn.getAttribute('data-slot');
      if (dlg && typeof dlg.showModal === 'function') dlg.showModal();
    });
  });
  if (dlg) {
    dlg.addEventListener('close', function () { if (lastSlot) lastSlot.focus(); });
  }

  /* ---------- 5. Kontaktformulär: demo, skickar inget ---------- */
  var form = document.getElementById('demoForm');
  var status = document.getElementById('formStatus');
  if (form && status) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      status.textContent =
        'Det här är en demo — inget meddelande skickades någonstans. ' +
        'Ring 072-155 48 60 eller mejla Anny.mullerskarlskrona@gmail.com, så ses vi på Müllers.';
    });
  }

  /* ---------- 6. Scroll-effekter (GSAP, valfritt, ej vid reduce) ---------- */
  if (!hasGsap || !motionOK) return;

  html.classList.add('anim');
  gsap.registerPlugin(ScrollTrigger);

  /* Hero-intro: en gång, lugnt */
  gsap.from('.hero-copy .eyebrow, .hero h1, .hero .lede, .hero .cta-row, .hero .hero-meta',
    { y: 26, opacity: 0, duration: 0.85, stagger: 0.08, ease: 'power3.out' });
  gsap.from('.hero-figure',
    { y: 34, opacity: 0, duration: 1, delay: 0.15, ease: 'power3.out' });

  /* Reveal sektion för sektion — bara element utanför första vyn */
  Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function (el) {
    if (el.getBoundingClientRect().top > window.innerHeight * 0.9) {
      gsap.set(el, { opacity: 0, y: 24 });
    }
  });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 92%',
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power2.out', overwrite: true });
    }
  });

  /* Porträttet driver långsamt medan Om-texten läses */
  gsap.fromTo('.portrait-img',
    { yPercent: -3 },
    {
      yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: '.portrait-frame', start: 'top bottom', end: 'bottom top', scrub: true }
    });

  /* Galleri: pinad horisontell rullning på bred vy (lookbook) */
  var mm = gsap.matchMedia();
  mm.add('(min-width: 52.01rem)', function () {
    var gal = document.querySelector('[data-gallery]');
    var viewport = gal.querySelector('.gal-viewport');
    var track = document.getElementById('galTrack');
    if (!gal || !viewport || !track) return;
    gal.classList.add('gal-pinned');

    function distance() {
      return Math.max(0, track.scrollWidth - viewport.clientWidth);
    }

    var tween = gsap.to(track, {
      x: function () { return -distance(); },
      ease: 'none',
      scrollTrigger: {
        trigger: gal,
        start: 'top top',
        end: function () { return '+=' + (distance() + window.innerHeight * 0.35); },
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        once: false
      }
    });

    return function () {
      tween.scrollTrigger && tween.scrollTrigger.kill();
      tween.kill();
      gal.classList.remove('gal-pinned');
      gsap.set(track, { x: 0 });
    };
  });
})();
