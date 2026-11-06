interface SlideshowState {
  root: HTMLElement;
  track: HTMLElement;
  slides: HTMLElement[];
  index: number;
  paused: boolean;
  hovered: boolean;
  inView: boolean;
  reducedMotion: boolean;
  interval: number;
  timer: number | null;
  transitionTimer: number | null;
  transitioning: boolean;
  pendingIndex: number | null;
  programmaticUntil: number;
  resizeTimer: number | null;
  scrollTimer: number | null;
}

const FADE_OUT_MS = 450;
const FADE_IN_MS = 650;
const DECODE_WAIT_MS = 250;
const DRAG_THRESHOLD_PX = 8;

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function readState(root: HTMLElement): SlideshowState | null {
  const track = root.querySelector<HTMLElement>('[data-slideshow-track]');
  const slides = track
    ? Array.from(track.querySelectorAll<HTMLElement>('[data-slideshow-slide]'))
    : [];

  if (!track || slides.length === 0) {
    return null;
  }

  const interval = Number(root.dataset.interval ?? 8000);

  return {
    root,
    track,
    slides,
    index: 0,
    paused: reducedMotionQuery.matches,
    hovered: false,
    inView: false,
    reducedMotion: reducedMotionQuery.matches,
    interval: Number.isFinite(interval) && interval > 1000 ? interval : 8000,
    timer: null,
    transitionTimer: null,
    transitioning: false,
    pendingIndex: null,
    programmaticUntil: 0,
    resizeTimer: null,
    scrollTimer: null,
  };
}

