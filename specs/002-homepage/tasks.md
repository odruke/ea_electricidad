# Tasks — 002 Homepage (2026-11-06 revision)

- Status: Implemented — owner visual review and commit PENDING
- Date: 2026-11-04, revised 2026-11-05, revised 2026-11-06
- Related spec: `specs/002-homepage/spec.md`
- Related plan: `specs/002-homepage/plan.md`
- Branch: `feat/002-homepage` (created 2026-11-04)
- Target: owner-managed; no fixed integration branch requirement

Tasks are ordered. Verify each task before marking it complete. Record actual command output and any owner-only visual review; do not claim a check that was not run. The 2026-11-05 revision replaced the previous services panel and four-photo triptych; tasks below describe the current homepage, not the superseded layout.

## Phase 0 — Approval and preflight

- [x] **T2001 — Approve the revised direction.** The owner requested a short, transparent landscape hero over the new `hero.jpg` (Peñón de Calpe), followed by exactly three work categories with dominant photo slideshows and bullet lists, on 2026-11-05. **Done when:** the decisions are recorded in `spec.md` and `plan.md`. **Done — both revised 2026-11-05.**
- [x] **T2002 — Keep the feature branch.** Work stays on `feat/002-homepage`, created 2026-11-04 after `001` was committed. **Done when:** the branch exists without carrying uncommitted `001` changes. **Done.**
- [ ] **T2003 — Confirm per-photo descriptions or accept the fallback.** Ask the owner for one line per category photo and confirmation of the hero alt text. Until then, neutral localized category alt text with `{current}`/`{total}` is used. **Done when:** the owner supplies descriptions or explicitly accepts the fallback. **PENDING owner.**

## Phase 1 — Content model and dictionaries

- [x] **T2101 — Add the work-category data module.** Created `src/lib/home-work.ts` with the three keys (`ilumination`, `electricity`, `climatization`), band tone, stage side, and the exact image paths plus source dimensions. **Done when:** the homepage renders from one typed source and the five service categories are untouched. **Done.**
- [x] **T2102 — Revise the dictionaries.** Added `home.work.categories.*` (title, lead, four bullets, image-alt template) and `home.work.slideshow.*` in `es.ts`, `en.ts`, and `fr.ts`; updated `home.heroImageAlt` to the Peñón view. **Done when:** translation parity passes and no user-facing string is hardcoded. **Done.**
- [x] **T2103 — Remove superseded keys.** Removed `home.jobs.*`, `home.servicesHeading`, and `home.servicesLead` from all three dictionaries after their components were deleted. **Done when:** no source file references a removed key. **Done — grep clean.**
- [x] **T2104 — Keep the canonical service categories.** `services.items` remains exactly the five approved categories; the homepage categories are work groupings only. **Done when:** the unit test still asserts five services and the three homepage groupings. **Done.**

## Phase 2 — Hero

- [x] **T2201 — Rebuild the hero as a full-bleed landscape.** `Hero.astro` now uses `/homepage/hero.jpg` (4898×3265) behind the content with `object-cover`, a `.hero-scrim` layer, and an ~80%-opaque brand-blue copy panel with a yellow edge. **Done when:** the photo is visible around and behind the copy and is never distorted. **Done.**
- [x] **T2202 — Keep the hero short.** `min-h-[33rem] sm:min-h-[31rem] lg:min-h-[28rem]`; H1 capped at `clamp(2.15rem, 3.4vw, 3rem)` with the panel widened to `lg:max-w-[42rem]` so the headline stays two lines. **Done when:** the hero is about half the previous height at 1280 and does not grow to three H1 lines at 1440. **Done — measured 528px at 375, 496px at 768, 448px at 1024/1280, 454px at 1440.**
- [x] **T2203 — Move the three facts to a credential rail.** The 20+ years, IBTB basic, and civil liability facts now sit in a thin full-width rail directly below the hero, with small yellow markers. **Done when:** the rail shows exactly three facts and the hero copy keeps eyebrow, H1, lead, and both actions. **Done.**
- [x] **T2204 — Keep responsive framing and performance attributes.** Hero uses `loading="eager"`, `fetchpriority="high"`, `decoding="async"`, explicit dimensions, localized alt, and responsive `object-position`. **Done when:** the hero is the only eager image and does not shift layout. **Done.**
- [ ] **T2205 — Tune the hero crop.** Current positions: `object-[50%_50%]`, `lg:object-[50%_45%]`; photo visible above the panel and to the right on wide screens. **Done when:** the owner confirms the Peñón and coast stay readable at 375, 768, and 1280. **PENDING owner visual review.**

## Phase 3 — Work categories

- [x] **T2301 — Build the three editorial bands.** Created `WorkCategories.astro` and `WorkCategory.astro`; the homepage renders exactly Iluminación, Electricidad, Climatización in that order. **Done when:** three `h2` sections render, each with a lead and four bullets. **Done.**
- [x] **T2302 — Make the stage dominant and alternate sides.** Stage is `md:col-span-7 lg:col-span-8`; text is `md:col-span-5 lg:col-span-4`. Stage left → right → left, with the copy order flipped at `md` and the stage first in the DOM. **Done when:** the layout alternates at 768 and 1280 and every category shows the stage first on mobile. **Done.**
- [x] **T2303 — Use consistent stage frames.** Every slide uses `aspect-[3/4]` with `object-cover`; images never stretch and the row height is stable. **Done when:** no image changes the section height and focal-point tuning is listed as a review item. **Done.**
- [x] **T2304 — Remove the superseded sections.** Deleted `ServicesPanel.astro` and `WorkGallery.astro`; the homepage no longer renders the circuit-row panel or the four-photo triptych. **Done when:** no source or test references the removed components. **Done.**
- [x] **T2305 — Keep provenance honest.** Alt text describes the work category and photo position only; no location, date, project name, or count is invented. **Done when:** the copy audit is clean. **Done.**

