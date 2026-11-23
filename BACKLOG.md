# BACKLOG.md — Known code issues

Problems found in the code review of 2026-11-10 (after `5edbb07`). None blocks the current
site. Each fix needs the owner's go-ahead; remove an entry once it is fixed and verified.

## Medium

### B1. Hero image is too heavy for mobile

- Where: `src/components/home/Hero.astro`, `public/homepage/hero.jpg` (2.0 MB, 4898×3265).
- Problem: the hero loads eagerly with `fetchpriority="high"` on every device, so the homepage's
  first paint (LCP) waits on a 2 MB download. `public/homepage/hero.webp` exists (1.28 MB, same
  resolution, quality ~92) but is not used yet and is still too large.
- Fix: export the hero at about 1920 px wide, WebP quality ~75 (target ≤ 300 KB; a test export
  gave ~260 KB), and point `Hero.astro` at it with matching `width`/`height`. Optionally add an
  ~800 px variant (~50 KB) through `srcset`/`sizes` for phones.
- Implication: a single resized file keeps the 002 decision "no image-optimization pipeline";
  `srcset` or Astro `<Image>` changes that decision and needs a plan note. Owner reviews the crop.

## Low

### B2. Unused asset ships in the build

- Where: `public/worker1.jpg` (172 KB), referenced nowhere.
- Fix: delete it, or keep it for a future page with a note. No runtime effect.

### B3. Slideshow uses one flag for hover and keyboard focus

- Where: `src/scripts/home-slideshow.ts`, the `pointerenter`/`focusin` handlers (`slideshow.hovered`).
- Problem: with keyboard focus on a track, a mouse pointer passing over and leaving the
  slideshow sets `hovered = false` and autoplay resumes while the track is still focused.
  Click/tap pause and resume work correctly (checked in a browser on 2026-11-10).
- Fix: track `hovered` and `focused` separately; `canAutoplay()` requires both false. Add an
  e2e test: focus track, move the mouse in and out, assert no advance.

### B4. Slideshow re-syncs on every window resize

- Where: `src/scripts/home-slideshow.ts`, the `window` `resize` handler.
- Problem: mobile Safari fires `resize` when its toolbar collapses during vertical scroll; the
  handler cancels an in-flight fade and snaps the track.
- Fix: store the last `track.clientWidth` and act only when it changes (or use a
  `ResizeObserver` on the track).

### B5. Stale image-wait promise can run a second transition

- Where: `src/scripts/home-slideshow.ts`, `goTo` (`waitForImage(...).then`).
- Problem: if a transition is cancelled (pointerdown) and a new one starts within the 250 ms
  image wait, the old promise sees `transitioning === true` and runs its fade in parallel; a
  brief visual glitch and overlapping timers.
- Fix: increment a transition id in `goTo`/`cancelTransition` and ignore callbacks whose id is
  stale.

### B6. Floating Caddy base image tag

- Where: `Dockerfile` (`FROM caddy:2-alpine`, `web` target).
- Problem: rebuilds silently pick up new Caddy versions.
- Fix: pin an exact tag (e.g. `caddy:2.x.y-alpine`) and bump it deliberately. Owner verifies
  with `make build && make up && make smoke`.

### B7. SEO details on 404 pages and social cards

- Where: `src/components/seo/Seo.astro`.
- Problem: `noindex` 404 pages still emit canonical and hreflang alternates; `twitter:card` is
  `summary_large_image` while the image is the small square logo.
- Fix: skip canonical/alternates when the page is a 404; use `twitter:card` `summary` until a
  proper 1200×630 social image exists. Update `tests/unit/seo.test.ts` or e2e as needed.

### B9. Brand unit tests still expect the old PNG logos

- Where: `tests/unit/brand.test.ts` (7 failing tests since 2026-11-22).
- Problem: the owner replaced the logos with SVGs (`brandAssets.logoBlue/logoWhite` now point
  to `.svg`), but the tests still read them as PNGs (IHDR, colour type) and check the 833×746
  cut-out ratio; the icon tests also fail on the new icon files. `pnpm validate` is red.
- Fix: rewrite the logo tests for SVG (file exists, `viewBox` ratio matches the declared
  width/height) and re-check the icon expectations against the owner's files; align spec 002
  R60/R61 through `/ssd-change 002-homepage`.
