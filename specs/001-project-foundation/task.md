# Tasks — 001 Project Foundation

- Status: Approved — implementation in progress; local stack verification pending
- Related spec: `specs/001-project-foundation/spec.md`
- Related plan: `specs/001-project-foundation/plan.md`
- Branch: `feat/001-multi-container`
- Target: owner-managed; no fixed integration branch requirement

Tasks are ordered. Do not start a phase until its dependencies are satisfied. Commands listed as target scripts become available during Phase 1. Verify each task before marking it complete.

## Phase 0 — Approval and preflight

- [x] **T001 — Approve the specification and plan.** Confirm scope, Astro static architecture, multi-container topology, local-first deployment, and owner-managed Git. **Done when:** the owner explicitly approves all three files.
- [x] **T002 — Confirm the delivery model.** The owner handles commits, pushes, and deployment; the agent may create branches but never commits unasked. **Done when:** the workflow is recorded in `AGENTS.md`.
- [x] **T003 — Confirm the local target.** Deployment is `make build && make up` on any Docker-capable host; no registry, no VPS-specific configuration, no CI. **Done when:** the spec and plan reflect the local-first contract.
- [ ] **T004 — Verify host prerequisites.** Confirm Docker Engine, the Compose plugin, GNU Make, disk headroom, and time synchronization on the machine that runs the stack. **Done when:** prerequisites are confirmed by the owner.
- [x] **T005 — Remove hosted automation.** Delete the GitHub Actions workflow and any provider-specific deployment step. **Done when:** `.github/` is gone and no document references CI or `make deploy`.

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
- [ ] **T808 — Add container smoke script.** Create `scripts/smoke.sh` for health, redirects, locales, localized 404, headers, assets, only-edge exposure, and absence of Node.js in both runtime images. **Done when:** the script passes against the local Compose stack.

## Phase 9 — Container and Caddy

- [ ] **T901 — Create the multi-stage Dockerfile.** Build with Node.js 24 LTS and pnpm; expose `web` and `edge` targets based on Caddy. **Done when:** neither final image contains a Node.js runtime or source files.
- [x] **T902 — Create the Caddy configuration.** Configure TLS, compression, root redirect, trailing-slash normalization, locale 404 mapping, health endpoint, and security headers. **Done when:** curl smoke tests pass. _Requires the 2026-11-01 split into edge and web configs._
- [x] **T903 — Create `compose.yaml`.** Configure the build context, staging build arguments, local image tags, restart policy, ports, volumes, health checks, environment, log rotation, and least-privilege capabilities. **Done when:** `docker compose config` is valid. _Requires the 2026-11-01 multi-service refactor._
- [ ] **T904 — Build the local images.** Build with `make build` using staging `SITE_URL` and `SITE_ENV`. **Done when:** the Compose stack serves all routes over HTTP through the edge.
- [ ] **T905 — Run the smoke script.** Verify health, root redirect, trailing slash, locales, 404 status/content, headers, and `noindex`. **Done when:** every assertion passes.
- [ ] **T906 — Verify image hygiene.** Inspect both final images for Node.js, source files, `.env` files, and build tools. **Done when:** none are present.
- [x] **T907 — Add the Makefile.** Provide `build`, `up`, `down`, `restart`, `logs`, `status`, `smoke` and `clean`, plus `help`. **Done when:** `make -n` succeeds for every target and no target runs Git commands.
- [x] **T908 — Preserve volumes and Caddy configuration.** Ensure no target uses `down -v` and the `caddy_data`/`caddy_config` volumes remain declared. **Done when:** the Compose file and Makefile preserve both volumes.

## Phase 10 — Local verification and Git workflow

- [x] **T1001 — Remove hosted CI.** Delete `.github/workflows/ci.yml` and document the local check sequence instead. **Done when:** no workflow file or CI reference remains.
- [ ] **T1002 — Verify frozen installs locally.** Run `pnpm install --frozen-lockfile`. **Done when:** a lockfile mismatch fails the install. _Previously verified; re-run after the workflow change._
- [x] **T1003 — Verify staging checks.** Run E2E with `SITE_ENV=staging` so `noindex` is exercised. **Done when:** the staging assertion fails when the directive is removed. _Verified 2026-10-30: the noindex and disallow-all robots tests fail against a production build and pass against a staging build._
- [x] **T1004 — Verify production robots separately.** Add unit coverage for production robots output. **Done when:** production is allowed and references the sitemap. _Covered by `tests/unit/robots.test.ts`._
- [x] **T1005 — Keep deployment manual.** Do not add an automatic deployment workflow or Make target; the owner deploys with `make build && make up`. **Done when:** neither CI nor the Makefile performs a deployment on its own.
- [x] **T1006 — Record the Git contract.** Document that the owner commits, pushes, and deploys, and that agents only create `feat/NNN-name` branches. **Done when:** `AGENTS.md` and the README agree.

