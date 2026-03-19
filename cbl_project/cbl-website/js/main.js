(function () {
  'use strict';

  var nav_toggle = document.querySelector('.nav_toggle');
  var nav_links = document.querySelector('.nav_links');

  if (nav_toggle && nav_links) {
    nav_toggle.addEventListener('click', function () {
      nav_links.classList.toggle('open');
    });
  }

  // Set active nav link by current page
  var path = window.location.pathname;
  var page = path.endsWith('/') ? 'index.html' : (path.split('/').pop() || 'index.html');
  var current_page = page.split('#')[0];
  document.querySelectorAll('.nav_links a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').split('#')[0];
    if (href === current_page) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
})();
