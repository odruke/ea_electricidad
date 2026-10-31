# 001 — Project Foundation

- Status: Approved — implementation in progress
- Date: 2026-10-30
- Revision: 2026-10-30 — local Compose builds, VPS builds from `main`, no image registry
- Branch: `feat/001-project-foundation`
- Target branch: `main`
- Depends on: none
- Enables: `002-homepage`, `003-services`, `004-quote-request`

## 1. Purpose

Establish a deployable, multilingual, statically generated website foundation for **EA electricidad y multiservicios**. The foundation must prove the stack, localization model, brand shell, SEO and accessibility baseline, quality gates, and static deployment path so later specifications can add content and the quote form without rework.

This specification does not deliver the finished marketing site, the quote form, or any email/upload capability.

## 2. Goals

- **G1 — Static public site:** Generate plain HTML, CSS, and minimal JavaScript. Production must not require a Node.js runtime for the public website.
- **G2 — Multilingual shell:** Serve Spanish, English, and French under explicit locale-prefixed URLs with a route-preserving language switcher.
- **G3 — Brand foundation:** Implement the approved palette, typography, layout shell, responsive navigation, and contact calls to action.
- **G4 — Discoverability and access:** Provide localized metadata, canonical URLs, `hreflang`, sitemap, robots rules, semantic structure, keyboard access, and an automated accessibility check.
- **G5 — Reproducible deployment:** Package the static output in a Docker image served by Caddy. Build with Docker Compose on the development machine and on the staging VPS from the `main` branch, and document deployment and rollback with no image registry.
- **G6 — Quality gates:** Provide linting, formatting, type checking, unit tests, end-to-end tests, a production build, CI on GitHub, and a Makefile for the repeatable container workflow.
- **G7 — Handoff readiness:** Document local setup, build, deployment, rollback, domain switching, and the boundary for the future quote API.

## 3. Non-goals

- Quote-request form, validation, uploads, email delivery, acknowledgement emails, or protected file links.
- Final homepage, service, contact, legal, or privacy copy.
- CMS, admin dashboard, authentication, database, or external translation service.
- Analytics, advertising pixels, cookie consent, or marketing automation.
- Production domain, client DNS, or client email credentials.
- Infomaniak-specific APIs, panels, or runtime services.
- A remote Docker image registry, image transfer between machines, or locally built image artifacts on the VPS.
- A Node.js application server for the public site.
- Final logo replacement, vector logo design, or genuine project photography.

## 4. Users and stakeholders

- **Visitor:** Needs a fast, readable, localized site and an obvious way to contact the business.
- **Business owner:** Needs a private staging site to review the direction before providing hosting and domain access.
- **Developer or agent:** Needs deterministic commands, typed translations, and a documented architecture.
- **Future hosting provider:** Receives static output that can be served without application code.

## 5. User stories

- **US1:** As a visitor, I can open `/es/`, `/en/`, or `/fr/` and switch language without losing the page I am viewing.
- **US2:** As a mobile visitor, I can open the navigation, reach every page, and contact the business by phone, WhatsApp, or email.
- **US3:** As a search engine, I can discover canonical localized pages and their language alternates.
- **US4:** As a developer, I can install, run, test, and build the site using documented commands.
- **US5:** As an operator, I can deploy the latest `main` to the staging VPS from source with one Make target, and roll back by rebuilding an earlier commit.
- **US6:** As the business, I can review a staging site that is excluded from search indexes and contains no fabricated claims.
- **US7:** As a developer, I can build, start, stop, inspect and clean the same container workflow locally and on the VPS with identical commands.

## 6. Functional requirements

### 6.1 Stack and tooling

- **R1:** Use Astro with static output and TypeScript in strict mode.
- **R2:** Do not use Next.js or any other server-rendering framework for the public site.
- **R3:** Use pnpm with a committed lockfile and a pinned Node.js LTS version used only for development and builds.
- **R4:** Use Tailwind CSS with project design tokens. Do not introduce a component framework or client-side state library.
- **R5:** Provide scripts for development, build, preview, lint, format check, type check, unit tests, end-to-end tests, and a combined validation command.
- **R6:** Commit `.gitignore`, `.dockerignore`, `.nvmrc` or `.node-version`, and a `packageManager` declaration.

### 6.2 Localization and routing