## Phase 11 — Local deployment and portability

- [ ] **T1101 — Build both images locally.** Run `make build` with the host's `.env`. **Done when:** both application images build and `docker compose config` resolves them.
- [ ] **T1102 — Start and verify the stack.** Run `make up`, `make status`, and `make smoke`. **Done when:** both services are healthy and every smoke assertion passes.
- [ ] **T1103 — Verify the `web` container.** Confirm the container stays up and healthy instead of restarting; inspect logs if it fails. **Done when:** `docker compose ps` reports `web` as healthy over time.
- [ ] **T1104 — Verify image hygiene.** Inspect both final images for Node.js, source files, `.env` files, and build tools. **Done when:** none are present.
- [ ] **T1105 — Demonstrate rollback.** Check out a previous revision, run `make build && make up`, verify it, then return to the current branch. **Done when:** rollback by rebuild is proven and documented.
- [ ] **T1106 — Verify another host.** Repeat build, start, and smoke on a second Docker-capable host with only `.env` changed. **Done when:** the stack runs unchanged there.
- [ ] **T1107 — Verify resources and disk.** Check free space, image count, build cache, and log size. **Done when:** the host has comfortable headroom and `caddy_data`/`caddy_config` are intact.

## Phase 12 — Documentation, review, and memory

- [x] **T1201 — Complete the README.** Document architecture, commands, environment values, local Compose build, Make targets, local deployment, rollback by rebuild, portability, domain switching, and static-host handoff requirements. **Done when:** the documented path matches a clean run. _Requires the 2026-11-01 topology update and the 2026-11-02 local-first update._
- [ ] **T1202 — Record the local verification state.** Note the host used, `.env` values in use (without secrets), and the remaining Docker-only gaps. **Done when:** the owner can reproduce the run.
- [x] **T1203 — Review against acceptance criteria.** Walk through every criterion in `spec.md`. **Done when:** each is verified or explicitly marked blocked. _See the verification table below._
- [ ] **T1204 — Review security and privacy.** Confirm no secrets, no data collection, no analytics, bounded logs, and staging indexing protection. **Done when:** the checklist is complete. _Source, logs, and indexing rules verified locally; host hardening and firewall rules are the owner's responsibility._
- [x] **T1205 — Update `MEMORY.md`.** Record the implemented stack, deployment path, decisions, pitfalls, and next steps, keeping the file concise. **Done when:** the memory reflects the real state.
- [ ] **T1206 — Hand off to the owner.** Provide a summary of changed files, checks actually run, and remaining limitations. **Done when:** the owner commits and deploys on their own schedule. **Do not open a pull request or push.**

## Revision 2026-10-30 — local builds, VPS builds from `main`, no registry

The owner replaced the registry-based delivery with source builds: images are built with Docker Compose locally and again on the VPS, and the VPS deploys only the `main` branch. The VPS is a staging/demonstration host where downtime and application data loss are acceptable, but Caddy volumes are preserved.

- [x] **T1301 — Remove the registry.** Delete every image-registry reference from Compose, documentation, tasks, and memory; require `SITE_URL` at build time. **Done when:** no registry or image-tag reference remains.
- [x] **T1302 — Build with Compose.** Add `build.args` for `SITE_URL`/`SITE_ENV` and local image tags in `compose.yaml`. **Done when:** `docker compose config` resolves the build.
- [x] **T1303 — Add the Makefile.** Ship `help`, `build`, `up`, `down`, `restart`, `logs`, `status`, `smoke`, `deploy` and `clean`. **Done when:** every target passes `make -n`.
- [x] **T1304 — Define the VPS deploy sequence.** `deploy` stops services, removes the previous images, syncs `origin/main`, rebuilds, and starts with health waiting. **Done when:** the recipe order matches the approved workflow. _Superseded by the 2026-11-02 revision: `deploy` was removed._
- [x] **T1305 — Keep Caddy and volumes.** Leave `Caddyfile`, `caddy_data` and `caddy_config` unchanged and never use `down -v`. **Done when:** the Compose file and Makefile preserve both volumes.
- [x] **T1306 — Update CI.** Trigger on pull requests and pushes to `main`, and build through `docker compose build` before the smoke test. **Done when:** the workflow uses the same build path as local and VPS deployments. _Superseded by the 2026-11-02 revision: CI was deleted._
- [ ] **T1307 — Rename the default branch.** Rename the GitHub default branch from `master` to `main` and require review before merging. **Done when:** `origin/main` exists and branch protection is enabled. _Dropped by the 2026-11-02 revision: the owner manages Git and no branch protection or CI gating is required._

