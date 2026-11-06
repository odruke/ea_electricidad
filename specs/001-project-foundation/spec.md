# 001 — Project Foundation

- Status: Approved — implementation in progress
- Date: 2026-10-30
- Revision: 2026-11-02 — local-first delivery, owner-managed Git, no CI or registry
- Previous revision: 2026-11-01 — multi-container topology with a private Docker network and a Caddy edge proxy
- Branch: `feat/001-multi-container`
- Target branch: owner-managed; no fixed integration branch requirement
- Depends on: none
- Enables: `002-homepage`, `003-services`, `004-quote-request`

## 1. Purpose

Establish a deployable, multilingual, statically generated website foundation for **EA electricidad y multiservicios**. The foundation must prove the stack, localization model, brand shell, SEO and accessibility baseline, quality gates, and container deployment path so later specifications can add content and the quote form without rework.

The runtime is prepared as a multi-container system: Caddy is the single public edge and only exposed service, while the static site runs in its own internal container. A future backend must be addable to the same private network and routed through Caddy without changing the public entry point or publishing another port.

This specification does not deliver the finished marketing site, the quote form, any email/upload capability, or the backend itself.

## 2. Goals

- **G1 — Static public site:** Generate plain HTML, CSS, and minimal JavaScript. Production must not require a Node.js runtime for the public website.
- **G2 — Multilingual shell:** Serve Spanish, English, and French under explicit locale-prefixed URLs with a route-preserving language switcher.
- **G3 — Brand foundation:** Implement the approved palette, typography, layout shell, responsive navigation, and contact calls to action.
- **G4 — Discoverability and access:** Provide localized metadata, canonical URLs, `hreflang`, sitemap, robots rules, semantic structure, keyboard access, and an automated accessibility check.
- **G5 — Reproducible multi-container deployment:** Package the static output and the edge proxy as separate Docker images built with Docker Compose on the machine that runs the stack. Run each service in its own container on a private network, expose only Caddy, and document build, local deployment, rollback, portability, and the future backend extension point with no image registry.
- **G6 — Quality gates:** Provide linting, formatting, type checking, unit tests, end-to-end tests, a production build, and a Makefile for the repeatable container workflow. All gates run locally; the project does not depend on hosted CI.
- **G7 — Handoff readiness:** Document local setup, build, local deployment, rollback, domain switching, and the boundary for the future quote API.

## 3. Non-goals