function initSlideshow(root: HTMLElement): void {
  const state = readState(root);

  if (!state) {
    return;
  }

  const slideshow: SlideshowState = state;
  const { track, slides } = slideshow;
  let pointerStartX = 0;
  let pointerMoved = false;

  function getStep(): number {
    if (slides.length < 2) {
      return track.clientWidth;
    }

    return slides[1].offsetLeft - slides[0].offsetLeft;
  }

  function getVisibleCount(): number {
    const step = getStep();

    if (step <= 0) {
      return 1;
    }

    return Math.max(1, Math.round(track.clientWidth / step));
  }

  // A page never repeats an image from the previous page on the two-up stage.
  // With an odd image count the final page holds a single image aligned to the
  // start edge; the stylesheet adds trailing space so the track can reach it.
  function getLastPageStart(): number {
    const visible = getVisibleCount();

    return Math.floor((slides.length - 1) / visible) * visible;
  }

  function getNextPageStart(index: number): number {
    const visible = getVisibleCount();
    const last = getLastPageStart();
    const threshold = index + visible;

    // Skip past any page that would repeat a currently visible image. This only
    // matters after a manual swipe settles between two canonical pages.
    for (let start = 0; start <= last; start += visible) {
      if (start >= threshold) {
        return start;
      }
    }

    return 0;
  }

  function getPreviousPageStart(index: number): number {
    const visible = getVisibleCount();
    const last = getLastPageStart();
    const limit = index - visible;

    for (let start = last; start >= 0; start -= visible) {
      if (start <= limit) {
        return start;
      }
    }

    return last;
  }

  function getIndexFromScroll(): number {
    const step = getStep();

    if (step <= 0) {
      return slideshow.index;
    }

    return Math.min(Math.max(Math.round(track.scrollLeft / step), 0), getLastPageStart());
  }

  function clearTimer(): void {
    if (slideshow.timer !== null) {
      window.clearTimeout(slideshow.timer);
      slideshow.timer = null;
    }
  }

  function clearTransitionTimer(): void {
    if (slideshow.transitionTimer !== null) {
      window.clearTimeout(slideshow.transitionTimer);
      slideshow.transitionTimer = null;
    }
  }

  function canAutoplay(): boolean {
    return (
      !slideshow.paused &&
      !slideshow.hovered &&
      slideshow.inView &&
      !document.hidden &&
      slides.length > getVisibleCount()
    );
  }

  function updateState(): void {
    slideshow.root.dataset.paused = String(slideshow.paused);
    slideshow.root.classList.toggle('is-paused', slideshow.paused);
  }

  function schedule(): void {
    clearTimer();

    if (!canAutoplay()) {
      return;
    }

    slideshow.timer = window.setTimeout(() => {
      slideshow.timer = null;
      goTo(getNextPageStart(slideshow.index));
    }, slideshow.interval);
  }

  function jumpTo(index: number): void {
    const left = slides[index].offsetLeft - slides[0].offsetLeft;

    slideshow.programmaticUntil = window.performance.now() + 200;
    track.scrollTo({ left, behavior: 'auto' });
  }

  function cancelTransition(): void {
    if (!slideshow.transitioning) {
      return;
    }

    clearTransitionTimer();
    slideshow.transitioning = false;
    slideshow.pendingIndex = null;
    track.classList.remove('is-leaving', 'is-entering');
    slideshow.index = getIndexFromScroll();
    updateState();
    schedule();
  }

  function waitForImage(index: number): Promise<void> {
    const image = slides[index]?.querySelector('img');

    if (!image || image.complete) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let settled = false;

      const finish = (): void => {
        if (settled) {
          return;
        }

        settled = true;
        resolve();
      };

      image.addEventListener('load', finish, { once: true });
      image.addEventListener('error', finish, { once: true });
      window.setTimeout(finish, DECODE_WAIT_MS);
    });
  }

  function goTo(target: number): void {
    const last = getLastPageStart();
    const nextIndex = target < 0 ? last : target > last ? 0 : target;

    if (slideshow.transitioning) {
      slideshow.pendingIndex = nextIndex;
      return;
    }

    if (nextIndex === slideshow.index) {
      schedule();
      return;
    }

    slideshow.index = nextIndex;
    clearTimer();
    updateState();

    if (slideshow.reducedMotion) {
      jumpTo(nextIndex);
      schedule();
      return;
    }

    slideshow.transitioning = true;

    void waitForImage(nextIndex).then(() => {
      if (!slideshow.transitioning) {
        return;
      }

      track.classList.add('is-leaving');

      slideshow.transitionTimer = window.setTimeout(() => {
        slideshow.transitionTimer = null;

        if (!slideshow.transitioning) {
          return;
        }

        jumpTo(slideshow.index);
        track.classList.remove('is-leaving');
        track.classList.add('is-entering');

        // Force a reflow so the entering position is committed before it settles.
        void track.offsetWidth;
        track.classList.remove('is-entering');

        slideshow.transitionTimer = window.setTimeout(() => {
          slideshow.transitionTimer = null;
          slideshow.transitioning = false;

          const pending = slideshow.pendingIndex;
          slideshow.pendingIndex = null;

          if (pending !== null) {
            goTo(pending);
          } else {
            schedule();
          }
        }, FADE_IN_MS);
      }, FADE_OUT_MS);
    });
  }

  function togglePause(): void {
    slideshow.paused = !slideshow.paused;
    updateState();
    schedule();
  }

  function syncFromScroll(): void {
    if (slideshow.transitioning) {
      return;
    }

    if (window.performance.now() < slideshow.programmaticUntil) {
      return;
    }

    const nextIndex = getIndexFromScroll();

    if (nextIndex !== slideshow.index) {
      slideshow.index = nextIndex;
      updateState();
      schedule();
    }
  }

  track.addEventListener('pointerdown', (event) => {
    pointerStartX = event.clientX;
    pointerMoved = false;
    cancelTransition();
  });

  track.addEventListener('pointermove', (event) => {
    if (Math.abs(event.clientX - pointerStartX) > DRAG_THRESHOLD_PX) {
      pointerMoved = true;
    }
  });

  track.addEventListener('click', () => {
    if (pointerMoved) {
      pointerMoved = false;
      return;
    }

    togglePause();
  });

  root.addEventListener('pointerenter', () => {
    slideshow.hovered = true;
    schedule();
  });

  root.addEventListener('pointerleave', () => {
    slideshow.hovered = false;
    schedule();
  });

  root.addEventListener('focusin', () => {
    slideshow.hovered = true;
    schedule();
  });

  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget as Node | null)) {
      slideshow.hovered = false;
      schedule();
    }
  });

  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(getPreviousPageStart(slideshow.index));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(getNextPageStart(slideshow.index));
    } else if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goTo(getLastPageStart());
    } else if (event.key === ' ' || event.key === 'Spacebar' || event.key === 'Enter') {
      event.preventDefault();
      togglePause();
    }
  });

  track.addEventListener(
    'scroll',
    () => {
      if (slideshow.scrollTimer !== null) {
        window.clearTimeout(slideshow.scrollTimer);
      }

      slideshow.scrollTimer = window.setTimeout(syncFromScroll, 120);
    },
    { passive: true },
  );

  window.addEventListener(
    'resize',
    () => {
      if (slideshow.resizeTimer !== null) {
        window.clearTimeout(slideshow.resizeTimer);
      }

      slideshow.resizeTimer = window.setTimeout(() => {
        cancelTransition();
        slideshow.index = Math.min(slideshow.index, getLastPageStart());
        jumpTo(slideshow.index);
        updateState();
        schedule();
      }, 150);
    },
    { passive: true },
  );

  document.addEventListener('visibilitychange', schedule);

  reducedMotionQuery.addEventListener('change', (event) => {
    slideshow.reducedMotion = event.matches;

    if (slideshow.reducedMotion) {
      slideshow.paused = true;
      cancelTransition();
    }

    updateState();
    schedule();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        slideshow.inView = entries.some((entry) => entry.isIntersecting);
        schedule();
      },
      { threshold: 0.25 },
    );

    observer.observe(root);
  } else {
    slideshow.inView = true;
  }

  root.classList.add('slideshow-ready');
  updateState();
  schedule();
}

function initHomeSlideshows(): void {
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-slideshow]'));

  for (const root of roots) {
    initSlideshow(root);
  }
}

initHomeSlideshows();
