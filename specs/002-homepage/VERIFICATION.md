# Verification 002 — Homepage (change request 2026-11-21)
Date: 2026-11-21
Verdict: APPROVED

Scope: R60–R78, the changed R1, R5, R7, R9, R10, R12 (impacted), R13, R43, R46–R48, R51, R55–R58, AC1, AC16, AC18–AC26, G9–G11. Branch `feat/002-homepage`. HEAD is still `5edbb07` and nothing has been committed.

Two items are still open, and both belong to the close-out, not to the implementer:
- **AC18 / R57:** `MEMORY.md` is not updated yet. The orchestrator writes it after this report.
- **AC26 / R58:** the visual review is the owner's. It is marked PENDING below.

## Checks run (by the reviewer, 2026-11-21)

| Command | Result |
|---|---|
| `node_modules/.bin/eslint .` | clean, no output |
| `node_modules/.bin/prettier --check .` | "All matched files use Prettier code style!" |
| `node_modules/.bin/astro check` | 63 files: 0 errors, 0 warnings, 0 hints |
| `node_modules/.bin/vitest run` | 9 files, 70/70 passed |
| `node_modules/.bin/astro build` | 17 pages built; `sitemap-index.xml` created |
| `astro preview --host 127.0.0.1 --port 4321`, then `BASE_URL=… playwright test -c .tmp/playwright.chrome.config.mjs` | 184 passed, 0 failed, 0 skipped (39.6 s). Re-run with `--workers=4`: 184 passed (54.0 s). Playwright 1.64.1, system Chrome. `astro preview stop` stopped the server. |
| Axe (`foundation.spec.ts:131`) | "no serious axe violations" passes in es, en and fr |
| `vitest run tests/unit/brand.test.ts --reporter=verbose` | 21/21 passed (IHDR, ratio, colour type, bytes, opacity, placed marks) |
| `file public/brand/*.png` and `stat` | blue 362×324 colormap, 10,402 B · white 833×746 colormap, 28,806 B · icon 32×32 RGB, 1,475 B · apple-touch 180×180 RGB, 11,088 B · share 1200×630 colormap, 20,720 B |
| dist audit: `<script` tags without `src` / `<style` / `style=` | 0 / 0 / 0. The only scripts are two external modules (`index…js` ×3, `MobileNav…js` ×16). |
| `grep -rli IBTB dist` / `grep -rn IBTB src` | 0 / 0 |
| `grep -rl ld+json dist` | 0 |
| `grep -rn "logo-preview" src public tests docs --exclude-dir=learning`; `find dist -path '*logo*preview*'` | empty / empty |
| `grep -rn "/logo.jpg" src tests` | only the negative guard in `tests/e2e/build-output.spec.ts:64,79,82` (accepted, V-T3010) |
| `grep -rl logo.jpg dist --include=*.html` | 0 |
| Sitemap `<loc>` | exactly es, en and fr × `/`, `/services/`, `/contact/` (9 URLs, the same as `5edbb07`) |
| Icon and share links per page | every built page has 1 icon link (`/brand/icon-32.png`) and 1 apple-touch link (`/brand/apple-touch-icon.png`). The only exception is the `dist/index.html` meta-refresh stub (D-60). `og:image` and `twitter:image` are `…/brand/share.png` on all 16 pages. |
| 24/7 grep (`24/7`, `24 horas`, `24 hours`, `24h`, `around the clock`) over src and dist | 0 |
| `git diff HEAD --stat -- package.json pnpm-lock.yaml astro.config.mjs playwright.config.ts src/styles src/scripts Caddyfile* Dockerfile compose.yaml` | empty: no dependency, config, CSS or script change |
| `git ls-files .tmp docs/logo-preview public/logo-preview` → 0 lines; `git check-ignore -v .tmp/*` → `.gitignore:27:.tmp/` | `.tmp/` is not tracked; it is ignored |
| `git status --short` before and after the review | identical; `git log -1` = `5edbb07` |
| Reviewer probe (in-memory Playwright, system Chrome): white logo at 1024, 1280 and 1440 in es, en and fr, plus the console | see the R62 row; the console had 0 errors and 0 warnings on all 9 loads |

