# Tasks — 001 Project Foundation

- Status: Approved — implementation in progress; VPS deployment pending
- Related spec: `specs/001-project-foundation/spec.md`
- Related plan: `specs/001-project-foundation/plan.md`
- Branch: `feat/001-project-foundation`
- Target: `main`

Tasks are ordered. Do not start a phase until its dependencies are satisfied. Commands listed as target scripts become available during Phase 1. Verify each task before marking it complete.

## Phase 0 — Approval and preflight

- [x] **T001 — Approve the specification and plan.** Confirm scope, Astro static architecture, staging hostname, VPS assumptions, manual deployment, and branch/PR workflow. **Done when:** the owner explicitly approves all three files.
- [ ] **T002 — Inspect the VPS.** Record OS version, CPU, RAM, disk, time synchronization, sudo access, SSH key access, firewall state, and whether ports 80/443 are reachable. **Done when:** preflight results are documented without changing the VPS.
- [ ] **T003 — Verify staging DNS and TLS feasibility.** Confirm `<VPS_IP>.sslip.io` resolves to the VPS and that Caddy can complete an ACME challenge. **Done when:** HTTPS feasibility is confirmed or the task is blocked with a clear report.
- [ ] **T004 — Confirm VPS compatibility.** Verify Ubuntu 24.04 LTS works with the provider image and Docker packages. If not, request approval for 22.04 LTS. **Done when:** the supported OS is recorded.
- [ ] **T005 — Confirm the Git workflow.** Verify the GitHub repository, the `main` default branch, required pull-request review, and that the VPS will deploy only from `main`. **Done when:** the branch, protection rule, and review requirement are confirmed.

## Phase 1 — Project scaffold

- [x] **T101 — Create the feature branch.** Branch from `main` as `feat/001-project-foundation`. **Done when:** the branch exists locally and tracks the intended remote.
- [x] **T102 — Scaffold Astro.** Create an Astro project with TypeScript strict mode, static output, and pnpm. **Done when:** `pnpm dev` starts and a placeholder page renders.
- [x] **T103 — Pin the toolchain.** Add `.nvmrc` or `.node-version` with Node.js 24 LTS, a `packageManager` field, and committed `pnpm-lock.yaml`. **Done when:** `pnpm install --frozen-lockfile` succeeds from a clean checkout.
- [x] **T104 — Add repository hygiene files.** Create `.gitignore`, `.dockerignore`, and `.env.example`. Ignore dependencies, build output, environment files, test artifacts, and editor files. **Done when:** `git status` shows no generated output.
- [x] **T105 — Add README skeleton.** Document purpose, prerequisites, install, development, and the planned commands. **Done when:** a new contributor can identify the setup path.

## Phase 2 — Quality tooling

- [x] **T201 — Configure TypeScript.** Enable strict mode, path aliases, and Astro type generation. **Done when:** `pnpm check` succeeds on the scaffold.
- [x] **T202 — Configure ESLint.** Add Astro and TypeScript rules with the project’s conventions. **Done when:** `pnpm lint` succeeds and reports a deliberate violation.
- [x] **T203 — Configure Prettier.** Add Astro formatting support and ignore generated output. **Done when:** `pnpm format:check` succeeds.
- [x] **T204 — Add target scripts.** Define `dev`, `build`, `preview`, `lint`, `format`, `format:check`, `check`, `test`, `test:e2e`, and `validate`. **Done when:** each script is documented and runnable.
- [x] **T205 — Add `.gitignore` verification.** Confirm `.env`, `.env.*`, `dist/`, `.astro/`, `node_modules/`, Playwright output, and coverage are ignored, while `.env.example` remains tracked. **Done when:** a test environment file is not staged.

## Phase 3 — Design foundation

- [x] **T301 — Add Tailwind CSS.** Configure Tailwind v4 through the Astro Vite integration. **Done when:** utility classes apply in a smoke page.
- [x] **T302 — Define design tokens.** Add brand blue `#00208f`, yellow `#fad951`, white, neutral ink/muted colors, spacing, container width, radii, borders, and focus ring. **Done when:** tokens are available as CSS variables and Tailwind theme values.
- [x] **T303 — Add self-hosted fonts.** Add Space Grotesk for headings and Source Sans 3 for body, with a system fallback and `font-display: swap`. **Done when:** no third-party font request appears in the network panel.
- [x] **T304 — Build global styles.** Add reset/base styles, heading scale, body text, link styles, selection, reduced-motion handling, and focus-visible styles. **Done when:** contrast and focus are visibly correct on white and blue surfaces.
- [x] **T305 — Add UI primitives.** Create `ButtonLink`, `Container`, `Section`, and `PlaceholderMedia` with the minimum variants needed by the layout. **Done when:** components render without page-specific overrides.
- [x] **T306 — Add placeholder media.** Create neutral brand-tinted placeholders that are clearly not photographs and reserve layout dimensions. **Done when:** placeholders cause no layout shift and use no fabricated imagery.