## Phase 4 — Slideshow

- [x] **T2401 — Build the slideshow markup.** Created `WorkSlideshow.astro` with a native horizontal scroller, one slide on mobile and two at `lg`, explicit dimensions, `loading="lazy"`, `decoding="async"`, and localized alt templates. **Done when:** Iluminación has 6, Electricidad 4, and Climatización 5 slides. **Done.**
- [x] **T2402 — Add accessible controls (superseded 2026-11-06).** Added previous, next, and pause/play buttons with localized accessible names, a compact visible counter, and a polite hidden status. The visible controls, counter, and status were removed in T2803. **Done when:** controls were at least 44×44px and the stage had a group label. **Done — removed 2026-11-06.**
- [x] **T2403 — Implement the behavior.** `src/scripts/home-slideshow.ts` provides wrap-around paging, auto-advance only in view and on a visible page, hover/focus pause, keyboard arrows plus Home/End, resize/scroll sync, and reduced-motion default-paused. The button and label behavior was replaced in T2803–T2805. **Done when:** the track clamps cleanly on 4- and 5-image folders. **Done.**
- [x] **T2404 — Degrade without JavaScript.** The track is a native scrollable strip and all images remain in the document; there are no controls in the markup. **Done when:** the no-JS E2E test finds the first images, no controls, and a scrollable track. **Done.**
- [x] **T2405 — Prevent horizontal page overflow.** The scroller is clipped inside the stage with `overflow-x: auto`, snapped, and `overscroll-behavior-x: contain`. **Done when:** document overflow stays zero at 320/375/768/1024/1280/1440 in all locales. **Done — measured 0.**

## Phase 5 — Motion, closing, and calls to action

- [x] **T2501 — Reuse the slide-reveal language.** Category stages reveal from the image side; text and bullets enter upward with a short stagger via `data-reveal` and `home-reveal.ts`. **Done when:** reveals run once and never lock or snap page scrolling. **Done.**
- [x] **T2502 — Adapt the hero load.** The landscape fades/settles while the copy panel slides in slightly; the H1 is visible immediately. **Done when:** no clip mask hides the headline or the Peñón after load. **Done.**
- [x] **T2503 — Verify reduced motion.** Auto-advance starts paused, slides jump without smooth scrolling, and reveals/transforms are disabled. **Done when:** the reduced-motion E2E test sees static, visible content and a paused state. **Done.**
- [x] **T2504 — Keep the compact closing and footer.** The compact blue closing band and three-column footer (contact, hours, service area) remain unchanged, with the business name only in the copyright line. **Done when:** the footer still has exactly three columns and no tagline. **Done.**
- [x] **T2505 — Keep site-wide WhatsApp and call styles.** Green WhatsApp action with the WhatsApp mark and yellow call action with the telephone mark remain on the homepage, services page, and contact page. **Done when:** the E2E action tests pass in all locales. **Done.**

## Phase 6 — Tests and verification

- [x] **T2601 — Extend unit coverage.** Translation parity covers the new keys and removed keys; unit tests assert five service categories, the three homepage categories in order, four bullets each, and intact `{category}`/`{current}`/`{total}` templates. **Done when:** `pnpm test` passes. **Result:** 32/32 passed.
- [x] **T2602 — Rewrite homepage E2E coverage (superseded 2026-11-06).** The suite covers the hero, rail, three categories, two-up/one-up layout, keyboard paging, no-JS fallback, reduced motion, reveals, footer, actions, and axe. The control/counter/status assertions were replaced by the fade, hidden-UI, and pause-state coverage in T2806. **Result:** 38/38 passed at the time; the current suite passes 40/40.
- [x] **T2603 — Verify responsive behavior.** Measured 320, 375, 768, 1024, 1280, and 1440 CSS pixels. **Done when:** no horizontal overflow and the hero stays short. **Verified:** overflow 0 at every width; hero heights 579/528/496/448/448/454px.
- [x] **T2604 — Run axe.** Scanned the revised homepage in `es`, `en`, and `fr` through the E2E suite. **Done when:** no serious or critical violations remain. **Result:** all three axe tests passed.
- [x] **T2605 — Run the local gates.** Ran the full suite after the final H1/panel adjustments. **Done when:** every gate passes and the actual results are recorded. **Result:** `pnpm check` 0 errors; `pnpm lint` clean; `pnpm format:check` clean; `pnpm test` 32/32; production build 17 pages; `pnpm test:e2e` 38/38.
- [x] **T2606 — Regenerate review screenshots.** Captured hero, all three categories, footer, and full page at 375/768/1280 plus EN/FR full pages at 1280 in `/tmp/opencode/ea-002-screenshots`; stale pre-refactor screenshots were removed. **Done when:** the files are available and owner review is requested. **Done.**

## Phase 7 — Documentation and handoff

