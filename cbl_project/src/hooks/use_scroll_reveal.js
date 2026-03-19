import { useEffect } from 'react';

export default function use_scroll_reveal() {
  useEffect(function () {
    var elements = document.querySelectorAll('.fade_up');
    if (!elements.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) { observer.observe(el); });

    return function () { observer.disconnect(); };
  }, []);
}