- Quote-request form, validation, uploads, email delivery, acknowledgement emails, or protected file links.
- Final homepage, service, contact, legal, or privacy copy.
- CMS, admin dashboard, authentication, database, or external translation service.
- Analytics, advertising pixels, cookie consent, or marketing automation.
- Production domain, DNS, or email credentials.
- Provider-specific APIs, panels, or runtime services.
- A remote Docker image registry, image transfer between machines, or checked-in image artifacts.
- CI pipelines, GitHub workflows, or any automation that calls a hosting or Git provider.
- A backend, API, database, queue, or any future service implementation. This phase prepares only the network and reverse-proxy extension point.
- Publishing internal service ports to the host, or exposing any service other than the Caddy edge.
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
- **US5:** As the owner, I can deploy the current revision on a local or remote Docker host with `make build && make up`, and roll back by rebuilding an earlier revision.
- **US6:** As the business, I can review a staging site that is excluded from search indexes and contains no fabricated claims.
- **US7:** As a developer, I can build, start, stop, inspect and clean the same container workflow on any Docker-capable host with identical commands.
- **US8:** As a developer, I can add a future backend container to the private network and route it through Caddy without changing the public ports or exposing the backend directly.

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
- **R44:** Use a single multi-stage `Dockerfile` with two final targets: `web` (Astro build output served by Caddy over HTTP, with no Node.js runtime) and `edge` (Caddy reverse proxy and TLS terminator). Each target produces its own image.
- **R45:** Run the public edge in Caddy: terminate TLS, provide automatic HTTP-to-HTTPS redirect when an HTTPS address is configured, compress responses, apply security headers, normalize trailing slashes, redirect `/` to `/es/`, emit access logs, and reverse-proxy site traffic to the internal `web` service.
- **R46:** Run the static site in a separate `web` container that serves the build output over HTTP on the private network and returns localized 404 pages with HTTP 404.
- **R47:** Build all images with Docker Compose (`docker compose build`) on the machine that runs the stack, normally the development machine. Do not use a remote image registry.
- **R48:** Deploy locally by building the images from the current source and starting the services with `make build && make up`. Do not put Git commands inside the deployment path.
- **R49:** Roll back by checking out a previous known-good revision, rebuilding it, and starting the stack again; document the exact commands.
- **R50:** When HTTPS is required, use a domain that resolves to the host and allowed ports 80/443 so Caddy can issue a trusted certificate. Plain HTTP is acceptable for purely local verification.
- **R51:** Do not introduce provider-specific configuration. The deployment must work on any Docker-capable Linux host.
- **R52:** Treat the host as a generic prerequisite: Docker Engine with the Compose plugin, GNU Make, free ports 80/443 when TLS is used, and time synchronization. No provider-specific image or panel is required.
- **R53:** Keep host preparation minimal and reversible: install Docker and the Compose plugin, clone the repository into any directory, and keep `.env` out of Git. Record any host-specific prerequisite in the README instead of automating it.
- **R54:** Do not run privileged commands as part of the project's scripts. Any `sudo` step is performed by the owner outside the repository workflow.
- **R55:** Do not store credentials in the image or repository. Protect the environment file with mode 600 and keep it out of Git.
- **R56:** Configure Caddy access logging with bounded retention, or disable access logs if not needed. Do not log request bodies.
- **R57:** Document the static-hosting handoff requirements for a future client host: rewrite/redirect rules, 404 handling, TLS, and security headers.

### 6.8 Quality and local verification

- **R58:** Add unit tests for translation-key parity, locale path helpers, and configuration parsing.
- **R59:** Add Playwright tests for locale routes, root redirect, language switching, navigation, mobile menu, contact links, localized 404, staging `noindex`, and responsive layouts.
- **R60:** Add an axe accessibility scan for each locale with no serious or critical violations.
- **R61:** Provide a single local verification sequence — `pnpm validate`, `pnpm test:e2e`, `make build`, `make up`, `make smoke` — and document it. Do not add CI workflows or hosted pipelines.
- **R62:** Keep the build reproducible with `--frozen-lockfile`.
- **R63:** Provide a README covering setup, commands, environment variables, image build, local deployment, rollback, portability, and domain switching.

### 6.9 Git and documentation

- **R64:** The owner manages Git history: they add, commit, push, and deploy. Agents may create feature branches (`feat/NNN-name`) and must not commit, push, rebase, or reset unless explicitly asked. No pull-request gate or hosted review is required.
- **R65:** Do not commit generated output, dependencies, secrets, or environment files.
- **R66:** Update `MEMORY.md` with the resulting project state and any new pitfalls after implementation.
- **R67:** Provide a `Makefile` with `build`, `up`, `down`, `restart`, `logs`, `status`, `smoke` and `clean` targets.
- **R68:** The Makefile must not run Git commands and must not select a revision; deployment operates on the working tree the owner has checked out.
- **R69:** Preserve the `caddy_data` and `caddy_config` volumes across `down` and `clean`. Never document `docker compose down -v`.
- **R70:** Do not transfer images between machines. Every host builds from source with the same Compose file and Make targets.
- **R71:** Treat every deployment target outside the owner's machine as a demonstration environment unless separately specified: downtime and loss of application data are acceptable. Persistent Caddy volumes are still preserved.

### 6.10 Multi-container topology and extension points