- [x] **T2701 — Update the spec and plan.** Rewrote `spec.md` and `plan.md` for the landscape hero, credential rail, three-category body, two-up slideshow, and current measurements. **Done when:** the documents agree with the implementation. **Done.**
- [x] **T2702 — Rewrite this task file.** Replaced the superseded 2026-11-04 task list with the current revision, marked completed work, and isolated the owner-only items. **Done when:** the file reflects the current implementation. **Done.**
- [x] **T2703 — Update `MEMORY.md` and `AGENTS.md`.** Recorded the revised homepage, real-photo provenance, checks run, and PENDING gaps; kept `MEMORY.md` within the ~50-line budget. **Done when:** both files reflect the actual state. **Done.**
- [ ] **T2704 — Complete the owner visual review.** The owner reviews the hero crop, the alternating category layouts, the two-up desktop stage, the 3:4 photo crops, and the slideshow motion and hidden pause. **Done when:** the owner approves or the remaining items are explicitly marked PENDING. **PENDING owner.**
- [x] **T2705 — Hand off.** Report changed files, checks actually run, and remaining limitations. **Done when:** the summary is delivered and no commit/push has been made. **Done.**
- [ ] **T2706 — Owner commits and deploys.** The owner commits `feat/002-homepage` and rebuilds/deploys when ready. **Done when:** the owner performs the action; the agent does not. **PENDING owner.**

## Phase 8 — 2026-11-06 motion revision

- [x] **T2801 — Slow the reveal (superseded by T2901).** Set opacity/translate to 800ms and clip-path to 1000ms with `cubic-bezier(0.22, 1, 0.36, 1)`, widened the bullet stagger to 90ms steps, and raised the reveal timeout to 1700ms. **Superseded by T2901 after the owner's visual review.**
- [x] **T2802 — Add the slideshow fade handoff.** Programmatic advances fade the current page out to the left, jump invisibly, and fade the next page in from the right (450ms + 650ms), with a decode wait capped at 250ms. **Verified:** the keyboard E2E test records `is-leaving` and the `is-entering` offset; swipes remain immediate.
- [x] **T2803 — Remove the visible slideshow UI.** Deleted the previous/next/pause buttons, the image counter, and the live status from the markup, styles, script, and dictionaries. **Verified:** the E2E suite finds none of the removed selectors; the stage contains only the labelled track and images.
- [x] **T2804 — Keep the hidden pause mechanism.** Click/tap toggles pause unless the pointer dragged; Space/Enter toggles pause when the track is focused; hover/focus and off-screen pause still work; the group label now mentions the Space key. **Verified:** E2E click/Space tests pass.
- [x] **T2805 — Slow the cadence.** Set the auto-advance interval to 8000ms. **Verified:** `data-interval="8000"` and the 8000ms fallback; reduced motion still starts paused.
- [x] **T2806 — Update tests.** Replaced the controls/counter E2E test with fade-class, hidden-UI, and pause-state coverage; updated the reduced-motion and no-JS tests; updated the i18n unit test for the removed keys; added a motion-settle wait to the axe test so a mid-reveal contrast blend is not reported. **Verified:** `pnpm test` 32/32 and `pnpm test:e2e` 40/40.
- [x] **T2807 — Verify responsive and accessibility.** The automated overflow tests pass at 320/375/768/1280 in all locales; the 1024/1440 measurements are unchanged from 2026-11-05; axe is clean in `es`/`en`/`fr`. **Verified:** no horizontal overflow and no serious or critical axe violations.
- [x] **T2808 — Update docs.** Reflected the motion revision in `MEMORY.md` and `AGENTS.md` and removed the stale control/counter wording from the spec, plan, and task. **Verified:** the state and PENDING review notes are accurate.
- [ ] **T2809 — Owner visual review (partially completed 2026-11-06).** The owner reviewed the reveals and asked for slower motion, a fixed Iluminación opening pair, and no repeated photos on two-up pages; those changes are T2901–T2905. Final approval remains PENDING.

## Phase 9 — 2026-11-06 second motion revision

- [x] **T2901 — Slow the reveal further.** Opacity/translate now take 1500ms and the clip mask 1800ms on `cubic-bezier(0.4, 0, 0.2, 1)`; the reveal timeout is 2400ms. The gentler curve spreads the movement across the full duration instead of front-loading it. **Verified:** computed transition durations are asserted in E2E; `is-revealed` still arrives inside the test timeout.
- [x] **T2902 — Fix the Iluminación opening pair.** Reordered `workCategories.ilumination.images` so `skyscraper1.jpg` and `skyscraper2.jpg` come first. **Verified:** E2E shows `skyscraper1` at 375 and `skyscraper1` + `skyscraper2` at 1280.
- [x] **T2903 — Advance by a full page.** The 8s timer and Arrow Left/Right now move by the visible count (two at `lg`, one below). After a manual swipe between pages, the next turn skips any page that would repeat a visible photo. **Verified:** E2E advances Iluminación through three disjoint pairs.
- [x] **T2904 — Handle the odd Climatización tail.** Added `data-odd` and a trailing flex spacer at `lg` so the track can reach the fifth image; the final page shows that image alone at the start edge instead of repeating the fourth. **Verified:** E2E reaches the lone final slide without a duplicate.
- [x] **T2905 — Update coverage and docs.** Added the opening-pair, page-advance, lone-slide, and reveal-duration assertions; raised the axe motion-settle cap to 3s; recorded the revision in the spec, plan, memory, and agent instructions. **Verified:** 32/32 unit tests and the homepage E2E suite pass.
- [ ] **T2906 — Owner visual review of the revision.** The owner reviews the slower reveal, the `skyscraper1`/`skyscraper2` opening, and the single-image tail on Climatización. **Done when:** approved or explicitly left PENDING. **PENDING owner.**
- [ ] **T2907 — Owner commit and deploy.** The owner commits the branch and rebuilds the stack when ready; the agent does not commit, push, or deploy. **PENDING owner.**