Measurements logged by the e2e run:
- **Hero growth from the compact logo:**
  - at 375 and 390: 528 → 645.3 px, growth 117.3 px, against a cap of 112 + 16 + 1;
  - at 768: 496 → 593.3 px, growth 97.3 px, against a cap of 144 + 16 + 1.
- **Largest visible logo:** white 436.7×391.1 in es, en and fr (2× = 873 > 833, so the 833×746 cap applies). Blue 160.9×144.0 (362/160.9 = 2.25×).
- **Header:** logo 49.16 px wide, gap 6 px, total 55.16 ≤ 56. Name overflow is 0 px at 375 and 390.

## Requirements

| ID | Evidence | Status |
|---|---|---|
| G9 | Covered by R60–R69 | ✅ |
| G10 | Covered by R70–R75 | ✅ |
| G11 | Covered by R13, R76–R78 | ✅ |
| R1 | `src/styles/global.css` unchanged (empty diff); no gradient in the new components; the logo gradient is part of the mark | ✅ (look: owner) |
| R5 | Pictograms are `text-accent`; e2e "draws three original decorative pictograms…" asserts `rgb(250, 217, 81)` on band `rgb(0, 32, 143)`; green is unchanged | ✅ |
| R7 | `src/pages/[locale]/index.astro:28-31` (Hero, CategoryRow, CredentialRail, WorkCategories); e2e "places the row between the hero and the rail" (DOM and visual order) ×3 locales | ✅ |
| R9 | `Hero.astro:34-88`: eyebrow, H1, lead, two actions, two decorative logos; the rail is in `CredentialRail.astro`; e2e "renders the landscape hero and credential rail" ×3 | ✅ |
| R10 | e2e "does not let the white logo change the hero height" at 1024 and 1280 × es/en/fr (Δ ≤ 2; V-T3006 recorded 0 px); "caps the hero growth…" at 375, 390 and 768 (values above); "≤ 540 at 1280" kept | ✅ |
| R12 (impacted) | `hero.jpg` attributes unchanged (e2e); the Peñón is visible above the panel in `home-fr-390-hero.png` | ✅ automated / ⚠️ crop: owner |
| R13 | `es.ts:53`, `en.ts:54`, `fr.ts:55` hold the exact strings; unit "uses the exact credential…" ×3; e2e rail `nth(1)` toHaveText ×3 | ✅ (en/fr wording PENDING owner, D-25) |
| R43 | Dictionary diffs change 3 values × 3 locales; no key added or removed; parity tests pass; no logo key | ✅ |
| R46 | `hoursNote` has no digits or weekday words (unit); 24/7 grep is empty; the service area is unchanged | ✅ |
| R47 | Only the RBET credential changed; no number; unit and dist IBTB checks are 0 | ✅ |
| R48 | e2e "keeps headings and reveal markers out of the row" ×3; one h1 (foundation) | ✅ |
| R51 | Sitemap has 9 URLs; no JSON-LD; only the share URL changed (`Seo.astro:24`); foundation canonical, hreflang and robots tests pass | ✅ |
| R55 | Every listed check exists and passes: hero logo, hero height at 1024 and 1280 ×3, rail text, row, urgent note and lead, favicons, preview 404, IBTB, axe ×3 | ✅ |
| R56 | Gate and e2e run as above; inline audit = 0; layout at 390, 768, 1024 and 1280, focus and reduced motion covered by e2e plus 48 screenshots; results go to VERIFICATION.md (this report) | ✅ |
| R57 | `AGENTS.md` business facts not edited by agents (lines 53, 56 and 63 still old; the owner applies them). The only agent edit is lines 8 and 29, the D-58 naming fix the owner approved. `MEMORY.md` is not updated yet. | ⚠️ orchestrator close-out |
| R58 | 48 screenshots in the orchestrator scratchpad `002-review/`; no approval claimed | ⚠️ owner (steps below) |
| R60 | Unit: indexed (type 3), `isUndistortedFile`, white exactly 833×746. e2e "display variants are transparent on the corners and the 1 px frame". Paths `/brand/logo-{blue,white}.png`. The `.tmp/brand-assets.py` script resizes and quantises only (no clean, trim or recolour). | ✅ (halo: owner) |
| R61 | Blue file is 2.25× its largest render (160.9 px); white file at the 833×746 cap (2× 436.7 > 833); bytes 10,402 < 151,058 and 28,806 < 150,503; e2e "keeps the white and blue files at their display cap" ×3 | ✅ |
| R62 | e2e "fits the white logo to the panel row" at 1024, 1280 and 1440 (es). Reviewer probe in es, en and fr: track ratio 1.400; gap 40 (from `gap-10`); at 1024 width-limited (383.3 = column, centre Δ 0); at 1280 es/en height = panel (364.3); at 1280 fr and at 1440 width-limited (436.7, centre Δ 0); inside the hero | ✅ |
| R63 | e2e "sizes the compact logo…" at 320, 375, 390 and 639 (112.0 px) and at 640, 768 and 1023 (144.0 px); gap 16.0; left edge within 1 px of the panel; undistorted; "exactly one hero logo" at 10 widths | ✅ |
| R64 | e2e: `aria-hidden` plus `alt=""`; `animation-name` equals the panel's; `none` under reduced motion; no-JS shows the compact logo; animation only under `html.js` (`global.css:245`) | ✅ |
| R65 | No preview page or files in dist; e2e 404 ×3; source grep empty; Hero is prop-free; `public/logo-preview/` and `docs/logo-preview/` deleted | ✅ |
| R66 | e2e "shows the blue logo at 44 px" on 5 page types ×3 locales: src, `alt=""`, 44 ± 0.5, undistorted, radius 0, header 65 px, accessible name = business name; name-room test at 6 widths; no overflow at 320 | ✅ |
| R67 | 32×32 and 180×180 RGB without tRNS (unit; `file`); e2e "both icons are fully opaque"; build-output: one link each on every page; no `/logo.jpg` icon | ✅ (look: owner) |
| R68 | `/brand/share.png` 1200×630, mark 560×502 downscaled from the 833×746 blue cut-out (script step 4); file exists in dist (build-output) | ✅ |
| R69 | `public/logo.jpg` and `public/logo2.jpeg` present. Remaining `/logo.jpg` mentions are documentation only: `AGENTS.md:63`, `README.md`, `MEMORY.md`, `docs/learning/002, 004, 005`, the spec/plan/tasks/DECISIONS of 001 and 002, plus the negative test guard. No built page and no `src/` file references it. | ✅ |
| R70 | Unit `categoryRowOrder`; e2e "lists three links in the owner's order…" ×3 (label = h2) | ✅ |
| R71 | Row uses `home.work.categories.*.title`; five-services unit test passes; `/services/` unchanged | ✅ |
| R72 | `CategoryPictogram.astro`: hand-drawn 24×24 stroke paths, `currentColor`, `aria-hidden`, `focusable=false`, no style or script (e2e plus dist audit); yellow on blue 9.4:1; same-origin e2e ×3 | ✅ (simple/original: owner) |
| R73 | e2e "fits without overflow or clipped labels" at 320, 360, 375, 390, 768, 1024, 1280 and 640×400 × es/en/fr (overflow ≤ 0, no clip or mid-word break, ≥ 44 px tall, one column below 360, three across from 360); white labels pass axe | ✅ |
| R74 | No `data-reveal` and no script in the row (e2e plus grep); no-JS e2e | ✅ |
| R75 | e2e "reaches the links by Tab and jumps…" at 390×844 and 1280×800 (yellow ≥ 2 px solid outline, ≥ 44×44, hash, section top below the header, stage `is-visible`); "jumps instantly with reduced motion"; no-JS click | ✅ |
| R76 | Footer (`Footer.astro:47`) on 5 page types ×3 locales and contact (`contact.astro:63`): exact strings (e2e site-brand); no digits or weekdays (unit) | ✅ (en/fr PENDING owner) |
| R77 | `contact.astro:39`: exact lead ×3 (unit plus e2e); the old "call during opening hours" sentence is removed | ✅ (en/fr PENDING owner) |
| R78 | IBTB = 0 in src and dist; no number in the credential | ✅ |
| Unchanged R2–R4, R6, R8, R11, R14–R42, R44, R45, R49, R50, R52–R54, R59 | Regression: all 184 e2e (slideshow, reveals, no-JS, overflow at 320, 375, 768 and 1280, axe ×3) and 70 unit tests pass; no new JS (`src/scripts` unchanged); no commit | ✅ |

