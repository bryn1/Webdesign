/* Bilderboken — main.js: reveal-observation, kapitelbyte i den nalade bilden,
   demo-dialog for bokning och kontaktformulär. Progressive enhancement:
   utan detta paket ar allt synligt och sektionerna staplade (se motion.css). */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealAll(list) {
    for (var i = 0; i < list.length; i++) list[i].classList.add('in');
  }

  var revealables = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealAll(revealables);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    for (var r = 0; r < revealables.length; r++) io.observe(revealables[r]);
    /* Säkerhetsnät: ingen text ska förbli osynlig — efter kort tid är allt i slutläge. */
    window.setTimeout(function () { revealAll(revealables); }, 1200);
  }

  /* Kapitelbyte: den nalade bilden foljer texten som rullar forbi. */
  var stageUse = document.getElementById('stage-use');
  var stageCap = document.querySelector('.stage-cap');
  var chapters = document.querySelectorAll('.chapter[data-scene-swap]');
  if (stageUse && chapters.length && !reduceMotion && 'IntersectionObserver' in window) {
    var setActive = function (chapter) {
      for (var c = 0; c < chapters.length; c++) {
        chapters[c].classList.toggle('active', chapters[c] === chapter);
      }
      var href = chapter.getAttribute('data-scene-swap');
      if (href && stageUse.getAttribute('href') !== href) stageUse.setAttribute('href', href);
      if (stageCap && chapter.hasAttribute('data-cap')) {
        stageCap.textContent = chapter.getAttribute('data-cap');
      }
    };
    var chapterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target);
      });
    }, { rootMargin: '-38% 0px -38% 0px', threshold: 0 });
    for (var k = 0; k < chapters.length; k++) chapterIO.observe(chapters[k]);
    setActive(chapters[0]);
  }

  /* Demo-dialog: delad for bokningstid och kontaktformulär. */
  var dialog = document.getElementById('demo-dialog');
  var ddTitle = document.getElementById('dd-title');
  var ddText = document.getElementById('dd-text');
  var lastFocus = null;

  function openDialog(title, text) {
    if (!dialog) return;
    if (ddTitle) ddTitle.textContent = title;
    if (ddText) ddText.textContent = text;
    lastFocus = document.activeElement;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
      dialog.classList.add('is-open');
    } else {
      /*mycket gammal webbläsare utan <dialog>: texten finns redan pa sidan. */
      var note = dialog.querySelector('.demo-note, .demo-note-inline');
      if (note) note.scrollIntoView({ block: 'center' });
    }
  }

  if (dialog) {
    dialog.addEventListener('close', function () {
      dialog.classList.remove('is-open');
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    });
  }

  var slots = document.querySelectorAll('.slot[data-time]');
  for (var s = 0; s < slots.length; s++) {
    slots[s].addEventListener('click', function () {
      for (var x = 0; x < slots.length; x++) slots[x].setAttribute('aria-pressed', 'false');
      this.setAttribute('aria-pressed', 'true');
      var dagarn = { Mån: 'måndag', Tis: 'tisdag', Ons: 'onsdag', Tor: 'torsdag', Fre: 'fredag' };
      var dag = dagarn[this.getAttribute('data-day')] || this.getAttribute('data-day');
      openDialog(
        'Det här är en demo — ingen tid bokas',
        'Du valde ' + dag + ' ' + this.getAttribute('data-time') +
        '. Ingen backend finns kopplad, så tiden blir inte reserverad. ' +
        'Ring eller skriv till Anny, så bokar hon tiden åt dig.'
      );
    });
  }

  var form = document.getElementById('kontakt-form');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      openDialog(
        'Det här är ett demoformulär',
        'Tack, ' + (form.elements.namn.value || 'du') + '! Formuläret är inte kopplat till ' +
        'någon backend, så meddelandet skickades inte. Ring 072-155 48 60 eller DM:a ' +
        '@mullers.anny på Instagram, så hör Anny av sig.'
      );
      form.reset();
    });
  }
})();
