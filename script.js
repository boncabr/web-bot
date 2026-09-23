(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const revealElements = document.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => {
      element.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((element) => observer.observe(element));
})();