## Revision 2026-11-01 — multi-container topology

The owner requires each service to run in its own container on a Docker network, with Caddy as the only exposed service. The static site moves into an internal `web` container; a public `edge` Caddy container terminates TLS and reverse-proxies to it. A future backend must be addable to the same network and routed through the edge without publishing another port. The backend itself is out of scope for `001`.

- [x] **T1401 — Split the Caddy configuration.** Create `Caddyfile` for the public edge (TLS, compression, security headers, root and trailing-slash redirects, access logs, proxy to `web:8080`) and `Caddyfile.web` for the internal static server (files, health, localized 404 mapping). **Done when:** the edge preserves the web 404 status and body, and headers apply to proxied and error responses. _Verified with a local Caddy 2.10.2 edge+web pair: 404 status/content preserved and headers present on proxied and error responses._
- [x] **T1402 — Add `web` and `edge` Dockerfile targets.** Produce `ea-electricidad-web:local` and `ea-electricidad-edge:local`; keep Node.js only in the build stage. **Done when:** both final images pass the hygiene check. _Targets implemented; image hygiene check **blocked** because Docker is unavailable to the current user._
- [x] **T1403 — Refactor Compose into a multi-service stack.** Add a deterministic project name, a private `app` network, `edge` with the only published ports and Caddy volumes, and `web` with no `ports` and `expose: 8080`. Add health checks and `depends_on: condition: service_healthy`. **Done when:** `docker compose config` shows only the edge publishing ports. _`docker compose config` verified: only `edge` has ports and volumes._
- [x] **T1404 — Update the Makefile and deploy sequence.** `build` builds both images; `deploy` removes both application images before rebuilding; `status`, `logs`, and `smoke` operate on the whole stack; volumes remain preserved. **Done when:** every target passes `make -n` and the deploy order is unchanged. _`make -n` verified for every target. `deploy` was later removed by the 2026-11-02 revision._
- [x] **T1405 — Adapt smoke and CI to the stack.** Start the stack with `docker compose up -d --wait`, run smoke against the edge, assert the web service has no host port, verify internal DNS reachability, and check both images for Node.js. **Done when:** CI exercises the same multi-service path. _Smoke updated; the CI half is obsolete after the 2026-11-02 revision, which deleted hosted CI._
- [x] **T1406 — Document the architecture and backend extension.** Update the README with the diagram, network and service names, exposure rules, and the step-by-step procedure for adding a future backend on `/api/*` with no host port. **Done when:** a developer can add the backend without redesigning the stack. _README updated and reviewed._
- [x] **T1407 — Verify locally.** Run config validation, `make -n`, the full Node quality gates, and the stack smoke test where Docker access exists. **Done when:** results are recorded and Docker-only gaps are marked blocked. _Caddy configs validate; `make -n`, lint, format, check, 30 unit tests, 20 Playwright tests, build and a local edge+web Caddy smoke pass. Docker stack smoke is **blocked**._
- [x] **T1408 — Refresh memory.** Update `MEMORY.md` and the `AGENTS.md` repository-state block with the new topology and extension point. **Done when:** both files match the implementation.

## Revision 2026-11-02 — local-first delivery, owner-managed Git, no CI

The owner now owns Git history and deployment: commits, pushes, and deploys happen outside the agent's work, and the agent may only create `feat/NNN-name` branches. The project targets local deployment with `make build && make up` and must stay portable to any Docker-capable host. No GitHub automation, no registry, and no VPS-specific configuration remain. `sudo` commands are run by the owner.