- **R72:** Define separate Compose services for the public entry point (`edge`) and the static site (`web`). Each service runs in its own container and communicates over a user-defined Docker bridge network by service DNS name.
- **R73:** Publish host ports only on the edge service: TCP 80, TCP 443, and optionally UDP 443. The web service must declare `expose` only, never `ports`; no other service may publish a host port.
- **R74:** Route public traffic through the edge to `web:8080`. Reserve and document a path prefix (default `/api/*`) for future backend traffic so a backend can be added without changing public ports, hostnames, or the private network.
- **R75:** Do not implement the backend, API, database, or any future service in `001`. Prepare only the network, reverse-proxy extension point, image and target naming, health-check pattern, and documentation.
- **R76:** Give both services health checks. Start the edge only after the web service is healthy using `depends_on` with `condition: service_healthy`, and use `restart: unless-stopped` for both.
- **R77:** Attach the `caddy_data` and `caddy_config` volumes only to the edge service. Future services use their own named volumes; no Make target removes all volumes.
- **R78:** Ensure neither image contains Node.js, source code, build tooling, secrets, or environment files. The web image contains only the static output and its internal server configuration; the edge image contains only the proxy configuration.
- **R79:** Route future same-origin services through the edge under the reserved path prefix so the CSP `connect-src 'self'` and canonical URLs remain valid. Do not introduce CORS or an additional public hostname for the backend.
- **R80:** Document the topology, network name, service DNS names, health dependencies, and the step-by-step procedure for adding a future backend container without publishing ports.
- **R81:** Keep the Compose project name and service names deterministic so the network and containers are predictable in `make status`, `make logs`, and `docker compose exec`.

## 7. Acceptance criteria

1. `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm format:check`, `pnpm check`, `pnpm test`, `pnpm test:e2e`, and `pnpm build` succeed from a clean checkout.
2. The production build contains `/es/`, `/en/`, `/fr/`, localized service/contact/legal pages, a localized 404, sitemap, and robots file.
3. `/` permanently redirects to `/es/`; `/de/` and unknown localized paths return 404.
4. The language switcher preserves the current page in all three locales.
5. Every page has the correct `lang`, title, description, canonical, `hreflang`, and `x-default`.
6. Staging builds emit `noindex` metadata and a disallow-all `robots.txt`.
7. No user-facing string is hardcoded in a component; translation parity tests pass.
8. Keyboard navigation, skip link, focus visibility, mobile navigation, and contact links work. Axe reports no serious or critical issues.
9. `docker compose build` produces separate `edge` and `web` images from the multi-stage `Dockerfile`, and no image contains a Node.js runtime.
10. The edge and web services run in separate containers on the same user-defined Docker network and communicate by service DNS name.
11. Only the edge service publishes host ports. The web service has no published host port and is not reachable directly from the host.
12. The edge reverse proxy serves the site correctly: root redirect, trailing-slash normalization, all locales, localized 404 status and content, security headers, compression, and access logs.
13. `make build` produces both images on the host that runs the stack, with no registry and no image transfer, and `make up && make smoke` passes from a clean checkout plus `.env`.
14. The stack publishes only the edge ports; the web container remains unreachable from the host, and both services report healthy.
15. A previous known-good revision can be rebuilt and started successfully as a rollback.
16. The same `compose.yaml`, `Dockerfile`, and Make targets work unchanged on another Docker-capable host, with only `.env` values differing.
17. `README.md` documents setup, local deployment, rollback, portability, environment values, the Make targets, the multi-container topology, the network and service names, and the procedure for adding a future backend container.
18. The `Makefile` exposes `build`, `up`, `down`, `restart`, `logs`, `status`, `smoke` and `clean`, and contains no Git commands.
19. `down` and `clean` preserve the `caddy_data` and `caddy_config` volumes and the Caddy configuration.
20. No backend, database, CMS, analytics, quote form, email integration, upload capability, or production secret is introduced; only the network and reverse-proxy extension point are documented.

## 8. Edge cases and failure handling