- **R7:** Support exactly three locales in this phase: `es` (default), `en`, and `fr`.
- **R8:** Prefix every public page with its locale: `/es/...`, `/en/...`, `/fr/...`.
- **R9:** Redirect `/` to `/es/` with a permanent redirect.
- **R10:** Keep the same route slugs across locales (`services`, `contact`, `legal`, `404`) to simplify switching and canonical mapping. Localized slugs are a later SEO enhancement.
- **R11:** Do not auto-detect or persist a language preference in cookies. The language switcher is explicit.
- **R12:** The language switcher must preserve the current page and trailing-slash convention when changing locale.
- **R13:** Unknown locales and unknown localized routes must return HTTP 404 with localized content. Do not silently fall back to Spanish content on a localized URL.
- **R14:** Canonical URLs use the configured site URL, the locale prefix, and a trailing slash.

### 6.3 Layout and design

- **R15:** Provide a shared layout with a skip link, header, primary navigation, mobile navigation, language switcher, main landmark, and footer.
- **R16:** The header contains the existing logo, navigation, and a primary “Request a quote” call to action. Until `004` exists, this CTA links to the localized contact page.
- **R17:** The footer contains business name, phone, WhatsApp, email, working hours, confirmed service area, and links to the legal placeholder.
- **R18:** Mobile navigation must be keyboard operable and must not depend on JavaScript for basic access. Prefer a native disclosure pattern.
- **R19:** Apply the brand palette: primary blue `#00208f`, secondary yellow `#fad951`, and white `#ffffff`. Yellow is an accent, not a body-text color on white.
- **R20:** Use self-hosted fonts with a system-font fallback. No third-party font requests at runtime.
- **R21:** Target WCAG 2.2 AA contrast and focus visibility. Respect `prefers-reduced-motion`.
- **R22:** Provide placeholder pages for home, services overview, contact, legal, and 404. Use only approved business facts in temporary copy.
- **R23:** Use neutral, clearly non-photographic placeholders where project images will later appear. Do not use stock or fabricated project photos.
- **R24:** Keep the site usable with JavaScript disabled for navigation, language switching, and contact links.

### 6.4 Content and contact data

- **R25:** Store phone, WhatsApp, email, hours, service area, and brand values in one typed configuration module.
- **R26:** Phone link: `tel:+34668563287`. WhatsApp link: `https://wa.me/34668563287`, optionally with a localized prefilled message. Email link: `mailto:info@ea-electricidadymultiservicios.com`.
- **R27:** State working hours as Monday–Friday, 08:00–20:00. Never imply 24/7 availability.
- **R28:** Do not publish invented reviews, ratings, registration numbers, insurance details, certificates, project counts, addresses, or coverage.
- **R29:** Legal and privacy pages are placeholders marked for review. They must not contain fabricated legal text or claims of GDPR compliance.
- **R30:** All user-facing text, including navigation, metadata, form-free contact prompts, and the 404 page, comes from translation dictionaries.

### 6.5 SEO

- **R31:** Generate localized page titles and meta descriptions from translations.
- **R32:** Emit canonical and `hreflang` links for `es`, `en`, `fr`, plus `x-default` pointing to the Spanish page.
- **R33:** Generate a sitemap containing all localized pages and language alternates.
- **R34:** Generate `robots.txt`: allow crawling in production and disallow all crawling in staging.
- **R35:** Add `noindex` robots metadata to every page in staging builds.
- **R36:** Use semantic headings, one `h1` per page, and a logical landmark structure.
- **R37:** Do not add structured data until the claims and business details are verified.

### 6.6 Configuration and environments

- **R38:** Support `SITE_URL` (absolute public base URL), `SITE_ENV` (`staging` or `production`), and the deployment-only `SITE_ADDRESS` used by Caddy.
- **R39:** Validate configuration at build time and fail clearly when required values are missing or malformed.
- **R40:** Do not place secrets in client-visible variables, source code, images, or documentation.
- **R41:** Document that `SITE_URL` and `SITE_ENV` are build-time values; changing the domain or indexing mode requires a rebuild.
- **R42:** Provide `.env.example` with non-secret example values.

### 6.7 Build, container, and deployment