## Acceptance criteria verification

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Spec, plan, and task agree and record the 2026-11-06 revision | Verified — all three updated |
| 2 | Hero uses `hero.jpg` behind a translucent scrim/panel with the Peñón visible, no distortion | Implemented — crop approval PENDING owner |
| 3 | Hero is about half its previous height and keeps eyebrow, H1, lead, both actions, and the rail | Verified — 448px at 1280 |
| 4 | Exactly three categories in order, each with a stage, lead, and four bullets | Verified — unit + E2E |
| 5 | Stage shows two images at `lg` and one below; sides alternate | Verified — 2-up at 1280, 1-up at 375 |
| 6 | Iluminación opens on `skyscraper1` (mobile) and `skyscraper1` + `skyscraper2` (desktop) | Verified — E2E at 375 and 1280 |
| 7 | Slideshow uses a right-to-left fade handoff, advances a full page, never repeats a photo across two-up pages, and has no visible controls/counter | Verified — E2E |
| 8 | Auto-advance only in view/visible at 8s, pauses on hover/focus/click/Space, off under reduced motion | Verified — E2E; visual timing approval PENDING owner |
| 9 | No-JS: content visible, first images present, track scrollable, no controls | Verified — E2E |
| 10 | No horizontal overflow at 320/375/768/1024/1280/1440 in all locales | Verified — measured 0 |
| 11 | Five approved service categories unchanged on `/services/`; no sixth service | Verified — unit test and source audit |
| 12 | All new copy in es/en/fr; parity passes; no hardcoded user-facing strings | Verified — 32 unit tests |
| 13 | H1, metadata, canonical, hreflang, sitemap, robots unchanged | Verified — foundation E2E and build output |
| 14 | Axe clean, keyboard works, focus visible, CTA contrast retained | Verified — axe in es/en/fr |
| 15 | No backend, form, email, upload, analytics, cookie, CMS, route, or runtime dependency added | Verified — source and package audit |
| 16 | `pnpm validate` and `pnpm test:e2e` pass; results recorded | Verified — see T2605, T2806, T2905 |
| 17 | Owner reviews hero, categories, opening pair, slower reveals, odd tail, and fade handoff | PENDING owner |
| 18 | `MEMORY.md` and `AGENTS.md` reflect the revised state and gaps | Verified — updated 2026-11-06 |

## Phase 10 — 2026-11-21 change request (logo, RBET credential, category pictogram row, urgent-work copy)

- Status: implemented (validated 2026-11-21, VERIFICATION.md)
- Date: 2026-11-21
- Follows: `plan.md` §14 (approved 2026-11-21, DECISIONS G-2). Requirements: spec R60–R78, the changed R1, R5, R7, R9, R10, R13, R43, R46–R48, R51, R55–R58, acceptance criteria 1, 16, 18–26, and goals G9–G11.
- Rules for this phase:
  - One task at a time, in this order. A task is done only when its "Done when" checks were actually run and passed; record the real output in the task's note.
  - Tests marked "first" are written and run red before the code they cover.
  - Nothing in `.tmp/` is committed (`.tmp/` is git-ignored as "Local tooling"). Agents do not run `git add`, `git commit` or `git push`.
  - If a check fails for a reason the plan does not cover, stop and report; do not change a §14 value to make it pass.

Shared commands, used by name in the tasks below (plan §14.8; in agent shells without `pnpm` on `PATH`, use the `node_modules/.bin/*` form):

- **Gate:** `pnpm validate`, or `node_modules/.bin/eslint . && node_modules/.bin/prettier --check . && node_modules/.bin/astro check && node_modules/.bin/vitest run && node_modules/.bin/astro build`.
- **E2E run** (preview-daemon workaround plus P-17):
  1. `node_modules/.bin/astro build`
  2. `node_modules/.bin/astro preview --host 127.0.0.1 --port 4321`
  3. `BASE_URL=http://127.0.0.1:4321 node_modules/.bin/playwright test -c .tmp/playwright.chrome.config.mjs <spec files, or none for the full suite>`
  4. `node_modules/.bin/astro preview stop`

- [x] **T3001 — Add the test-support helpers and the local Chrome config.** R55 (supports the R60, R61, R62, R67 and R68 checks)
  - Depends on: none
  - Files: `tests/support/motion.ts` (new), `tests/support/visible-image.ts` (new), `tests/support/png.ts` (new), `tests/unit/test-support.test.ts` (new), `tests/e2e/foundation.spec.ts` (import only); local, not committed: `.tmp/playwright.chrome.config.mjs`.
  - Steps:
    1. First, write `test-support.test.ts`: `containRect` for a width-limited, a height-limited and an exact fit (centred result); `readPngInfo` on a synthetic minimal PNG built in the test (signature, IHDR, IEND) returns width, height, colour type and the chunk list; it throws on a bad signature. Run it red.
    2. Implement `containRect` and `readPngInfo` as in §14.3 (IHDR and chunk types only; nothing is decoded).
    3. Move `waitForMotion` unchanged from `foundation.spec.ts` into `motion.ts`, add `waitForFonts` (waits for `document.fonts.ready`), and import `waitForMotion` in `foundation.spec.ts`. No other change to that spec.
    4. Create `.tmp/playwright.chrome.config.mjs` as P-17 states: `testDir: '../tests/e2e'`, `channel: 'chrome'`, base URL from `BASE_URL`, no `webServer`.
  - Done when:
    - `node_modules/.bin/vitest run tests/unit/test-support.test.ts` failed before step 2 and passes after it;
    - the E2E run on `tests/e2e/foundation.spec.ts` passes with the same test count as before the move;
    - `git check-ignore .tmp/playwright.chrome.config.mjs` prints the path;
    - the Gate passes.

