# Implementation Plan — 001 Project Foundation

- Status: Approved — implementation in progress
- Revision: 2026-11-02 — local-first delivery, owner-managed Git, no CI or registry
- Previous revision: 2026-11-01 — multi-container topology with a private Docker network and a Caddy edge proxy
- Related specification: `specs/001-project-foundation/spec.md`
- Branch: `feat/001-multi-container`
- Target: owner-managed; no fixed integration branch requirement

## 1. Summary

Build the public website as an Astro static site and run it as a multi-container Docker Compose stack: an internal `web` container serves the static output over HTTP, and a public `edge` Caddy container terminates TLS, applies headers and redirects, and reverse-proxies to `web`. Only the edge publishes host ports. The public site has no production Node.js runtime.

The private network and reverse-proxy extension point are prepared now so a future backend can be added as another internal container and routed through the edge without changing the public entry point. The backend itself is deferred to `004`.

Images are built from source with Docker Compose on the machine that runs the stack. There is no image registry and no image transfer: a rebuild followed by a restart is the deployment. Rollback means rebuilding an earlier revision.

The first deployment uses plain HTTP locally (`SITE_ADDRESS=:80`). A public HTTPS address is added later by pointing a domain at the host and rebuilding with the production site URL and indexing mode.

## 2. Confirmed decisions

| Area | Decision |
|---|---|
| Public architecture | Astro static output; no Next.js |
| Production runtime | Caddy edge proxy plus an internal Caddy static container; no Node.js |
| Containers | `edge` and `web`, one service per container |
| Network | User-defined Docker bridge; services addressed by DNS name |
| Public exposure | Only the `edge` publishes TCP 80/443 and UDP 443 |
| Internal exposure | `web` uses `expose` only; no host port |
| Quote backend | Deferred to `004`; joins the private network and is routed through the edge |
| Backend path prefix | Reserved `/api/*`, not implemented in `001` |
| Staging address | Plain HTTP locally; public HTTPS only when a domain and ports 80/443 are available |
| Host | Any Docker-capable Linux host with Docker Engine, the Compose plugin, and GNU Make |
| Image build | Docker Compose on the machine that runs the stack |
| Deployment | Local `make build && make up`; no image transfer, no remote deploy |
| Registry | None |
| Git workflow | Owner-managed; agents may create `feat/NNN-name` branches and never commit unasked |
| CI | None; checks run locally before deployment |
| Translations | Code-based Spanish, English, and French; no CMS |
| Infrastructure | Docker, Docker Compose, and a Makefile; no provider-specific services |
| Indexing | Staging is `noindex`; production enables crawling |
| Environment criticality | Demonstration deployments tolerate downtime and application data loss |

## 3. Architecture

### 3.1 Runtime shape

