/* Horisontell galleriskroll med föregående/nästa-knappar. */
(function () {
  'use strict';
  var scroller = document.querySelector('[data-gallery-scroller]');
  if (!scroller) { return; }

  function scrollByCard(direction) {
    var card = scroller.querySelector('[data-gallery-card]');
    var amount = card ? card.getBoundingClientRect().width + 16 : 280;
    var behavior = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto' : 'smooth';
    scroller.scrollBy({ left: direction * amount, behavior: behavior });
  }

  Array.prototype.forEach.call(
    document.querySelectorAll('[data-gallery-prev], [data-gallery-next]'),
    function (button) {
      button.addEventListener('click', function () {
        scrollByCard(button.hasAttribute('data-gallery-prev') ? -1 : 1);
      });
    }
  );
})();
