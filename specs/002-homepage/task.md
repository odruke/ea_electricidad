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