## Phase 4 — Localization

- [x] **T401 — Configure Astro i18n.** Set `es` as default, locales `es`/`en`/`fr`, default-locale prefixing, default redirect, and `trailingSlash: 'always'`. **Done when:** `/es/`, `/en/`, and `/fr/` render and `/` redirects to `/es/`.
- [x] **T402 — Create typed dictionaries.** Add `es.ts`, `en.ts`, and `fr.ts`; derive `Dictionary` from Spanish and type the others with `satisfies`. **Done when:** TypeScript rejects a missing key.
- [x] **T403 — Add locale helpers.** Implement locale extraction, locale replacement, localized path building, and canonical path helpers. **Done when:** unit tests cover valid and invalid paths.
- [x] **T404 — Add translation parity tests.** Compare key paths and leaf types; reject missing keys, extra keys, and empty strings. **Done when:** `pnpm test` fails when a translation is removed or emptied.
- [x] **T405 — Implement language switching.** Link to the equivalent page in each locale, preserve the route, and expose `hreflang`. **Done when:** switching from `/en/services/` reaches `/fr/services/`.
- [x] **T406 — Add localized 404 content.** Create the `/{locale}/404/` page and verify Caddy can map missing localized routes to it. **Done when:** missing `/es/*` paths return a 404 with Spanish content.

## Phase 5 — Layout and pages

- [x] **T501 — Build `BaseLayout`.** Add skip link, `lang`, metadata slot, header, main landmark, and footer. **Done when:** every page shares the layout and has one `h1`.
- [x] **T502 — Build the header.** Add logo on a light surface, desktop navigation, active-page state, language switcher, and primary CTA. **Done when:** the CTA reaches the localized contact page.
- [x] **T503 — Build the mobile navigation.** Use a native disclosure pattern, keyboard-operable summary, and optional close-on-navigation behavior. **Done when:** navigation works with JavaScript disabled.
- [x] **T504 — Build the footer.** Add business name, phone, WhatsApp, email, hours, service area, and legal link. **Done when:** all contact links use the approved targets.
- [x] **T505 — Build the home placeholder.** Use only approved business facts, a clear CTA, five-category preview, and neutral media placeholders. **Done when:** no invented claims or testimonials appear.
- [x] **T506 — Build the services overview.** List exactly the five approved categories with placeholder structure. Do not add categories. **Done when:** all five categories are present and no others.
- [x] **T507 — Build the contact page.** Add phone, WhatsApp, email, hours, and confirmed service area. Do not add a form. **Done when:** contact methods work on mobile and desktop.
- [x] **T508 — Build the legal placeholder.** Add headings and a clear pending-review note; do not invent legal text or compliance claims. **Done when:** the page is marked `noindex`.
- [x] **T509 — Add WhatsApp deep links.** Build localized prefilled messages from translations. **Done when:** links open the correct number and encoded message.
- [x] **T510 — Verify responsive layout.** Check 320, 375, 768, and 1280 CSS pixels. **Done when:** no horizontal overflow or obscured navigation.

## Phase 6 — SEO and indexing

- [x] **T601 — Build the SEO component.** Generate title, description, canonical, Open Graph basics, and robots directives. **Done when:** each page has unique localized metadata.
- [x] **T602 — Add language alternates.** Emit `es`, `en`, `fr`, and `x-default` pointing to Spanish. **Done when:** alternate URLs match canonical routes.
- [x] **T603 — Add sitemap generation.** Configure `@astrojs/sitemap` with i18n alternates. Verify `x-default`; customize serialization if needed. **Done when:** the sitemap contains every page in every locale.
- [x] **T604 — Add environment-aware robots.** Generate `Disallow: /` for staging and allow plus sitemap for production. **Done when:** unit tests cover both environments.
- [x] **T605 — Add staging `noindex`.** Emit `<meta name="robots" content="noindex, nofollow">` on all staging pages. **Done when:** an E2E test fails if the directive is missing.
- [x] **T606 — Add favicon and social image placeholders.** Use the existing logo without replacing the brand mark. **Done when:** the browser and social preview resolve absolute URLs.
- [x] **T607 — Verify canonical and redirect behavior.** Check root, trailing slash, locale routes, and unknown paths. **Done when:** status codes and canonical URLs are consistent.