- **HTTPS unavailable:** If a domain does not resolve to the host or Caddy cannot obtain a certificate because ports 80/443 are blocked, keep plain HTTP for local verification and do not present a public deployment as complete without explicit approval.
- **Host mismatch:** If the chosen host cannot run the required Docker packages, document the issue and request approval before changing the target.
- **Resource limits:** Some hosts build slowly with limited CPU, RAM, or disk. Run `make build` before `make up` to reduce peak container pressure, and prune old images or build cache when disk pressure appears.
- **Build fails:** The previously built images may still be present. `make up` must not serve a stale site silently; check `make status`, fix the source, and rebuild. Never copy a local image to another host.
- **Working tree drift:** Deployment builds whatever the owner has checked out. There is no automatic fetch or reset; the owner controls the revision.
- **Web unavailable:** If the web container is down or unhealthy, the edge returns `502`/`504` with security headers. `make status` shows the unhealthy service; fix it before presenting the site. The edge must not serve stale content.
- **Startup ordering:** The edge waits for a healthy web service through `depends_on`; a manual `docker compose up` must not race the proxy.
- **Accidental exposure:** If the web service publishes a host port, the topology is wrong. Review and the smoke checks must fail, and the port must be removed rather than firewalled.
- **Network or DNS mismatch:** If the edge cannot resolve `web` by service name, verify both services are on the same user-defined network and that the service name in the Caddy upstream matches Compose.
- **Future backend added:** A backend must join the same private network, publish no host port, expose a health check, and be routed through a dedicated path prefix on the edge. If it runs in a separate Compose project, it must attach to an explicitly shared external network; document that choice.
- **Future backend down:** The edge returns an error for the backend prefix without affecting static pages. Static routes must continue to work.
- **Missing translation:** A missing key, empty string, or extra key must fail the unit test and the build.
- **Invalid locale:** Unknown locales and unprefixed non-root paths return 404; they do not redirect to a guessed language.
- **Trailing slash:** Canonical links always include a trailing slash. Requests without it are redirected consistently.
- **JavaScript disabled:** Navigation, language switching, and contact methods remain usable.
- **Font failure:** The fallback stack must preserve layout and readability.
- **Staging indexed:** Automated tests must fail if staging output lacks `noindex`.
- **Domain change:** Switching to a real domain requires updated `SITE_URL`/`SITE_ADDRESS`, a new `web` image build, a restart, and certificate issuance.
- **Client static host:** Static files remain portable, but redirects, 404 handling, and headers require equivalent host configuration. Document the gap.
- **Future quote API:** `004` will add the quote API as an internal container on the private network, or, if explicitly approved, as an external endpoint. This specification must not couple the static site to a specific API host.

## 9. Assumptions

- The owner controls Git history, branch selection, and deployment; no hosted CI, review gate, or deployment automation is assumed.
- The machine that runs the stack has Docker Engine with Compose v2 supporting `depends_on` with `condition: service_healthy`, plus GNU Make.
- A Linux host with Docker can build the Astro and edge images from source with the pinned Node.js version inside the build stage; no Node.js is installed on the host.
- Caddy is reused as both the internal static server and the public edge proxy, so only one web-server technology is introduced.
- Traffic between the edge and internal services is plain HTTP on the private Docker network; TLS terminates at the edge.
- The future backend (`004`) will run as another container in the same Compose project on the `app` network by default. A separate Compose project would require an explicitly shared external network.
- `/api/*` is the reserved path prefix for the future backend.
- When a public HTTPS deployment is needed, the owner provides a domain that resolves to the host and free ports 80/443.
- The client’s eventual hosting can serve static files; if it cannot, the same containers remain deployable on any Docker-capable host.
- The existing `public/logo.jpg` (968×968, no transparency) is acceptable for the light staging header.
- Astro, Tailwind, and the selected Node.js LTS versions are compatible at implementation time.

## 10. PENDING decisions and inputs

- Final production domain and DNS access, needed only when a public deployment is approved.
- Confirmation from the owner that the host allows inbound TCP 80/443 (and UDP 443) before any public HTTPS deployment.
- Email credentials or transactional provider for `004`, not needed for this specification.
- Transparent or vector logo, needed before dark backgrounds or final brand polish.
- Retention and deletion rules for future quote submissions and uploads, to be defined in `004`.

## 11. Definition of done

The foundation is complete when all acceptance criteria are satisfied, `pnpm validate` and `pnpm test:e2e` pass, `make build && make up` starts a healthy stack on the owner's machine, `make smoke` passes locally, only the Caddy edge is publicly exposed, the edge and web services communicate over the private network, rollback is documented, and `MEMORY.md` reflects the new project state.