- **R43:** Produce a static `dist/` directory from `pnpm build`.
- **R44:** Use a multi-stage Docker build: Node.js build stage, Caddy static-serving stage. The final image must contain no Node.js runtime.
- **R45:** Serve the site with Caddy using automatic HTTPS, compression, security headers, trailing-slash normalization, and locale-aware 404 handling.
- **R46:** Provide `compose.yaml` for the Caddy container with restart policy, health check, log rotation, and persistent Caddy certificate volumes.
- **R47:** Build the Docker image with Docker Compose (`docker compose build`) on the development machine and on the staging VPS. Do not use a remote image registry.
- **R48:** Deploy on the VPS by stopping the services, removing the previous application image, fetching the latest `main` source, rebuilding the image, and starting the services again.
- **R49:** Roll back by checking out a previous known-good commit and rebuilding it; document the exact commands.
- **R50:** Use the temporary staging address `https://<VPS_IP>.sslip.io` only if HTTPS certificate issuance succeeds.
- **R51:** Do not introduce Infomaniak-specific configuration. The deployment must work on any Docker-capable Linux host.
- **R52:** Use Ubuntu Server 24.04 LTS, subject to compatibility checks. Record any fallback to 22.04 LTS.
- **R53:** Verify before deployment: sudo access, SSH key access, OS version, resources, disk, time synchronization, firewall, and inbound ports 80/443.
- **R54:** Harden the host with a non-root deployment user, SSH-key authentication, UFW rules for 22/80/443, unattended upgrades, and Docker log rotation. Keep additional tooling minimal.
- **R55:** Do not store credentials in the image or repository. Protect the deployment environment file with mode 600 and keep it out of Git.
- **R56:** Configure Caddy access logging with bounded retention, or disable access logs if not needed. Do not log request bodies.
- **R57:** Document the static-hosting handoff requirements for a future client host: rewrite/redirect rules, 404 handling, TLS, and security headers.

### 6.8 Quality and CI

- **R58:** Add unit tests for translation-key parity, locale path helpers, and configuration parsing.
- **R59:** Add Playwright tests for locale routes, root redirect, language switching, navigation, mobile menu, contact links, localized 404, staging `noindex`, and responsive layouts.
- **R60:** Add an axe accessibility scan for each locale with no serious or critical violations.
- **R61:** Add GitHub Actions CI on pull requests and pushes to `main` running install, lint, format check, type check, unit tests, build, and end-to-end tests.
- **R62:** Keep the build reproducible with `--frozen-lockfile`.
- **R63:** Provide a README covering setup, commands, environment variables, image build, deployment, rollback, and domain switching.

### 6.9 Git and documentation

- **R64:** Work on feature branches and target `main` through a pull request with manual review. The VPS deploys only from `main`.
- **R65:** Do not commit generated output, dependencies, secrets, or environment files.
- **R66:** Update `MEMORY.md` with the resulting project state and any new pitfalls after implementation.
- **R67:** Provide a `Makefile` with `build`, `up`, `down`, `restart`, `logs`, `status`, `deploy` and `clean` targets.
- **R68:** The `deploy` target is VPS-only and runs, in order: stop services, remove the previous application image, fetch `main`, rebuild, start services.
- **R69:** Preserve the `caddy_data` and `caddy_config` volumes across `down`, `deploy` and `clean`. Never document `docker compose down -v`.
- **R70:** Do not transfer images between machines. Every environment builds from source with the same Compose file and Make targets.
- **R71:** Treat the VPS as a staging and demonstration environment: downtime and loss of application data are acceptable. Persistent Caddy volumes are still preserved.

## 7. Acceptance criteria