## Phase 7 — Configuration and content data

- [x] **T701 — Add site constants.** Centralize business name, phone, WhatsApp, email, hours, service area, and brand values in `src/config/site.ts`. **Done when:** components import the constants and contain no duplicated contact data.
- [x] **T702 — Add environment validation.** Use Zod to validate `SITE_URL` and `SITE_ENV` at build time. **Done when:** an invalid URL or environment fails the build with a clear message.
- [x] **T703 — Add `.env.example`.** Document staging examples without secrets. **Done when:** local setup succeeds by copying the example.
- [x] **T704 — Verify build-time behavior.** Confirm `SITE_URL` and `SITE_ENV` are baked into the build. **Done when:** changing the domain in a new build changes canonical URLs.
- [x] **T705 — Audit for secrets.** Search source, docs, and image inputs for credentials, tokens, and personal data. **Done when:** none are present.

## Phase 8 — Testing

- [x] **T801 — Add Vitest.** Configure unit tests for translations, locale helpers, URL builders, environment validation, and robots output. **Done when:** `pnpm test` passes.
- [x] **T802 — Add Playwright.** Configure browser tests against a local production-like build. **Done when:** `pnpm test:e2e` passes locally.
- [x] **T803 — Cover locale routing.** Test `/` redirect, all three locale homes, unknown locale, and unknown localized routes. **Done when:** status codes and localized content are asserted.
- [x] **T804 — Cover navigation and language switching.** Test desktop and mobile navigation, active state, route-preserving switching, and contact links. **Done when:** all three locales are covered.
- [x] **T805 — Cover no-JavaScript behavior.** Run navigation, language switching, and contact-link checks with JavaScript disabled. **Done when:** the site remains usable.
- [x] **T806 — Add axe scans.** Run accessibility checks on each locale’s home, contact, and 404 pages. **Done when:** no serious or critical violations remain.
- [x] **T807 — Add responsive checks.** Assert no horizontal overflow at 320, 375, 768, and 1280 pixels. **Done when:** all viewports pass.
- [ ] **T808 — Add container smoke script.** Create `scripts/smoke.sh` for health, redirects, locales, localized 404, headers, assets, and absence of Node.js in the runtime image. **Done when:** the script passes against the local image.

## Phase 9 — Container and Caddy

- [ ] **T901 — Create the multi-stage Dockerfile.** Build with Node.js 24 LTS and pnpm; serve with Caddy. **Done when:** the final image contains no Node.js runtime or source files.
- [x] **T902 — Create the Caddyfile.** Configure TLS, compression, root redirect, trailing-slash normalization, locale 404 mapping, health endpoint, and security headers. **Done when:** curl smoke tests pass.
- [x] **T903 — Create `compose.yaml`.** Configure the build context, staging build arguments, local image tag, restart policy, ports, volumes, health check, environment, log rotation, and least-privilege capabilities. **Done when:** `docker compose config` is valid.
- [ ] **T904 — Build the local image.** Build with `make build` using staging `SITE_URL` and `SITE_ENV`. **Done when:** the local container serves all routes over HTTP.
- [ ] **T905 — Run the smoke script.** Verify health, root redirect, trailing slash, locales, 404 status/content, headers, and `noindex`. **Done when:** every assertion passes.
- [ ] **T906 — Verify image hygiene.** Inspect the final image for Node.js, source files, `.env` files, and build tools. **Done when:** none are present.
- [x] **T907 — Add the Makefile.** Provide `build`, `up`, `down`, `restart`, `logs`, `status`, `deploy` and `clean`, plus `help` and `smoke`. **Done when:** `make -n` succeeds for every target and `deploy` follows the stop → remove image → sync `main` → build → start order.
- [x] **T908 — Preserve volumes and Caddy configuration.** Ensure no target uses `down -v` and the `caddy_data`/`caddy_config` volumes remain declared. **Done when:** the Compose file and Makefile preserve both volumes.