## Completion criteria

| AC | Status |
|---|---|
| 1 | ✅ spec (approved), plan §14 (approved, G-2), tasks Phase 10 (approved, G-3, T3001–T3010 all `[x]`) agree and record the change |
| 16, 25 | ✅ gate and e2e green, axe ×3, inline audit 0. Recorded here for VERIFICATION.md. |
| 18 | ⚠️ pending the orchestrator's `MEMORY.md` update. The AGENTS.md before/after text (D-61) goes to the owner. |
| 19 | ✅ (R60, R61, R65) |
| 20 | ✅ (R10, R61–R64) |
| 21 | ✅ (R66–R69) |
| 22 | ✅ (R13, R78) |
| 23 | ✅ (R70–R75) |
| 24 | ✅ (R46, R76, R77) |
| 26 | ⚠️ PENDING owner review. This is explicitly allowed by the criterion's wording. |
| 2–15, 17 (earlier) | No regression: all existing tests pass. AC17 is still PENDING owner. |

## Constitution compliance (v1.0, owner-approved; not on disk)

1. **Static-first, minimal dependencies.** ✅ `package.json` and the lockfile are unchanged. The assets are static. Pillow ran once from git-ignored `.tmp/`.
2. **Specs lead.** ✅ Every changed file maps to plan §14.2. No scope creep found. The `data-testid` hooks and `tests/support/` are planned. The AGENTS.md naming edit is owner-approved (D-58).
3. **Pure logic, thin I/O.** ✅ The helpers are in `src/config/brand.ts` and `src/lib/home-work.ts`, with unit tests. The test-only helpers are in `tests/support/` (P-19).
4. **Tests are the gate.** ✅ All gates are green, and red-first is recorded per task in V-T300x.
5. **Truthful content, never 24/7.** ✅ RBET is the owner-approved wording; no number; the urgent note mentions no hours; the 24/7 grep is empty.
6. **Strict CSP.** ✅ 0 inline scripts, 0 `<style>`, 0 `style=` in dist. The SVGs use presentation attributes only.
7. **es/en/fr, accessible, mobile-first.** ✅ All three locales are tested, axe is clean, keyboard and focus are covered, and there is no overflow from 320 px.
8. **The owner owns Git.** ✅ HEAD is `5edbb07` and nothing is staged by agents. The dotfiles were staged by the owner (baseline).

