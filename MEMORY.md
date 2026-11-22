# MEMORY.md — Project Memory

Keep concise (~50 lines). Update after meaningful work and remove obsolete information. Permanent rules live in `AGENTS.md`.

## Current State

- `001-project-foundation` and `002-homepage` are committed up to `5edbb07` on `feat/002-homepage`. The owner reviews, commits and deploys. The owner staged the config dotfiles on 2026-11-10; they are not committed yet.
- **Spec 002 change request 2026-11-21: implemented and validated (APPROVED, 0 fix rounds; `specs/002-homepage/VERIFICATION.md`). Not committed.** It covers:
  - brand assets in `public/brand/` (logo-blue 362×324, logo-white 833×746, icon-32, apple-touch-icon, share 1200×630), declared in `src/config/brand.ts`;
  - the hero logo: white beside the panel from `lg` (1.4fr/1fr grid, absolute `object-contain`), blue above the panel below `lg`;
  - the header logo at 44 px, favicons, and the share image;
  - the RBET credential;
  - the category pictogram row (`CategoryRow.astro`, links to `#work-section-{key}`);
  - the new `hoursNote` and `contact.lead`;
  - the credential rail moved into `CredentialRail.astro`;
  - the preview page and assets deleted. The cut-outs are gone, so asset generation cannot be re-run.
- **Owner-requested design edits 2026-11-22, outside the SDD flow, NOT yet reflected in spec 002 or the e2e suite:**
  - Hero: logo moved to the left (owner), grid `1fr/1.6fr`, panel `lg:max-w-none`, hero Container `lg:max-w-[78rem]`.
  - Pictogram row moved INSIDE the hero (under logo + panel, over the photo), as three separate translucent tiles (panel material, yellow top edge, centred icon badge + label; stacked rows below 360 px). Order is now Iluminación, Electricidad, Climatización. Icons are colour (navy outline + logo gradient, sky-blue airflow, 48 viewBox) on white circles.
  - Hero H1 is now the slogan (`home.slogan.{broken,missing}.{question,answer}`, answers in accent yellow, four lines; each phrase stays on one line (`whitespace-nowrap`), sized from the panel width via `@container` + per-locale `sloganSize` cqi factors (es 14.9, en 16.3, fr 13.15) measured on Barlow Condensed 800, capped at 4.75rem, so re-measure if the font or wording changes; 0.3em gap between the two sentences). `home.title` was removed; `home.lead` is kept but not rendered. The font token `--font-slogan` is Barlow Condensed 800, falling back to Space Grotesk. `@fontsource/barlow-condensed` (owner-installed 2026-11-22) is imported in BaseLayout (800 only). en/fr slogan PENDING review; es slogan uses "tú" while the site uses "usted".
  - Reveals start sooner: `home-reveal.ts` observer `threshold 0.05`, `rootMargin -4%` (was 0.15 / -10%). Durations are unchanged.
  - Category bands restyled: `bg-mist` #e7ecf5 / `bg-mist-deep` #dce3f0 (replacing white/surface-muted), `.surface-grain` (top light falloff + SVG fractal-noise grain at 8% alpha; the owner rejected the blueprint grid), navy-tinted (#001a73) photo drop-shadow filter on `.work-slideshow-track`, copy column as a white `shadow-lift` card with a yellow top edge.
  - Site-wide floating call button `CallFab.astro` (below `lg` only, bottom-right, 56 px, yellow, safe-area offset, z-30); the footer gets `pb-24 lg:pb-8` so it never covers footer text. Known: on a 390×844 first screen it overlaps the corner of the Climatización tile.
  - Category tiles in the hero have a dark navy shadow. Slideshows: prev/next arrow buttons restored (frosted circles on the stage edges, `data-slideshow-prev/next`, labels `home.work.slideshow.previous/next`, shown only once JS is ready, one nudge of the next arrow on first view, quieter with a mouse until hover) and the interval is 5 s (was 8 s).
  - Conflicts: spec R24/R25/R27/R28 and acceptance 7/9 (no visible controls, ~8 s), spec R5/R70/R72/R73, R43 (home.title/lead; slideshow previous/next keys), e2e site-brand lead check, acceptance 23, and e2e "places the row between the hero and the rail", "draws three original decorative pictograms", and the e2e `rowKeys` order. Next: `/ssd-change 002-homepage` to align the spec and tests.
