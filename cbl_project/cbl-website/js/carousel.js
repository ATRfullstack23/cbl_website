(function () {
  'use strict';

  var CAROUSEL_INTERVAL_MS = 3500;

  function init_carousels() {
    var blocks = document.querySelectorAll('[data-carousel]');
    blocks.forEach(function (block) {
      var track = block.querySelector('.carousel_track');
      if (!track) return;
      var slides = track.querySelectorAll('.carousel_slide');
      var total = slides.length;
      if (total === 0) return;

      var current_index = 0;

      function go_to(index) {
        current_index = (index + total) % total;
        track.style.transform = 'translateX(-' + (current_index * 100) + '%)';
      }

      function next() {
        go_to(current_index + 1);
      }

      setInterval(next, CAROUSEL_INTERVAL_MS);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init_carousels);
  } else {
    init_carousels();
  }
})();