- [x] **T3002 — Prepare the brand assets (Algorithm A, steps 0–5) and declare them in `brand.ts`.** R60, R61, R67, R68; AC19 (files)
  - Depends on: T3001
  - Files: `src/config/brand.ts` (new), `tests/unit/brand.test.ts` (new), `public/brand/logo-blue.svg`, `public/brand/logo-white.svg`, `public/brand/icon-32.png`, `public/brand/apple-touch-icon.png`, `public/brand/share.png` (all new); local, not committed: `.tmp/brand-assets.py`.
  - Steps:
    1. First, write `brand.test.ts` as in §14.8: `logoHeightForWidth` and both `isUndistorted*` helpers with ±1 edge cases; each `public/brand/*.png` exists and its IHDR (read with `readPngInfo`) matches `brandAssets`; both display variants pass `isUndistortedFile` and are colour type 3; the white variant is exactly 833×746; the blue file is < 151,058 B and the white file < 150,503 B, compared with these baseline constants, not by reading the cut-outs (they are deleted in T3009, and P-20 keeps the preview path out of tests); both icons are colour type 2 with no `tRNS` chunk; the share image is 1200×630 with no `tRNS`; every `mark` passes `isUndistortedFile`, fits inside its canvas and is ≤ 833×746. Run it red.
    2. Write `src/config/brand.ts` exactly as §14.3.
    3. Write `.tmp/brand-assets.py` as Algorithm A steps 0–5 (premultiplied BOX resize, FASTOCTREE 256 colours without dither, `frame_ok`, every assert) and run it with system `python3` and Pillow 12.1.1.
    4. If any assert fails, stop and report (step 6). Never clean, trim or recolour the mark.
    5. Keep `public/logo-preview/`: step 8 (deletion) is T3009. Do not wire any component yet.
  - Done when:
    - the script's printed output is recorded in this task's note: the margin m, and the pixel size and bytes of all five files;
    - `node_modules/.bin/vitest run tests/unit/brand.test.ts` failed before steps 2–3 and passes after them;
    - `git check-ignore .tmp/brand-assets.py` prints the path;
    - `ls public/logo-preview/` still lists both cut-outs;
    - the Gate passes.

- [x] **T3003 — Add the row order and the category section ids.** R70, R71, R75
  - Depends on: none
  - Files: `src/lib/home-work.ts`, `tests/unit/home-work.test.ts` (new), `src/components/home/WorkCategory.astro`.
  - Steps:
    1. First, write `home-work.test.ts`: `categoryRowOrder` equals `['electricity', 'ilumination', 'climatization']` and is a permutation of the `workCategories` keys; `workSectionId(key)` is `work-section-${key}`, the three values are unique, and none equals `work-${key}`. Run it red.
    2. Add `categoryRowOrder` and `workSectionId()` to `home-work.ts` (§14.3).
    3. Add `id={workSectionId(key)}` and `scroll-mt-20` to the category `<section>`; the heading ids `work-{key}` stay.
  - Done when:
    - `node_modules/.bin/vitest run tests/unit/home-work.test.ts` failed before step 2 and passes after it;
    - after the Gate's build, `grep -o 'id="work-section-[a-z]*"' dist/es/index.html` prints the three ids;
    - the Gate passes.

- [x] **T3004 — Change the credential, urgent-note and contact-lead copy.** R13, R43, R46, R47, R76, R77, R78; AC22, AC24
  - Depends on: T3001
  - Files: `src/i18n/messages/es.ts`, `src/i18n/messages/en.ts`, `src/i18n/messages/fr.ts`, `tests/unit/i18n.test.ts`, `tests/e2e/homepage.spec.ts` (rail text), `tests/e2e/site-brand.spec.ts` (new; copy checks only for now).
  - Steps:
    1. First, extend `i18n.test.ts`: the exact §14.6 values of `home.facts.authorization`, `contact.hoursNote` and `contact.lead` in each locale; no dictionary string value contains `IBTB`; `hoursNote` contains no digit and no weekday word (lunes–domingo, Monday–Sunday, lundi–dimanche). Keep the parity, five-services and 24/7 checks. Run it red.
    2. Change the three values in each locale; no key is added or removed. The en and fr values carry `// PENDING owner review (R13/R76/R77)`.
    3. E2E: in `homepage.spec.ts`, the rail shows the exact R13 text in each locale. In the new `site-brand.spec.ts`, the footer on `/`, `/services/`, `/contact/`, `/legal/` and `/404/` shows the exact `hoursNote`, and the contact page shows the exact `lead` and `hoursNote`, in es, en and fr.
  - Done when:
    - `node_modules/.bin/vitest run tests/unit/i18n.test.ts` failed before step 2 and passes after it;
    - the E2E run on `tests/e2e/homepage.spec.ts tests/e2e/site-brand.spec.ts` passes;
    - `grep -rn "IBTB" src` prints nothing;
    - the Gate passes.

