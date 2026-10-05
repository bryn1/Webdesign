/* 13-91-tal — progressive enhancement only. Wrapped so nothing touches globals. */
(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* --- no-JS note is only meaningful when JS is absent --- */
  const nojsNote = document.getElementById('nojs-note');
  if (nojsNote) nojsNote.hidden = true;

  /* --- booking mock: click a slot -> dialog with the real booking paths --- */
  const dialog = document.getElementById('book-dialog');
  const slotLabel = document.getElementById('bd-slot');
  const slots = Array.from(document.querySelectorAll('.slot'));
  let lastPressed = null;

  const openDialog = (slot) => {
    if (!dialog || typeof dialog.showModal !== 'function') return;
    if (lastPressed) lastPressed.setAttribute('aria-pressed', 'false');
    slot.setAttribute('aria-pressed', 'true');
    lastPressed = slot;
    slotLabel.textContent = slot.dataset.dag + ' ' + slot.dataset.tid;
    dialog.showModal();
  };

  for (const slot of slots) {
    slot.setAttribute('aria-pressed', 'false');
    slot.addEventListener('click', () => openDialog(slot));
  }
  const closeDialog = document.getElementById('bd-close');
  if (closeDialog && dialog) {
    closeDialog.addEventListener('click', () => dialog.close());
  }

  /* --- contact form: visibly demo, backend nowhere near --- */
  const sendBtn = document.getElementById('cf-send');
  const hint = document.getElementById('cf-hint');
  if (sendBtn && hint) {
    sendBtn.addEventListener('click', () => {
      hint.hidden = false;
    });
  }

  /* --- draggable sticker cards: fine pointers only, off under reduced motion --- */
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (finePointer && !reducedMotion.matches) {
    root.classList.add('drag-ready');
    const dragging = new WeakMap();

    const onDown = (event) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      const card = event.currentTarget;
      if (event.target.closest('a, button')) return;
      card.setPointerCapture(event.pointerId);
      card.classList.add('dragging');
      const pos = dragging.get(card) || { x: 0, y: 0, ox: event.clientX, oy: event.clientY };
      dragging.set(card, { x: pos.x, y: pos.y, ox: event.clientX, oy: event.clientY });
      event.preventDefault();
    };

    const onMove = (event) => {
      const card = event.currentTarget;
      if (!card.classList.contains('dragging')) return;
      const state = dragging.get(card);
      if (!state) return;
      const x = state.x + (event.clientX - state.ox);
      const y = state.y + (event.clientY - state.oy);
      card.style.setProperty('--dx', x + 'px');
      card.style.setProperty('--dy', y + 'px');
    };

    const onUp = (event) => {
      const card = event.currentTarget;
      if (!card.classList.contains('dragging')) return;
      const state = dragging.get(card);
      if (state) dragging.set(card, { x: state.x + (event.clientX - state.ox), y: state.y + (event.clientY - state.oy), ox: 0, oy: 0 });
      card.classList.remove('dragging');
    };

    document.querySelectorAll('.sticker').forEach((card) => {
      card.setAttribute('aria-roledescription', 'draggbart klistermärke');
      card.addEventListener('pointerdown', onDown);
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerup', onUp);
      card.addEventListener('pointercancel', onUp);
    });
  }
})();