## Required changes

None.

## Optional suggestions (do not block)

1. `tests/e2e/homepage.spec.ts:399-450`: the R62 and R63 geometry tests run only in `es`. The reviewer's probe confirmed en and fr pass: at 1280 the fr panel is 409.5 px and the logo is width-limited at 436.7 with centring Δ 0. A future change could loop these tests over the three locales, like the hero-height test.
2. `spec.md` R57 and §3 say "agents do not edit `AGENTS.md` in this change", but lines 8 and 29 were edited under D-58 with the owner's explicit approval. A one-line note in R57 ("except the D-58 file-name fix") would remove the apparent contradiction.
3. `src/components/home/CategoryPictogram.astro:10-11`: the comment cites "(R72)" twice. This is cosmetic.
4. `specs/001-project-foundation/task.md` still uses the legacy name. Proposal for the owner (D-58).
5. `MEMORY.md` is 55 lines, and line 21 still describes the logo preview prototype as current. The orchestrator's update should replace it and keep the file at about 50 lines.

## Not verified

- ⚠️ **Owner visual review (R58, AC26, AC17).** Steps:
  1. Open the screenshots in `/tmp/claude-1000/-home-druke-Escritorio-personal-projects-EA-electricidad-y-multiservicios/3127b000-0ea3-46fc-8261-d8a0235709dd/scratchpad/002-review/` (`home-{es,en,fr}-{390,768,1024,1280}-{full,hero,row,header}.png`), or run `pnpm build && pnpm preview` and open `http://localhost:4321/es/`, `/en/` and `/fr/`, resizing to 390, 768, 1024 and 1280.
  2. **Hero logo.** Expected:
     - at 1024 and up, the white logo sits right of the panel, about as tall as the panel;
     - below 1024, the blue logo sits above the panel, left-aligned;
     - the mark reads clearly over bright sky and water at 1024 and up.
  3. Zoom into both logos. Expected: no halo or banding in the yellow-to-orange gradient.
  4. At 375 and 768, expected: the Peñón is still visible with the compact logo. The phone hero is now about 645 px tall.
  5. Header on any page: the blue logo is 44 px tall next to the full business name. Browser tab: the 32×32 icon on white. On iOS, use "Add to Home Screen" to check the 180×180 icon.
  6. Pictogram row: check that the socket, pendant-lamp and split-unit drawings look simple and original, and that the labels are Electricidad, Iluminación, Climatización.
  7. Share image: open `/brand/share.png`. Expected: the logo centred on white, 1200×630.