## Phase 10 — Continuous integration

- [ ] **T1001 — Add GitHub Actions.** Run install, lint, format check, type check, unit tests, build, E2E, and a Compose build plus container smoke test on pull requests and pushes to `main`. **Done when:** the workflow passes on the feature branch.
- [ ] **T1002 — Verify frozen installs.** Ensure CI uses `pnpm install --frozen-lockfile`. **Done when:** a lockfile mismatch fails CI.
- [x] **T1003 — Verify staging checks.** Run E2E with `SITE_ENV=staging` so `noindex` is exercised. **Done when:** the staging assertion fails when the directive is removed. _Verified 2026-10-30: the noindex and disallow-all robots tests fail against a production build and pass against a staging build._
- [x] **T1004 — Verify production robots separately.** Add unit coverage for production robots output. **Done when:** production is allowed and references the sitemap. _Covered by `tests/unit/robots.test.ts`._
- [x] **T1005 — Keep deployment manual.** Do not add an automatic deployment workflow in this phase. **Done when:** CI has no production deploy step. _`ci.yml` has no deploy, SSH, or registry-push step._

## Phase 11 — VPS deployment

- [ ] **T1101 — Harden the host.** Create the deploy user, install SSH keys, disable password/root SSH after verification, configure UFW for 22/80/443, enable unattended upgrades, and configure Docker log rotation. **Done when:** access works with the deploy user and only required ports are exposed.
- [ ] **T1102 — Install Docker.** Install Docker Engine, the Compose plugin, and `git` from official repositories. Do not install Node.js or pnpm on the host. **Done when:** `docker run --rm hello-world` succeeds.
- [ ] **T1103 — Clone and configure the deployment.** Clone the repository into `/opt/ea-electricidad/`, check out `main`, and create a mode-600 `.env` with staging `SITE_URL`, `SITE_ENV` and `SITE_ADDRESS`. **Done when:** the deploy user can run `make status` there.
- [ ] **T1104 — Verify the on-VPS build.** Run `make build` on the VPS and confirm the Astro build completes within 1 vCPU / 2 GB without exhausting memory or disk. **Done when:** the image builds on the server.
- [ ] **T1105 — Deploy from `main`.** Run `make deploy` after a merge into `main` and confirm it stops the service, removes the old image, syncs `main`, rebuilds, and starts the service. **Done when:** the deployment completes without manual steps.
- [ ] **T1106 — Deploy staging.** Verify health, HTTPS, locales, redirects, headers, localized 404, and `noindex` on the staging URL. **Done when:** `make smoke BASE_URL=https://<VPS_IP>.sslip.io` passes.
- [ ] **T1107 — Verify certificate and DNS.** Confirm a trusted certificate for `<VPS_IP>.sslip.io` and that HTTP redirects to HTTPS. **Done when:** no certificate warning or mixed content appears.
- [ ] **T1108 — Demonstrate rollback.** Check out the previous known-good commit, run `make build && make up`, verify it, then return to `main`. **Done when:** rollback by rebuild is proven and documented.
- [ ] **T1109 — Verify disk and resources.** Check free space, image count, build cache, log size, and service memory use. **Done when:** the VPS has comfortable headroom and `caddy_data`/`caddy_config` are intact.

## Phase 12 — Documentation, review, and memory

- [x] **T1201 — Complete the README.** Document architecture, commands, environment values, local Compose build, Make targets, VPS deployment from `main`, rollback by rebuild, domain switching, and static-host handoff requirements. **Done when:** the documented path matches a clean run.
- [ ] **T1202 — Document staging access.** Record the staging URL, `noindex` behavior, and known limitations without secrets. **Done when:** the owner can review the site.
- [x] **T1203 — Review against acceptance criteria.** Walk through every criterion in `spec.md`. **Done when:** each is verified or explicitly marked blocked. _See the verification table below._
- [ ] **T1204 — Review security and privacy.** Confirm no secrets, no data collection, no analytics, bounded logs, SSH hardening, firewall rules, and staging indexing protection. **Done when:** the checklist is complete. _Source, logs, and indexing rules verified locally; SSH hardening and firewall rules are blocked on VPS access._
- [x] **T1205 — Update `MEMORY.md`.** Record the implemented stack, deployment path, staging URL, decisions, pitfalls, and next steps, keeping the file concise. **Done when:** the memory reflects the real state.
- [ ] **T1206 — Open the pull request.** Target `main` from `feat/001-project-foundation` with a summary, checks performed, staging URL, rollback evidence, and known limitations. **Done when:** CI is green and the pull request is ready for review.

