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
  } else {
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
  }

  // The Apple Music asset was exported with a checkerboard baked into it.
  // Remove only pixels matching the checkerboard colors so the logo remains intact.
  const appleMusicImage = document.querySelector(
    'img[alt="Apple Music"]'
  );

  if (appleMusicImage) {
    const removeCheckerboard = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { willReadFrequently: true });

      if (!context || !appleMusicImage.naturalWidth) return;

      canvas.width = appleMusicImage.naturalWidth;
      canvas.height = appleMusicImage.naturalHeight;
      context.drawImage(appleMusicImage, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const samplePoints = [
        0,
        (canvas.width - 1) * 4,
        (canvas.height - 1) * canvas.width * 4,
        ((canvas.height - 1) * canvas.width + canvas.width - 1) * 4
      ];
      const backgroundColors = samplePoints.map((index) => [
        pixels[index], pixels[index + 1], pixels[index + 2]
      ]);
      const tolerance = 32;

      for (let index = 0; index < pixels.length; index += 4) {
        const matchesCheckerboard = backgroundColors.some(([red, green, blue]) =>
          Math.abs(pixels[index] - red) <= tolerance &&
          Math.abs(pixels[index + 1] - green) <= tolerance &&
          Math.abs(pixels[index + 2] - blue) <= tolerance
        );

        if (matchesCheckerboard) pixels[index + 3] = 0;
      }

      context.putImageData(imageData, 0, 0);
      appleMusicImage.src = canvas.toDataURL('image/png');
    };

    if (appleMusicImage.complete) {
      removeCheckerboard();
    } else {
      appleMusicImage.addEventListener('load', removeCheckerboard, { once: true });
    }
  }
})();