- ⚠️ **en/fr wording (R13, R76, R77).** The owner reviews `en.ts:54,141,148` and `fr.ts:55,145,152` (marked `// PENDING owner review`). The owner also confirms whether EA does urgent work outside Monday–Friday 08:00–20:00 (D-33).
- **Not run:** Docker stack (`make build && make up && make smoke`), because the agent has no Docker access; real browser zoom at 200%, which was approximated by a 640×400 viewport (§8); a real iOS device.

## For the documentation

- **State:** The 2026-11-21 change request (R60–R78) is implemented and validated: gate green, e2e 184/184 on system Chrome, axe clean in es, en and fr, dist audit clean. Remaining:
  - the orchestrator writes VERIFICATION.md from this report;
  - the orchestrator has the planner set spec.md to `Status: implemented`;
  - the orchestrator updates MEMORY.md (AC18);
  - the owner does the visual review (R58), the en/fr wording, the AGENTS.md business-fact edits (lines 53, 56 and 63; D-61 text), the commit and the deploy;
  - the owner decides whether to delete `public/logo.jpg` and move `public/logo2.jpeg`.
- **Decisions:** none new. The reviewer accepted D-60 (the `dist/index.html` redirect stub is exempt from the icon and share audit) and the V-T3010 negative-guard grep match.
- **Pitfalls:**
  - The reviewer's hook blocks any command containing `>`, including JS arrow functions and Python comparisons. Ad-hoc probes have to use `function` expressions, or else the tests themselves.
  - Astro 7 preview daemonizes, so the backgrounded start "completes" right away. Check the server with curl and stop it with `astro preview stop`.
  - At 1024 the white logo is width-limited (343.3 against a 346.2 panel). A height-only assertion would fail, so the test's "height OR width" branch is required.
- **Permanent rules (proposals, not applied):**
  - Run the hero-geometry e2e checks in all three locales by default.
  - Rename spec 001's `task.md` to `tasks.md` to match D-58.
  - Record in AGENTS.md "Brand and UI" that the logo assets live in `public/brand/`, declared in `src/config/brand.ts`, replacing the `public/logo.jpg` line (owner applies).