- [x] **T1501 — Delete hosted CI.** Remove `.github/workflows/ci.yml` and the `.github/` directory. **Done when:** no CI file or workflow reference remains.
- [x] **T1502 — Simplify the Makefile.** Remove `deploy` and every Git command; keep `help`, `build`, `up`, `down`, `restart`, `logs`, `status`, `smoke`, `clean`. **Done when:** `make -n` succeeds and no target touches Git.
- [x] **T1503 — Neutralize `.env.example`.** Replace VPS/`sslip.io` examples with local defaults and a generic production-style example. **Done when:** no provider-specific hostname remains.
- [x] **T1504 — Update `AGENTS.md`.** Record the owner-managed Git contract, the no-CI/no-registry rule, the local-first deploy, and the no-`sudo` rule. **Done when:** the standing instructions match the new workflow.
- [x] **T1505 — Update the specification and plan.** Replace VPS, CI, `make deploy`, and `sslip.io` requirements with local-first, portability, and owner-managed Git requirements. **Done when:** the spec, plan, and task files agree.
- [x] **T1506 — Update the README.** Replace the CI, VPS, deploy, and rollback sections with local checks, local deployment, portability, and rollback by rebuild. **Done when:** every documented command exists in the Makefile or `package.json`.
- [x] **T1507 — Update `MEMORY.md`.** Record the local-first state, the open `web` container issue, and the next steps. **Done when:** the file is under ~50 lines and accurate.
- [x] **T1508 — Verify docs consistency.** Search the repository for stale `vps`, `github`, `sslip`, `make deploy`, and `ci.yml` references. **Done when:** only intentional mentions remain. _Verified: only historical "superseded/dropped" notes and the new "no CI/VPS" statements remain._
- [x] **T1509 — Re-run local checks.** Run `pnpm validate`, `bash -n scripts/smoke.sh`, and `make -n` after the documentation change. **Done when:** results are recorded. _`pnpm validate` and `format:check` pass; `bash -n` and `make -n` pass; `docker compose config` valid._
- [ ] **T1510 — Fix the `web` exec failure.** Strip the `cap_net_bind_service` file capability from `/usr/bin/caddy` in both image targets, because `cap_drop: ALL` yields an empty bounding set and `execve` returns EPERM. **Done when:** `make build && make up` reports both services healthy and `make smoke` passes. _Diagnosed from owner-provided logs (`exec /usr/bin/caddy: operation not permitted`, exit 255) and upstream caddy-docker #396/#466; fix implemented, verification pending rebuild._


## Acceptance criteria verification

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Install, lint, format, check, unit tests, E2E and build succeed | Verified locally (frozen install, 30 unit tests, 20 Playwright tests, 17-page build) |
| 2 | Production build contains all locales, pages, sitemap, robots | Verified in `dist/` |
| 3 | `/` redirects, unknown paths return 404 | Verified in Caddy 2.11.7 (308 redirects, localized 404 bodies with status 404) |
| 4 | Language switcher preserves the current page | Verified by Playwright |
| 5 | `lang`, title, description, canonical, `hreflang`, `x-default` | Verified across all 16 content pages; the root redirect stub carries canonical + `noindex` and needs no hreflang |
| 6 | Staging emits `noindex` and a disallow-all robots file | Verified in build output and E2E negative control |
| 7 | No hardcoded user-facing strings; translation parity | Verified by typed dictionaries and unit tests |
| 8 | Keyboard, skip link, focus, mobile nav, contact links, axe | Verified by Playwright + axe |
| 9 | Separate `edge`/`web` images build with Compose; no Node.js | **Blocked:** Docker unavailable locally; targets implemented and `docker compose config` resolves both |
| 10 | Both services on one private network, communicating by DNS | Implemented (`app` network, `depends_on`); runtime verification **blocked** by Docker access |
| 11 | Only the edge publishes host ports; web unreachable from host | Verified in `docker compose config`: only `edge` has `ports`; runtime verification **blocked** |
| 12 | Edge serves redirects, locales, localized 404 status, headers, compression | Verified with a local Caddy 2.11.7 edge+web pair against `dist/` |
| 13 | `make build` produces both images with no registry or image transfer; `make up && make smoke` pass | **Blocked:** Docker unavailable to the agent; `docker compose config` resolves both images |
| 14 | Only edge ports are published; web unreachable; both services healthy | Topology verified in `docker compose config`; runtime health was **blocked** by the Caddy file-capability/`exec` failure, fixed in the Dockerfile pending rebuild |
| 15 | A previous known-good revision can be rebuilt and started as rollback | **Blocked:** no owner-run deployment yet |
| 16 | Same files and targets work unchanged on another Docker-capable host | **Blocked:** no second host verified; no provider-specific config remains |
| 17 | README documents setup, local deployment, rollback, portability, topology, backend extension | Verified by review |
| 18 | Makefile exposes `build`, `up`, `down`, `restart`, `logs`, `status`, `smoke`, `clean` and contains no Git commands | Verified with `make -n`; runtime verification **blocked** without Docker access |
| 19 | `down`/`clean` preserve Caddy config and volumes | Verified by review: volumes attach only to `edge`; no target uses `down -v` |
| 20 | No backend, database, CMS, analytics, form, email, uploads, or secrets | Verified: none present in source or build output; `/api/*` and the `app` network are documented extension points only |