```text
Local host
  ├─ make build ──► docker compose build ──► edge + web images
  └─ make up ─────► docker compose up -d --wait
       │
       ├─ edge · Caddy · published 80/443 (TCP + UDP)
       │    ├─ terminates TLS with Let's Encrypt
       │    ├─ redirects HTTP → HTTPS, `/` → `/es/`, adds trailing slashes
       │    ├─ compression, security headers, access logs
       │    ├─ `/healthz` on an internal port
       │    └─ reverse_proxy → web:8080
       │         └─ future: `/api/*` → backend:3000
       │
       └─ app network · private bridge
            └─ web · Caddy · no host ports
                 ├─ serves /srv (static dist/) over HTTP
                 └─ maps localized 404 pages
```

- No application server, database, cache, or queue in `001`.
- `edge` and `web` run in separate containers and communicate over a user-defined bridge network by service name.
- Only `edge` publishes ports. The web container is unreachable directly from the host.
- The `edge` image contains the proxy configuration only; the `web` image contains the static output and its internal server configuration.
- A future `backend` service is represented only by documentation and a reserved route; no container is added in this phase.
- The same `compose.yaml`, `Dockerfile`, Caddy files, and Make targets are used on any Docker-capable host.

### 3.2 Build-time versus runtime

- `SITE_URL`, `SITE_ENV`, and all page content are build-time inputs passed as Compose build arguments to the `web` image.
- `SITE_ADDRESS` is a runtime Caddy variable used by the edge for certificate issuance and host matching.
- `.env` supplies both; it is never committed.
- Changing the domain or indexing mode requires a new `web` image build (`make build` before `make up`).

## 4. Technology choices

| Concern | Choice | Rationale |
|---|---|---|
| Framework | Astro, current stable | Static output, content-focused, minimal JavaScript, built-in i18n routing |
| Language | TypeScript strict | Catch translation and route errors at build time |
| Package manager | pnpm with committed lockfile | Deterministic installs, reproducible local checks |
| Build runtime | Node.js 24 LTS, pinned | Build-only; no production Node.js |
| Styling | Tailwind CSS v4 with CSS theme tokens | Small CSS surface, brand tokens, no runtime CSS-in-JS |
| i18n | Astro routing plus typed TypeScript dictionaries | No external service; compile-time key checking |
| Env validation | Zod | Clear build failures for missing or malformed values |
| Unit tests | Vitest | Fast tests for translations, routes, and configuration |
| Browser tests | Playwright | Locale, navigation, responsive, and accessibility coverage |
| Accessibility | `@axe-core/playwright` | Automated serious/critical violation detection |
| Lint/format | ESLint with Astro plugin, Prettier with Astro plugin | Consistent source and templates |
| Server | Caddy 2 edge proxy and internal static server | Automatic HTTPS, compression, reverse proxy, headers, small footprint in both roles |
| Container | Docker multi-stage with `web` and `edge` targets | Separate images, reproducible deployment |
| Orchestration | Docker Compose multi-service + Makefile | One workflow on any Docker-capable host |
| Network | User-defined Docker bridge | Private service-to-service DNS; only the edge publishes ports |
| Registry | None | Every host builds from source; no image transfer |
| CI | None | All checks run locally; no hosted pipeline |

Do not add React, a client-side router, a state library, a CMS, or an analytics package in this phase.

## 5. Repository structure

```text
.
├── public/
│   ├── logo.jpg
│   └── placeholders/              # neutral, non-photographic assets
├── src/
│   ├── components/
│   │   ├── layout/                # Header, MobileNav, LanguageSwitcher, Footer
│   │   ├── seo/                   # Seo.astro
│   │   └── ui/                    # ButtonLink, Container, Section, PlaceholderMedia
│   ├── config/
│   │   ├── env.ts                 # Zod-validated build configuration
│   │   └── site.ts                # phone, WhatsApp, email, hours, service area
│   ├── i18n/
│   │   ├── index.ts               # locales, dictionaries, route helpers
│   │   └── messages/              # es.ts, en.ts, fr.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro            # root redirect fallback for preview
│   │   ├── robots.txt.ts          # environment-aware robots
│   │   └── [locale]/
│   │       ├── index.astro
│   │       ├── services.astro
│   │       ├── contact.astro
│   │       ├── legal.astro
│   │       └── 404.astro
│   ├── styles/global.css
│   └── lib/
│       ├── routes.ts              # path and locale helpers
│       └── seo.ts                 # canonical and alternate URL builders
├── tests/
│   ├── unit/
│   └── e2e/
├── astro.config.mjs
├── Caddyfile                      # public edge: TLS, headers, redirects, reverse proxy
├── Caddyfile.web                  # internal static server and localized 404 mapping
├── compose.yaml                   # edge + web services, private network
├── Dockerfile                     # build stage plus `web` and `edge` targets
├── Makefile
├── playwright.config.ts
├── vitest.config.ts
├── eslint.config.js
├── .prettierrc.json
├── .prettierignore
├── .env.example
├── .gitignore
├── .dockerignore
├── .nvmrc
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── README.md
```

The existing `public/logo.jpg` stays in place for this phase. Do not generate a replacement logo or fabricate project imagery.

## 6. Routing and localization

### 6.1 Astro configuration

- `output: 'static'`
- `trailingSlash: 'always'`
- `i18n.defaultLocale: 'es'`
- `i18n.locales: ['es', 'en', 'fr']`
- `i18n.routing.prefixDefaultLocale: true`
- `i18n.routing.redirectToDefaultLocale: false`
- `site` loaded from validated `SITE_URL`

`redirectToDefaultLocale` is disabled to avoid a duplicate build route between Astro's
generated index redirect and the project's own `src/pages/index.astro`. That page performs
`Astro.redirect('/es/', 301)`, which the static build emits as a zero-delay meta refresh with
a canonical URL. Caddy enforces the authoritative `308` redirect to `/es/` in production.

### 6.2 Routes

| Route | Purpose |
|---|---|
| `/` | Permanent redirect to `/es/` |
| `/{locale}/` | Home placeholder |
| `/{locale}/services/` | Five service categories, overview only |
| `/{locale}/contact/` | Phone, WhatsApp, email, hours, service area |
| `/{locale}/legal/` | Legal and privacy placeholder, marked for review |
| `/{locale}/404/` | Localized not-found content |
| Any unknown locale or localized path | HTTP 404 with the matching localized 404 page |

Shared slugs are used in all locales. The language switcher replaces only the locale segment.

### 6.3 Dictionaries

- `es.ts` is the source of truth; `en.ts` and `fr.ts` use `satisfies Dictionary`.
- Do not declare the Spanish dictionary with `as const`. That would infer literal Spanish strings and make other locales fail type checking. Use a widened `Dictionary` type or a widening helper.
- Dictionaries cover navigation, footer, CTAs, page copy, metadata, contact prompts, and the 404 page.
- No user-facing string is written directly in an Astro component.
- A Vitest test recursively compares key paths and leaf types, rejects empty strings, and rejects missing or extra keys.

### 6.4 Language switching

- Links point to the equivalent page in the target locale.
- The current route is preserved; shared slugs make the mapping deterministic.
- Language names are shown in their own language (`Español`, `English`, `Français`).
- The switcher uses `<a>` links with `hreflang` and works without JavaScript.
- No cookie, browser-language detection, or redirect loop.

## 7. Design system

### 7.1 Direction

Professional and technical, not decorative: deep blue structural surfaces, white reading surfaces, yellow reserved for primary actions and small highlights, strong typographic hierarchy, generous spacing, thin rules, and restrained motion.

### 7.2 Tokens

- Brand blue: `#00208f`
- Brand yellow: `#fad951`
- White: `#ffffff`
- Derived neutral ink and muted text colors with AA contrast on their intended backgrounds
- Spacing scale, container width, radii, border colors, and focus ring tokens

Yellow is not used for body text on white. White text is not used on yellow.

### 7.3 Typography

- Initial pairing: Space Grotesk for headings and Source Sans 3 for body.
- Self-host via Fontsource variable packages or local WOFF2 files if a package is unavailable.
- Preload the critical font and use `font-display: swap`.
- Provide a system-font fallback stack that preserves layout.

### 7.4 Components and pages

- `BaseLayout`: skip link, language attribute, metadata, header, main, footer.
- `Header`: logo on a light surface, desktop navigation, `aria-current`, language switcher, primary CTA.
- `MobileNav`: native `<details>` disclosure; works without JavaScript; optional small script to close on navigation or Escape.
- `Footer`: contact data, hours, service area, legal link.
- `ButtonLink`, `Container`, `Section`, `PlaceholderMedia`: small primitives only.
- Home: approved hero facts, five-category preview, contact CTA, neutral image placeholders.
- Services: category names and placeholder structure; detailed copy belongs to `003`.
- Contact: contact methods and hours; no form in this phase.
- Legal: placeholder headings only; no invented legal text; `noindex` until reviewed.
- 404: localized message and links to localized home and contact pages.

### 7.5 Interaction and motion

- Minimal JavaScript; no hydration framework.
- Motion limited to short opacity or transform transitions.
- All motion disabled under `prefers-reduced-motion: reduce`.
- Visible focus styles on light and blue surfaces.

## 8. SEO and indexing

- `Seo.astro` receives a page title, description, route path, and optional `noindex` flag.
- Canonical URL: `SITE_URL` + locale prefix + path + trailing slash.
- Alternates: `es`, `en`, `fr`, and `x-default` pointing to Spanish.
- Sitemap generated with `@astrojs/sitemap` and i18n alternates. Verify that `x-default` is emitted; customize serialization if the integration omits it.
- `robots.txt` generated from `SITE_ENV`:
  - `staging`: `User-agent: *` / `Disallow: /`
  - `production`: allow crawling and reference the sitemap
- Every page in a staging build emits `<meta name="robots" content="noindex, nofollow">`.
- The legal placeholder is `noindex` in all environments until real content is approved.
- No structured data in `001`; business claims are not yet verified for schema.

## 9. Configuration

| Variable | Scope | Example | Notes |
|---|---|---|---|
| `SITE_URL` | Build | `http://localhost` or `https://example.com` | Absolute base URL; no trailing slash |
| `SITE_ENV` | Build | `staging` or `production` | Controls `noindex` and robots |
| `SITE_ADDRESS` | Caddy runtime | `:80` or `https://example.com` | Host and TLS address |
| `BASE_URL` | Smoke script only | `https://...` | Overrides the test target |

- `src/config/env.ts` validates `SITE_URL` and `SITE_ENV` with Zod at build time.
- Development may fall back to `http://localhost:4321`, but deployments must set `SITE_URL` explicitly.
- `SITE_ENV` defaults to `staging` when omitted; production must be explicit to avoid accidental indexing.
- `.env.example` contains only non-secret examples.
- Site constants live in `src/config/site.ts`, not in environment variables.
- No secret is exposed through `PUBLIC_*` or client bundles.

## 10. Container and Caddy design

### 10.1 Dockerfile

One multi-stage Dockerfile with two final targets:

1. `node:24-bookworm-slim` build stage:
   - Enable Corepack.
   - Install with `pnpm install --frozen-lockfile`.
   - Accept `SITE_URL` and `SITE_ENV` build arguments.
   - Run `pnpm build`.
2. `web` target, based on `caddy:2-alpine`:
   - Copy `Caddyfile.web` and `dist/` to `/srv`.
   - Listen on `:8080` inside the container.
   - Serve static files, normalize directory paths, and map localized 404 pages.
   - No Node.js, package manager, source, tests, or secrets.
3. `edge` target, based on `caddy:2-alpine`:
   - Copy `Caddyfile`.
   - Listen on `:80` and `:443` inside the container.
   - Terminate TLS, apply headers and redirects, and reverse-proxy to `web:8080`.
   - Contain no site files, build output, Node.js, or secrets.

The build stage is shared, so Compose builds both targets with one dependency cache.

Both final targets remove the `cap_net_bind_service` file capability that the official caddy image puts on `/usr/bin/caddy`. Linux returns `EPERM` from `execve` when a file capability cannot be granted because the capability bounding set is empty, which is exactly the `web` service's `cap_drop: ALL` case; without the strip the container cannot start (`exec /usr/bin/caddy: operation not permitted`). Neither service relies on the file capability: the edge receives `NET_BIND_SERVICE` from Compose and the web server listens on 8080.

### 10.2 Compose

Top level:

- Compose project name is fixed (for example `ea-electricidad`) so container and network names are predictable.
- One user-defined bridge network named `app`; both services join it and resolve each other by service name.
- Named volumes `caddy_data` and `caddy_config` are attached only to `edge`.

`edge` service:

- Build target `edge`; local image `ea-electricidad-edge:local`.
- Published ports: TCP 80, TCP 443, UDP 443.
- `SITE_ADDRESS` from the host environment file.
- `depends_on: web` with `condition: service_healthy`.
- Health check against its internal `/healthz` endpoint.
- `restart: unless-stopped`.
- `no-new-privileges`, `cap_drop: ALL`, `cap_add: NET_BIND_SERVICE`.
- Docker `json-file` logs with `max-size: 10m` and `max-file: 3`.
- Reverse proxy upstream `web:8080`.

`web` service:

- Build target `web`; local image `ea-electricidad-web:local`.
- `build.args` for `SITE_URL` and `SITE_ENV`; `SITE_URL` is required so Compose fails fast instead of baking a wrong canonical URL.
- `expose: ['8080']` only. Never a `ports` entry.
- Health check against its internal `/healthz` endpoint.
- `restart: unless-stopped`.
- `no-new-privileges` and `cap_drop: ALL`; the internal server does not need to bind a privileged port, and the image strips the Caddy file capability at build time so `exec` works with an empty bounding set.
- No Caddy certificate volumes.

Future backend extension point:

- Add a `backend` service on the same `app` network with no `ports`.
- Give it a health check and route the reserved `/api/*` prefix to it from `Caddyfile`.
- Do not add the service, database, or secrets in `001`; documentation is the deliverable.

### 10.3 Caddy behavior

Edge (`Caddyfile`, public):

- Automatic HTTPS through Let's Encrypt.
- `/healthz` on an internal listener returns 200 without touching the filesystem.
- `/` redirects permanently to `/es/`.
- Directory paths without a trailing slash redirect to the slash form.
- `encode zstd gzip`.
- `reverse_proxy web:8080` for site traffic; the upstream 404 status and body are preserved.
- Reserved `/api/*` route for a future backend, documented and commented out or absent until `004`.
- Security headers:
  - HSTS after HTTPS is verified
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` denying camera, microphone, and geolocation
  - `X-Frame-Options: DENY` and `frame-ancestors 'none'`
  - Content Security Policy tuned to Astro output: self-hosted scripts, styles, fonts, and images only
- `handle_errors` applies security headers to proxy errors such as `502`/`504`.
- Caddy access logs to stdout with bounded Docker rotation; no request bodies.

Web (`Caddyfile.web`, internal only):

- Listens on `:8080`; no TLS, no host port, no access log requirement.
- `root * /srv`, `try_files`, and `file_server`.
- `/healthz` returns 200.
- Directory paths without a trailing slash still resolve via `try_files`; the edge owns public redirects.
- Locale-aware 404 mapping:
  - `/es/*` → `/es/404/`
  - `/en/*` → `/en/404/`
  - `/fr/*` → `/fr/404/`
  - Other paths → Spanish 404
- Preserves the HTTP 404 status returned through the proxy.

Build outputs keep scripts and stylesheets external (`assetsInlineLimit: 0` and
`inlineStylesheets: 'never'`), so the CSP does not need `unsafe-inline`.

Caddy-specific behavior must be verified with `curl` against the Compose stack, not only against `astro preview`.

## 11. Build, Makefile, and deployment

### 11.1 Make targets

`Makefile` is the single entry point for the container workflow. The targets are identical on every Docker-capable host.

| Target | Command | Purpose |
|---|---|---|
| `build` | `docker compose build` | Build all service images from the current source |
| `up` | `docker compose up -d --wait` | Start the stack and wait for health |
| `down` | `docker compose down --remove-orphans` | Stop and remove containers; volumes preserved |
| `restart` | `docker compose restart` | Restart containers without rebuilding |
| `logs` | `docker compose logs -f --tail=200` | Follow bounded logs |
| `status` | `docker compose ps` | Show container state and health for every service |
| `smoke` | `./scripts/smoke.sh` | Run HTTP and topology assertions against the running stack |
| `clean` | `docker compose down --rmi all --remove-orphans` | Remove containers and application images; volumes preserved |

Supporting `help` is a convenience target. `smoke` defaults to `http://127.0.0.1` and accepts `BASE_URL=https://...` for any reachable host.

Rules:

- Compose reads `.env` automatically; `SITE_URL` is mandatory for any Compose command.
- No target runs Git commands and no target selects a revision: the owner controls the working tree.
- No target uses `-v`, so `caddy_data` and `caddy_config` survive `down` and `clean`.
- `up` waits for both services; the edge becomes healthy only after the web service is healthy.

### 11.2 Local build and run

```bash
cp .env.example .env     # local defaults: SITE_URL=http://localhost, SITE_ADDRESS=:80
make build
make up
make status              # edge healthy, web healthy
make smoke               # http://127.0.0.1
```

Locally `SITE_ADDRESS=:80` serves plain HTTP through the edge. The web container is reachable only on the private network. The same images and Compose file run on any other Docker host; only `.env` values change.

### 11.3 Host prerequisites

Before the first run on a host:

1. Confirm Docker Engine and the Compose plugin are installed and usable by the owner's user.
2. Confirm GNU Make is available.
3. Confirm free disk for the Node.js build stage plus the running images.
4. Confirm time synchronization.
5. If a public HTTPS address is required, confirm inbound TCP 80 and 443 (plus UDP 443 for HTTP/3), a domain that resolves to the host, and no existing service on those ports.
6. Create `.env` from `.env.example`, set the host's values, and `chmod 600 .env`.

Privileged installation steps (`sudo`) are performed by the owner outside this repository's workflow; the project ships no privileged scripts.

### 11.4 Deploy and verify

1. Check out the revision to run. There is no automatic fetch or reset.
2. Run `make build` to build both images from the current source.
3. Run `make up` to start the stack with `--wait`.
4. Run `make status` to confirm the edge and web containers are healthy.
5. Run `make smoke` on the host, or `make smoke BASE_URL=https://<host>` from another machine:
   - `/` returns a redirect to `/es/`
   - `/es/`, `/en/`, `/fr/` return 200
   - unknown localized routes return 404 with localized content
   - security headers are present
   - staging responses include `noindex`
   - certificate chain is valid, when HTTPS is configured
   - only the edge port is published; the web service has no host port
6. A rebuild followed by `make up` causes downtime between the stop and the successful start. That is acceptable for demonstration deployments.

### 11.5 Rollback

There is no registry, so rollback rebuilds source:

1. Identify the previous known-good revision.
2. `git checkout <revision>` (owner action).
3. Run `make build` and `make up`.
4. Verify with `make status` and `make smoke`.
5. Return to the current branch when ready and rebuild.

### 11.6 Domain switch

When a real domain becomes available:

1. Point the domain's `A`/`AAAA` records at the host.
2. Set `SITE_URL` and `SITE_ADDRESS` to the production domain and `SITE_ENV=production` in `.env`.
3. Run `make build && make up` so the new build arguments are baked in.
4. Verify certificate issuance, canonical URLs, sitemap, and crawlability.
5. Confirm the old hostname is no longer used or is explicitly retired.

### 11.7 Resource and disk policy

- `make build` runs before `make up`, so a failed build does not replace a running stack with nothing.
- The build downloads the Node.js base image and pnpm dependencies; keep Docker's cache between builds so rebuilds stay fast.
- Only the web target uses the Node.js build stage; the edge image is a thin Caddy layer and builds quickly.
- On small hosts, monitor free space. `docker system df` shows usage; `make clean` removes both application images but keeps volumes.
- Prune build cache with `docker builder prune` only when disk pressure appears, and never remove `caddy_data` unless certificates should be reissued.
- Keep Docker log rotation enabled and bounded on both services.

## 12. Testing and quality

### 12.1 Unit tests

- Translation key parity, leaf types, and non-empty strings.
- Locale extraction and route-switching helpers.
- Canonical and alternate URL generation.
- Environment validation for valid and invalid values.
- `robots.txt` content for staging and production.
- Service-area and contact configuration sanity checks.

### 12.2 End-to-end tests

Playwright against a production-like local build:

- `/` redirects to `/es/`.
- `/es/`, `/en/`, `/fr/` return 200 with correct `<html lang>`.
- Language switcher preserves the current page.
- Navigation and CTA links resolve to localized routes.
- Contact links use the correct `tel:`, `mailto:`, and `wa.me` targets.
- Mobile menu opens, is keyboard operable, and does not trap focus incorrectly.
- Localized 404 page is reachable and correctly localized.
- Staging builds contain `noindex` metadata.
- Layouts at 320, 375, 768, and 1280 CSS pixels have no horizontal overflow.
- Navigation, language switching, and contact links work with JavaScript disabled.
- Axe reports no serious or critical violations on each locale.

### 12.3 Container smoke test

`scripts/smoke.sh` runs against the Compose stack and verifies:

- Both services are running and healthy.
- Only the edge publishes host ports; the web service has no host port.
- Health endpoint through the edge.
- Root redirect.
- Trailing-slash redirect.
- Locale routes.
- Localized 404 status and content preserved through the proxy.
- Security headers, including on error responses.
- Static assets and compressed responses.
- Neither runtime image contains a Node.js binary.

The same script accepts `BASE_URL` for verification of a remote host. Start the stack with `make up` (which uses `--wait`) before running it.

### 12.4 Local verification sequence

There is no CI. Before the owner commits or deploys, run:

1. `pnpm install --frozen-lockfile`.
2. `pnpm validate` — lint, format check, Astro/TypeScript check, unit tests, build.
3. `pnpm test:e2e` — Playwright browser tests.
4. `make build`.
5. `make up`.
6. `make smoke`.

All gates run on the owner's machine or on the host itself. No hosted pipeline, deployment workflow, or provider integration exists in `001`.

## 13. Security and privacy

- No customer data is collected in `001`; there is no form, cookie, analytics, or tracking.
- Static pages only; no server-side input handling.
- Secrets never enter the repository, either image, build arguments, or documentation.
- No registry credentials exist because there is no registry.
- The environment file is mode 600 and excluded from Git.
- Only the Caddy edge is publicly reachable.
- The web service publishes no host port and is reachable only on the private Docker network.
- The edge is the only TLS terminator; internal traffic stays on the private network.
- Security headers are applied at the edge, including to proxy error responses.
- The future backend must join the private network, publish no port, and be routed through the edge under `/api/*` to preserve same-origin CSP.
- Access logs are bounded and contain no request bodies; disable them if they are not needed.
- Legal and privacy placeholders contain no fabricated claims.
- Staging is excluded from indexing at both metadata and `robots.txt` levels.

## 14. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Certificate issuance fails | No trusted public URL | Verify DNS and free ports before exposing the site; keep plain HTTP for local work |
| Ports 80/443 unavailable on the host | ACME challenge fails | Check firewall and provider rules before a public deployment |
| Host lacks Docker or Make | Stack cannot run | Document prerequisites; owner installs packages with `sudo` outside the workflow |
| Build exhausts memory | Build fails, stack stays down | Build before starting; use a host with enough RAM if it repeatedly fails |
| Disk fills | Deployment failure | Log rotation, `make clean`, periodic `docker builder prune` |
| Broken revision checked out | Site breaks | Local checks plus smoke test; roll back by rebuilding a previous revision |
| Uncommitted local edits differ from intent | Confusing deploy | Owner controls the working tree; no automatic fetch or reset |
| Web container down or unhealthy | Edge returns 502/504 | Health checks, `depends_on`, restart policy, and `make status`; fix web before presenting the site |
| Proxy misconfiguration | Broken routes, wrong 404 status, missing headers | Curl-based smoke tests through the edge and E2E coverage |
| Accidental web port publication | Internal service exposed | Compose review plus smoke check that only the edge publishes ports |
| Caddy file capability blocks exec | Container exits 255 with `exec /usr/bin/caddy: operation not permitted` | Strip `cap_net_bind_service` from the binary in both image targets; never use `cap_drop: ALL` against an image that sets file capabilities |
| Network or DNS name mismatch | Edge cannot reach web | Deterministic project/network names; verify with `docker compose exec edge wget -qO- http://web:8080/healthz` |
| Future backend bypasses the edge | CORS, CSP, or exposure problems | Require same-network, no-host-port, `/api/*` routing; document in README |
| Edge image drifts from web config | Inconsistent behavior | Both built from the same Dockerfile and pinned Caddy base image |
| Caddy redirect or 404 rules wrong | SEO/UX defects | Curl-based container smoke tests and E2E coverage |
| Astro sitemap lacks `x-default` | Incomplete SEO | Inspect output; customize sitemap serialization |
| Astro/Tailwind/Fontsource version mismatch | Build failure | Pin versions at implementation and verify with frozen install |
| Logo is a non-transparent JPG | Poor placement on blue surfaces | Keep logo on white in `001`; request vector/transparent asset before final polish |
| Client hosting is static-only with different server rules | Redirect/header differences | Static output remains portable; document equivalent host configuration |
| Future API couples to the site | Rework | Reserve `/api/*` on the edge; keep the static site independent; integrate `004` through the private network |
| Staging gets indexed | Incomplete content leaks into search | Staging `noindex` metadata, disallow-all robots, and automated test |

## 15. Rollout sequence

1. Implement the site and local quality gates on a feature branch.
2. Split the container topology into `edge` and `web`, build both images locally, and smoke-test the Compose stack with `make build`, `make up`, and `make smoke`.
3. Confirm only the edge publishes host ports and the web service is unreachable from the host.
4. Prepare `.env` for the chosen host and run `make build && make up`.
5. Verify redirects, locales, headers, `noindex`, health, and the internal network path.
6. Demonstrate rollback by rebuilding a previous revision.
7. Update `MEMORY.md` and the spec status.
8. The owner commits and, if desired, deploys to another Docker-capable host with the same commands.

## 16. PENDING items

- Confirmation from the owner that the chosen host allows inbound TCP 80/443 (and UDP 443) before any public HTTPS deployment.
- Final production domain and DNS access, when a public deployment is approved.
- Email credentials or transactional provider for `004`.
- Transparent or vector logo and real project photography.
- Final legal and privacy copy.
- Retention and deletion rules for future quote submissions and uploads, to be defined in `004`.

## 17. Definition of done

The plan is complete when the specification's acceptance criteria are met, `pnpm validate` and `pnpm test:e2e` pass, `make build && make up` starts a healthy Compose stack on the owner's machine, `make smoke` passes locally, `edge` and `web` run in separate containers on a private network with only the edge exposed, rollback by rebuilding a previous revision is documented, the backend extension procedure is documented, and the README plus `MEMORY.md` describe the actual state and remaining limitations.