- [x] **T3005 — Make the hero logo final and move the credential rail out of the hero.** R7 (rail placement), R9, R43 (no logo key), R62 and R63 (markup), R64, R65 (prop-free hero, preview page removed); AC20 (part)
  - Depends on: T3002
  - Files: `src/components/home/Hero.astro`, `src/components/home/CredentialRail.astro` (new), `src/pages/[locale]/index.astro`, `tests/e2e/homepage.spec.ts`, `src/pages/[locale]/logo-preview.astro` (deleted).
  - Steps:
    1. First, add to `homepage.spec.ts` and run red: exactly one hero logo is visible at 320, 375, 390, 639, 640, 768, 1023, 1024, 1280 and 1440; it is `/brand/logo-blue.svg` below 1024 and `/brand/logo-white.svg` from 1024; both `<img>` have `alt=""` inside an `aria-hidden="true"` wrapper; under default motion the wrapper's `animation-name` equals the panel's, and under reduced motion it is `none`; `[data-testid="credential-rail"]` follows the hero; the no-JS test also finds the compact logo visible.
    2. Rewrite `Hero.astro` as §14.5: props `{ locale }` only; remove `LogoVariant`, `logoVariant`, the TEMPORARY comment and the circle, plain and plate variants; sources and dimensions from `brandAssets`; compact wrapper `hero-copy mb-4 flex lg:hidden` with `h-28 w-auto sm:h-36`; `lg` wrapper `hero-copy relative hidden lg:block` with the `absolute inset-0 h-full w-full object-contain` image; grid `lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-10` with `data-testid="hero-grid"`; `data-testid="hero-panel"` on the unchanged panel; `pt-16` kept (P-21); both logos eager (P-11).
    3. Move the rail markup verbatim into `CredentialRail.astro`. `index.astro` renders `Hero`, `CredentialRail`, `WorkCategories`, closing (T3007 inserts the row).
    4. Last, delete `src/pages/[locale]/logo-preview.astro`. The hero no longer needs the prototype, and the page passes the removed `logoVariant` prop, so it would fail `astro check` if kept.
  - Done when:
    - the step-1 tests failed before step 2, and the E2E run on `tests/e2e/homepage.spec.ts` (all of it, existing tests included) passes after step 4;
    - `grep -rn "logoVariant" src` prints nothing;
    - after the Gate's build, `ls dist/es` shows no preview directory;
    - the Gate passes.

- [x] **T3006 — Add the hero geometry and display-size checks (Algorithms B–D).** R10, R12 (impacted), R61, R62, R63; AC20
  - Depends on: T3005
  - Files: `tests/e2e/homepage.spec.ts`. Only if the Algorithm B guard fails: `public/brand/logo-white.svg`, `src/config/brand.ts`, `tests/unit/brand.test.ts`.
  - Steps (every measurement after `waitForFonts` and `waitForMotion`; visible image = `containRect`, Algorithm D-1):
    1. Compact logo: visible height 108–116 at 320, 375, 390 and 639, and 140–148 at 640, 768 and 1023; gap to the panel 12–24; left edge within 1 px of the panel's left edge; `isUndistortedRender`.
    2. From 1024 (1024, 1280, 1440): track ratio 1.3–1.5 and `columnGap` 36–44 (D-4); visible height = panel height ± 2, or visible width = column width ± 2 with vertical centring ± 2; never taller than the panel, wider than the column or outside the hero (2 px tolerance).
    3. Hero-height delta ≤ 2 at 1024 and 1280 in es, en and fr (D-2).
    4. Growth below 1024 ≤ visible logo height + gap + 1 at 375, 390 and 768 (D-3); log the values at 375 and 390.
    5. Algorithm B guard (R61): measure the largest visible white logo at 1024, 1280 and 1440 in es, en and fr, and assert that 2× it exceeds 833×746 (so the 833×746 file is the cap). Measure the largest visible blue hero logo below 1024 and assert that `logo-blue.svg` is 2–2.5× it. (T3008 adds the header to the blue measurement.)
    6. Keep the existing "≤ 540 at 1280" hero test.
    7. IF the white guard fails, THEN follow Algorithm B: re-run Algorithm A step 2 with `resize(CUT_WHITE, ceil(2.25 × measured width))`, update `brandAssets.logoWhite` and `brand.test.ts`, and record it. The cut-outs still exist at this point. Any other failing check: stop and report.
  - Done when:
    - the E2E run on `tests/e2e/homepage.spec.ts` passes in es, en and fr, including the Algorithm B guard;
    - this task's note records the largest visible white size per locale, the largest blue hero size, the hero heights at 375 and 390 with and without the compact logo, and the ≥1024 deltas;
    - the Gate passes.

