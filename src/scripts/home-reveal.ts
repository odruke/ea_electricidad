const REVEAL_SELECTOR = '[data-reveal]';
const REVEAL_TIMEOUT_MS = 2400;

function initHomeReveal(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    return;
  }

  const elements = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));

  if (elements.length === 0) {
    return;
  }

  document.documentElement.classList.add('js');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        const element = entry.target as HTMLElement;

        element.classList.add('is-visible');
        observer.unobserve(element);

        // Remove the clip mask once the transition is over so focus rings are never clipped.
        window.setTimeout(() => element.classList.add('is-revealed'), REVEAL_TIMEOUT_MS);
      }
    },
    // Start as soon as a sliver is on screen (owner, 2026-11-22: was 0.15 / -10%).
    { threshold: 0.05, rootMargin: '0px 0px -4% 0px' },
  );

  for (const element of elements) {
    element.dataset.revealReady = 'true';
    observer.observe(element);
  }
}

initHomeReveal();