- Checks (2026-11-21): gate green (lint, format, astro check 0, vitest 70/70, 17 pages). E2E 184/184 on system Chrome 158, axe clean in es/en/fr. The dist audit finds no inline script/style, no IBTB, no JSON-LD.
- Review screenshots (temporary): the session scratchpad `002-review/` (`home-{locale}-{width}-{full|hero|row|header}.png`). Regenerate them if missing.
- Every run decision is in `specs/002-homepage/DECISIONS.md` (D-1..D-61, G-1..G-4, V-T3001..V-T3010). The lesson is `docs/learning/009-logo-y-fila-de-categorias.md`.
- The homepage keeps the 002 design: full-bleed hero over `hero.jpg` (Peñón), three work categories with 8 s page-sized slideshows, gentle reveals, green WhatsApp/phone actions. Photos are real EA jobs; per-photo alt text is PENDING. `hero.webp` is unused (BACKLOG B1).
- Code review 2026-11-10: open issues B1–B7 are in `BACKLOG.md`, awaiting the owner's go-ahead.
- Constitution v1.0 (8 principles) was approved by the owner on 2026-11-20 but is NOT on disk; hooks block `docs/constitution.md` and `BACKLOG.md` writes. The approved text plus BACKLOG B8 exist only in that conversation.
- SDD overrides:
  - the tasks file is `tasks.md` (owner, D-58; spec 001 still has a legacy `task.md`);
  - specs use `Status: draft | approved | implemented` plus `VERIFICATION.md`;
  - the orchestrator may approve spec, plan and tasks; constitution and rules changes need the owner.
- Stack: Astro 7.4.4 static output, TypeScript strict, Tailwind 4, Node 24.16.0, pnpm 12.16.1; locales es (default), en, fr. Container stack: `edge` + `web` Caddy on the private `app` network; only `edge` publishes ports. Docker is unverified by agents (no socket access).
- No backend, form, email, uploads, DB, analytics, cookies or CMS yet; `/api/*` is reserved.

## Decisions

- Portable static output; Caddy is the only runtime; no Node in production. Local-first: `make build && make up`.
- The owner owns Git and deployment: agents never add, commit, push or reset.
- Scripts and styles stay external (`assetsInlineLimit: 0`, `inlineStylesheets: 'never'`) for strict CSP. Pictograms are inline SVG with presentation attributes only.
- Brand assets are prepared once and committed as static files: no image pipeline and no new dependency. Downscale with premultiplied BOX, then a 256-colour palette without dither, which keeps the 1-px frame transparent. The white logo uses the 833×746 cap, because 2× its 436.7 px render exceeds the source.
- The share image switched to `/brand/share.png`. `public/logo.jpg` is now unreferenced by the site and kept until the owner decides; `logo2.jpeg` is the source.
- The pictogram row is three across from 360 px and stacked below that. It has no JS and no reveal, and its sections use `scroll-mt-20` against the 65 px sticky header.
- Header logo-to-name gap is `gap-1.5`, so the name gets no less room than at `5edbb07`.

## Learnings and Pitfalls

- Never advertise 24/7, unconfirmed coverage, or invented claims. The en/fr credential, note and lead carry `// PENDING owner review`.
- Agent shells: `pnpm` may be missing, so use `node_modules/.bin/*`. Playwright has no bundled browser, so use git-ignored `.tmp/playwright.chrome.config.mjs` (`channel: 'chrome'`). Astro 7 preview daemonizes: run `astro preview --host 127.0.0.1 --port 4321`, set `BASE_URL`, and finish with `astro preview stop` (also before rebuilding).
- ESLint and Prettier check `.tmp/` too. Tests must never contain the literal preview path; build it as `['logo','preview'].join('-')`.
- Measure layout only after `waitForFonts` and `waitForMotion`. At 1024 px the white logo is width-limited, so geometry tests need the "height OR width" branch.
- Axe can report false contrast during reveals; audit after motion settles.
- `handle_errors` keeps the 404 status and must re-import headers. Never run `docker compose down -v` (it deletes certificates). Strip Caddy's file capability under `cap_drop: ALL`. Never publish the web port.
- `.agents/skills/` is installer-managed; do not hand-edit it. Docker and privileged commands need the owner.
- Orchestrator and agent hooks: the planner may write `spec.md`, `plan.md` and `tasks.md` only. The reviewer's shell blocks `>`. The orchestrator's shell blocks pipes and `cmp`.

## Next Steps

- **Owner:**
  - visual review (VERIFICATION.md "Not verified" steps);
  - en/fr wording;
  - say whether EA does urgent work outside hours (D-33);
  - apply the AGENTS.md business-fact edits (final report, D-61);
  - decide on `public/logo.jpg` and `logo2.jpeg`;
  - commit the change, then `make build && make up && make smoke`.
- Owner writes `docs/constitution.md` v1.0 and BACKLOG B8. Then `/ssd-spec 003-client-script-logic`.
- Optional: run the R62/R63 geometry tests in all three locales; rename spec 001's `task.md` to `tasks.md`; ask the client for a vector logo.