- [x] **T3007 — Add the category pictogram row.** R1, R5, R7, R43 (no new key), R48, R70, R71, R72, R73, R74, R75; AC23
  - Depends on: T3003, T3005
  - Files: `src/components/home/CategoryPictogram.astro` (new), `src/components/home/CategoryRow.astro` (new), `src/pages/[locale]/index.astro`, `tests/e2e/homepage.spec.ts`.
  - Steps:
    1. First, add to `homepage.spec.ts` and run red:
       - DOM and visual order: hero, row, rail, first category;
       - three links in R70 order; each label equals the matching category `h2` text on the page; no heading and no `data-reveal` inside the row;
       - each pictogram is `svg[aria-hidden="true"][focusable="false"]` with no `style` attribute, computed colour `rgb(250, 217, 81)`, on a band background of `rgb(0, 32, 143)`;
       - at 320, 360, 375, 390, 768, 1024 and 1280, and at 640×400 (200% zoom of 1280×800), in es, en and fr: zero document overflow and label integrity (Algorithm D-5); one column at 320, three across from 360;
       - at 390×844 and 1280×800: Tab from the hero's services action reaches the three row links in order; the focused link has a solid outline of at least 2 px in `rgb(250, 217, 81)`; each link box is at least 44×44; Enter sets the hash to `#work-section-{key}` and, once `scrollY` is stable, the section's top is ≥ the header's bottom − 0.5 and < `innerHeight` (Algorithm D-6); the destination stage gains `is-visible`; under reduced motion the jump is instant;
       - no-JS: the row is visible, and clicking a row link puts its section's top in view.
    2. `CategoryPictogram.astro`: three hand-drawn inline SVGs as §14.5 (wall socket, pendant lamp, split unit), with the listed attributes and presentation attributes only. Copy no path from any icon set.
    3. `CategoryRow.astro` as the §14.5 markup. Labels come from `t.home.work.categories[key].title`; no new dictionary key (P-15); no script and no `data-reveal` (P-14).
    4. `index.astro` order: `Hero`, `CategoryRow`, `CredentialRail`, `WorkCategories`, closing.
  - Done when:
    - the step-1 tests failed before step 2, and the E2E run on `tests/e2e/homepage.spec.ts` passes after step 4;
    - `grep -nE 'data-reveal|<script|<style|style=' src/components/home/CategoryRow.astro src/components/home/CategoryPictogram.astro` prints nothing;
    - `git diff --quiet src/styles/global.css` exits 0 (no new CSS or gradient, R1);
    - the Gate passes, including the unchanged i18n parity test.

- [x] **T3008 — Switch the header, the icons and the share image to the new logo.** R51 (share URL only), R60 (canvas check), R61 (header size), R66, R67, R68, R69, R72 (same-origin); AC21
  - Depends on: T3002, T3004, T3006
  - Files: `src/components/layout/Header.astro`, `src/layouts/BaseLayout.astro`, `src/components/seo/Seo.astro`, `tests/unit/seo.test.ts`, `tests/e2e/site-brand.spec.ts`, `tests/e2e/homepage.spec.ts` (R61 header measurement).
  - Steps:
    1. In `seo.test.ts`, change the fixture `/logo.jpg` to `/brand/share.png` (P-18).
    2. First, add to `site-brand.spec.ts` and run red:
       - on `/`, `/services/`, `/contact/`, `/legal/` and `/404/` in es, en and fr: the header logo `src` is `/brand/logo-blue.svg` with `alt=""`, 44 ± 0.5 px tall, `isUndistortedRender`, no border radius; the header is 65 px tall; the home link's accessible name is the business name;
       - Algorithm D-7 at 320, 375, 390, 768, 1024 and 1280 (logo width + link `column-gap` ≤ 56), logging the name's `scrollWidth − clientWidth` at 375 and 390; no overflow at 320 on the services and contact pages;
       - canvas: each display variant drawn at natural size has alpha 0 at the four corners and on every frame pixel; every pixel of both icons has alpha 255;
       - `GET` each `/brand/*` file returns 200 with `image/png`;
       - every request made by the homepage is same-origin.
       In `homepage.spec.ts`, add the 44 px header logo to the R61 blue largest-size measurement.
    3. `Header.astro` as §14.5: `brandAssets.logoBlue`, `h-11 w-auto shrink-0`, no `rounded`, no fixed width, link gap `gap-1.5` (P-12).
    4. `BaseLayout.astro`: replace the `/logo.jpg` icon link with the 32×32 icon and apple-touch links, values from `brandAssets`.
    5. `Seo.astro`: `absoluteAssetUrl(env.SITE_URL, brandAssets.share.src)`.
  - Done when:
    - `node_modules/.bin/vitest run tests/unit/seo.test.ts` passes;
    - the step-2 tests failed before step 3, and the E2E run on `tests/e2e/site-brand.spec.ts tests/e2e/homepage.spec.ts` passes after step 5;
    - `grep -rn "/logo.jpg" src tests` prints nothing, and `ls public/logo.jpg public/logo2.jpeg` lists both files (R69);
    - this task's note records the name overflow at 375 and 390;
    - the Gate passes.

- [x] **T3009 — Delete the remaining preview artifacts and audit the build output.** R51, R55, R56 (inline audit), R65, R67, R68, R72, R78; AC19, AC21, AC22
  - Depends on: T3006, T3007, T3008
  - Files: `public/logo-preview/` (deleted), `docs/logo-preview/` (deleted), `tests/e2e/build-output.spec.ts` (new), `tests/e2e/site-brand.spec.ts` (preview 404).
  - Steps:
    1. First, write `build-output.spec.ts`, reading `dist/` relative to the test file:
       - no `<script>` without `src`, no `<style>` element and no `style=` attribute in any HTML page;
       - no `IBTB`, no `application/ld+json`, no `logo[-_]preview` path in any page, and no file or directory in `dist/` whose path matches that pattern;
       - every HTML page has exactly one `rel="icon"` link to `/brand/icon-32.png` with `sizes="32x32"`, one `apple-touch-icon` link to `/brand/apple-touch-icon.png`, and no icon link to `/logo.jpg`;
       - the `og:image` and `twitter:image` paths exist in `dist/`;
       - the sitemap's URLs are exactly es, en and fr × `/`, `/services/`, `/contact/`.
       In `site-brand.spec.ts`, `/{es,en,fr}/<preview path>/` returns 404, with the path built so the literal never appears in the file (P-20).
    2. Run the E2E run on both files. The only expected failure is the preview-file assertion, because `public/logo-preview/` still ships. Any other failure belongs to an earlier task: stop and report.
    3. Confirm T3006 is checked and its Algorithm B guard passed. Then delete `public/logo-preview/` (Algorithm A step 8; the cut-outs cannot be recovered afterwards) and `docs/logo-preview/` (D-24).
  - Done when:
    - after a fresh build, the E2E run on `tests/e2e/build-output.spec.ts tests/e2e/site-brand.spec.ts` passes;
    - `grep -rn "logo-preview" src public tests docs --exclude-dir=learning` prints nothing;
    - `test ! -e public/logo-preview && test ! -e docs/logo-preview` exits 0;
    - `node_modules/.bin/vitest run tests/unit/brand.test.ts` still passes;
    - the Gate passes.