1. `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm format:check`, `pnpm check`, `pnpm test`, `pnpm test:e2e`, and `pnpm build` succeed from a clean checkout.
2. The production build contains `/es/`, `/en/`, `/fr/`, localized service/contact/legal pages, a localized 404, sitemap, and robots file.
3. `/` permanently redirects to `/es/`; `/de/` and unknown localized paths return 404.
4. The language switcher preserves the current page in all three locales.
5. Every page has the correct `lang`, title, description, canonical, `hreflang`, and `x-default`.
6. Staging builds emit `noindex` metadata and a disallow-all `robots.txt`.
7. No user-facing string is hardcoded in a component; translation parity tests pass.
8. Keyboard navigation, skip link, focus visibility, mobile navigation, and contact links work. Axe reports no serious or critical issues.
9. The Docker image builds with Docker Compose, serves the site through Caddy, includes no Node.js runtime, and passes a local smoke test.
10. The VPS builds the image from the latest `main` source and serves it over HTTPS at the staging address. No image registry or image transfer is involved.
11. The VPS exposes only the required ports, uses SSH keys, and has bounded Docker logs.
12. A previous known-good commit can be rebuilt and redeployed successfully as a rollback.
13. CI passes on the feature branch and on the pull request into `main`.
14. `README.md` documents setup, deployment, rollback, environment values, the Make targets, and the domain-switch rebuild.
15. No database, CMS, analytics, quote form, email integration, upload capability, or production secret is introduced.
16. The `Makefile` exposes `build`, `up`, `down`, `restart`, `logs`, `status`, `deploy` and `clean`, and the same targets work locally and on the VPS.
17. `down`, `deploy` and `clean` preserve the `caddy_data` and `caddy_config` volumes and the Caddy configuration.

## 8. Edge cases and failure handling

- **HTTPS unavailable:** If `sslip.io` does not resolve or Caddy cannot obtain a certificate because ports 80/443 are blocked, stop and report. Do not present an HTTP-only staging site as complete without explicit approval.
- **VPS mismatch:** If Ubuntu 24.04 cannot run the required Docker packages or conflicts with the provider image, document the issue and request approval before falling back to 22.04 LTS.
- **Resource limits:** The VPS has 1 vCPU, 2 GB RAM, and 20 GB storage. Building there is expected but slow; `deploy` stops the service first to free memory, and old images and build cache are pruned when disk pressure appears.
- **VPS build fails:** The running site stays down or on the previous container state; fix the commit on `main` and redeploy. Never copy a local image to the VPS.
- **Branch drift:** The VPS deploy hard-resets its working copy to `origin/main` and discards local tracked changes. Uncommitted VPS edits are not a deployment mechanism.
- **Missing translation:** A missing key, empty string, or extra key must fail the unit test and the build.
- **Invalid locale:** Unknown locales and unprefixed non-root paths return 404; they do not redirect to a guessed language.
- **Trailing slash:** Canonical links always include a trailing slash. Requests without it are redirected consistently.
- **JavaScript disabled:** Navigation, language switching, and contact methods remain usable.
- **Font failure:** The fallback stack must preserve layout and readability.
- **Staging indexed:** Automated tests must fail if staging output lacks `noindex`.
- **Domain change:** Switching to the client domain requires updated `SITE_URL`/`SITE_ADDRESS`, a new image build, redeployment, and certificate issuance.
- **Client static host:** Static files remain portable, but redirects, 404 handling, and headers require equivalent host configuration. Document the gap.
- **Future quote API:** `004` may add a separate API service or serverless endpoint. This specification must not couple the static site to a specific API host.

## 9. Assumptions

- The GitHub repository integrates through `main`, and the default branch is renamed from `master` to `main`.
- The Infomaniak VPS can run Docker, can build the Astro image within its 1 vCPU / 2 GB / 20 GB budget, and receives inbound traffic on ports 80 and 443.
- The `sslip.io` hostname resolves to the VPS IPv4 address and permits trusted certificate issuance.
- The client’s eventual hosting can serve static files; if it cannot, the site remains deployable on the VPS.
- The existing `public/logo.jpg` (968×968, no transparency) is acceptable for the light staging header.
- Astro, Tailwind, and the selected Node.js LTS versions are compatible at implementation time.

## 10. PENDING decisions and inputs

- Rename the GitHub default branch from `master` to `main` and enable the pull-request review required by this workflow.
- VPS access details: IP address, SSH user, key, sudo policy, OS image, firewall state.
- Confirmation that ports 80 and 443 are reachable from the public internet.
- Final production domain and DNS access, needed only after approval of the staging site.
- Email credentials or transactional provider for `004`, not needed for this specification.
- Transparent or vector logo, needed before dark backgrounds or final brand polish.

## 11. Definition of done

The foundation is complete when all acceptance criteria are satisfied, CI is green on `main`, the staging site is reachable over HTTPS and excluded from indexing, the VPS builds and deploys from `main`, rollback is documented and demonstrated, and `MEMORY.md` reflects the new project state.