## Revision 2026-10-30 — local builds, VPS builds from `main`, no registry

The owner replaced the registry-based delivery with source builds: images are built with Docker Compose locally and again on the VPS, and the VPS deploys only the `main` branch. The VPS is a staging/demonstration host where downtime and application data loss are acceptable, but Caddy volumes are preserved.

- [x] **T1301 — Remove the registry.** Delete every image-registry reference from Compose, documentation, tasks, and memory; require `SITE_URL` at build time. **Done when:** no registry or image-tag reference remains.
- [x] **T1302 — Build with Compose.** Add `build.args` for `SITE_URL`/`SITE_ENV` and a local image tag in `compose.yaml`. **Done when:** `docker compose config` resolves the build.
- [x] **T1303 — Add the Makefile.** Ship `help`, `build`, `up`, `down`, `restart`, `logs`, `status`, `smoke`, `deploy` and `clean`. **Done when:** every target passes `make -n`.
- [x] **T1304 — Define the VPS deploy sequence.** `deploy` stops services, removes the old image, syncs `origin/main`, rebuilds, and starts with health waiting. **Done when:** the recipe order matches the approved workflow.
- [x] **T1305 — Keep Caddy and volumes.** Leave `Caddyfile`, `caddy_data` and `caddy_config` unchanged and never use `down -v`. **Done when:** the Compose file and Makefile preserve both volumes.
- [x] **T1306 — Update CI.** Trigger on pull requests and pushes to `main`, and build through `docker compose build` before the smoke test. **Done when:** the workflow uses the same build path as local and VPS deployments.
- [ ] **T1307 — Rename the default branch.** Rename the GitHub default branch from `master` to `main` and require review before merging. **Done when:** `origin/main` exists and branch protection is enabled. _Blocked: requires repository-admin action; no push performed._

## Acceptance criteria verification (local, 2026-10-30)

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Install, lint, format, check, unit tests, E2E and build succeed | Verified locally (frozen install, 30 unit tests, 20 Playwright tests, 17-page build) |
| 2 | Production build contains all locales, pages, sitemap, robots | Verified in `dist/` |
| 3 | `/` redirects, unknown paths return 404 | Verified in Caddy 2.10.2 (308 redirects, localized 404 bodies with status 404) |
| 4 | Language switcher preserves the current page | Verified by Playwright |
| 5 | `lang`, title, description, canonical, `hreflang`, `x-default` | Verified across all 16 content pages; the root redirect stub carries canonical + `noindex` and needs no hreflang |
| 6 | Staging emits `noindex` and a disallow-all robots file | Verified in build output and E2E negative control |
| 7 | No hardcoded user-facing strings; translation parity | Verified by typed dictionaries and unit tests |
| 8 | Keyboard, skip link, focus, mobile nav, contact links, axe | Verified by Playwright + axe |
| 9 | Image builds with Compose, serves via Caddy, no Node.js, passes smoke | **Partially verified:** `docker compose config` resolves the build and the Caddy runtime passes every smoke assertion against `dist/`; the image build is **blocked** (no Docker socket access locally) |
| 10 | VPS builds from latest `main`, HTTPS staging, no registry | **Blocked:** VPS preflight and TLS not started |
| 11 | VPS exposes only required ports, SSH keys, bounded logs | **Blocked:** bounded log config exists in `compose.yaml`; host hardening pending |
| 12 | Previous commit can be rebuilt and redeployed as rollback | **Blocked:** no deployment yet |
| 13 | CI passes on the feature branch and pull request into `main` | **Blocked:** branch is not pushed, so CI has not run |
| 14 | README documents setup, deployment, rollback, env, Make targets, domain switch | Verified by review |
| 15 | No database, CMS, analytics, quote form, email, uploads, or secrets | Verified: none present in `package.json`, source, or build output |
| 16 | Makefile targets exist and work locally and on the VPS | Verified statically with `make -n`; runtime verification **blocked** without Docker access |
| 17 | `down`/`deploy`/`clean` preserve Caddy config and volumes | Verified by review: no target uses `down -v` |