- [x] **T3010 — Verify the change request and collect the results for `VERIFICATION.md`.** R55, R56, R57 (report), R58, R69 (report); AC1, AC16, AC18, AC25, AC26
  - Depends on: T3001–T3009
  - Files: none in the repository. Screenshots go to the implementer's session scratchpad directory, never to `docs/` or anywhere in the repository.
  - Steps:
    1. Run the Gate. Record each sub-step's result (lint, format, `astro check` errors, unit test count, built page count).
    2. Run the full E2E run (no spec filter, `-c .tmp/playwright.chrome.config.mjs`, P-17). Record the pass, fail and skip counts, the axe results in es, en and fr, and the browser and version used.
    3. Run the §14.8 greps and record their output:
       - `grep -rn "logo-preview" src public tests docs --exclude-dir=learning` (expect nothing);
       - `grep -rn "/logo.jpg" src tests` (expect nothing);
       - `grep -rln "IBTB" dist` (expect nothing);
       - `grep -rln "/logo.jpg" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist`: the full list of remaining mentions for the R69 report.
    4. Save homepage screenshots at 390, 768, 1024 and 1280 in es, en and fr (full page plus the hero, the row and the header) in the session scratchpad. Record their absolute paths. Do not judge them: the R58 list in §14.8 goes to the owner as PENDING.
    5. `git status --short`: confirm that nothing is committed, that `.tmp/` does not appear, and that the only new binaries are the five `public/brand/*.png` files.
    6. Collect for `VERIFICATION.md` (the orchestrator writes it, R56, AC25): every command with its actual output; the measured values recorded in T3002, T3006 and T3008; the remaining `/logo.jpg` mentions; what was not run and why (Docker stack, owner review, the en/fr wording that is PENDING); and, under "For the documentation", the exact `AGENTS.md` before/after text for the credential, the urgent-work rule, the logo line and the current state (R57, AC18).
  - Done when:
    - every command in steps 1–5 was run and its actual output is in the report;
    - any failed or skipped check is listed with its reason;
    - the twelve screenshots (or more) exist at the recorded scratchpad paths, and none was added to the repository;
    - nothing was committed.

### Requirement coverage (Phase 10)

| ID | Tasks |
|---|---|
| G9 | T3002, T3005, T3006, T3008 |
| G10 | T3003, T3007 |
| G11 | T3004 |
| R1 | T3007 (no CSS change), T3010 (owner review) |
| R5 | T3007 |
| R7 | T3005 (rail out of the hero), T3007 (final order) |
| R9 | T3005 |
| R10 | T3006 |
| R12 (impacted) | T3006 (growth cap), T3010 (owner review) |
| R13 | T3004 |
| R43 | T3004 (values), T3005 (no logo key), T3007 (no row key) |
| R46 | T3004 |
| R47 | T3004, T3009 |
| R48 | T3007 |
| R51 | T3008 (share URL only), T3009 (sitemap set, no JSON-LD), T3010 |
| R55 | T3001, T3004, T3005, T3006, T3007, T3008, T3009 |
| R56 | T3009 (inline audit), T3010 |
| R57 | T3010 (report; the orchestrator writes `MEMORY.md`, the owner applies `AGENTS.md`) |
| R58 | T3010 (screenshots; owner review PENDING) |
| R60 | T3002 (files), T3008 (canvas frame check) |
| R61 | T3002 (cap and bytes), T3006 (Algorithm B guard), T3008 (header size) |
| R62 | T3005, T3006 |
| R63 | T3005, T3006 |
| R64 | T3005 |
| R65 | T3005 (prop-free hero, page deleted), T3009 (assets, screenshots, audit, 404, grep) |
| R66 | T3008 |
| R67 | T3002, T3008, T3009 |
| R68 | T3002, T3008, T3009 |
| R69 | T3008, T3010 |
| R70 | T3003, T3007 |
| R71 | T3003, T3007 |
| R72 | T3007, T3008 (same-origin), T3009 (no style or script) |
| R73 | T3007 |
| R74 | T3007 |
| R75 | T3003, T3007 |
| R76 | T3004 |
| R77 | T3004 |
| R78 | T3004, T3009 |
| AC1 | This section; T3010 |
| AC16 | T3010 |
| AC18 | T3010 |
| AC19 | T3002, T3006, T3009 |
| AC20 | T3005, T3006 |
| AC21 | T3008, T3009 |
| AC22 | T3004, T3009 |
| AC23 | T3007 |
| AC24 | T3004 |
| AC25 | T3009, T3010 |
| AC26 | T3010 |
| Unchanged R2–R4, R6, R8, R11, R14–R42, R44, R45, R49, R50, R52–R54, R59 | T3010 (regression: existing unit and e2e suites, axe in es, en and fr) |
