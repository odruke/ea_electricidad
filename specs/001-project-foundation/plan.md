# Implementation Plan — 001 Project Foundation

- Status: Approved — implementation in progress
- Revision: 2026-10-30 — local Compose builds, VPS builds from `main`, no image registry
- Related specification: `specs/001-project-foundation/spec.md`
- Branch: `feat/001-project-foundation`
- Target: `main`

## 1. Summary

Build the public website as an Astro static site, package it in a Caddy container, and deploy it to the existing Infomaniak VPS through Docker Compose. The public site has no production Node.js runtime. A future quote form will be implemented as a separate API in `004` and must not change the static hosting model.

Images are built from source with Docker Compose on the development machine and again on the VPS. There is no image registry and no image transfer: the VPS deploys by pulling the latest `main`, rebuilding, and restarting the Caddy service. Rollback means rebuilding an earlier commit.

The first deployment uses `https://<VPS_IP>.sslip.io` and staging indexing rules. The client domain is added later by rebuilding with the production site URL and indexing mode.

## 2. Confirmed decisions

| Area | Decision |
|---|---|
| Public architecture | Astro static output; no Next.js |
| Production runtime | Caddy serving static files; no Node.js |
| Quote backend | Deferred to `004`; separate API or serverless endpoint |
| Staging address | `https://<VPS_IP>.sslip.io`, conditional on trusted HTTPS |
| VPS | Infomaniak, 1 vCPU, 2 GB RAM, 20 GB storage, Ubuntu 24.04 LTS subject to compatibility |
| Image build | Docker Compose on the development machine and on the VPS |
| Deployment | VPS pulls `main`, rebuilds, and restarts; no image transfer |
| Registry | None; GitHub Container Registry removed |
| Git workflow | Feature branches → pull request → manual review → `main` |
| VPS branch | `main` only |
| Translations | Code-based Spanish, English, and French; no CMS |
| Infrastructure | Docker, Docker Compose, and a Makefile; no Infomaniak-specific services |
| Indexing | Staging is `noindex`; production enables crawling |
| Environment criticality | Staging/demonstration only; downtime and application data loss are acceptable |

## 3. Architecture

### 3.1 Runtime shape

```text
Developer machine
  └─ make build ──► docker compose build ──► local image ──► make up
                                                              │
GitHub (main) ── pull / review / merge                        │
        │                                                     │
Infomaniak VPS                                                │
  └─ make deploy                                              │
       ├─ docker compose down --rmi all                       │
       ├─ git fetch + reset --hard origin/main                │
       ├─ docker compose build (from source)                  │
       └─ docker compose up -d                                │
            └─ Caddy container ◄──────────────────────────────┘
                 ├─ serves /srv (static dist/)
                 ├─ terminates TLS with Let's Encrypt
                 ├─ normalizes trailing slashes
                 ├─ maps localized 404 pages
                 └─ adds security headers
```

- No application server, database, cache, or queue in `001`.
- Caddy is the only long-running service.
- The image contains the static output and the Caddy configuration only.
- The same `compose.yaml`, `Dockerfile`, `Caddyfile`, and Make targets are used locally and on the VPS.
- The future quote API is a separate service or endpoint; the static site remains deployable without it.

### 3.2 Build-time versus runtime

- `SITE_URL`, `SITE_ENV`, and all page content are build-time inputs passed as Compose build arguments.
- `SITE_ADDRESS` is a runtime Caddy variable used for certificate issuance and host matching.
- `.env` supplies both; it is never committed.
- Changing the domain or indexing mode requires a new image build, which `make deploy` performs on the VPS.

## 4. Technology choices

| Concern | Choice | Rationale |
|---|---|---|
| Framework | Astro, current stable | Static output, content-focused, minimal JavaScript, built-in i18n routing |
| Language | TypeScript strict | Catch translation and route errors at build time |
| Package manager | pnpm with committed lockfile | Deterministic installs, fast CI |
| Build runtime | Node.js 24 LTS, pinned | Build-only; no production Node.js |
| Styling | Tailwind CSS v4 with CSS theme tokens | Small CSS surface, brand tokens, no runtime CSS-in-JS |
| i18n | Astro routing plus typed TypeScript dictionaries | No external service; compile-time key checking |
| Env validation | Zod | Clear build failures for missing or malformed values |
| Unit tests | Vitest | Fast tests for translations, routes, and configuration |
| Browser tests | Playwright | Locale, navigation, responsive, and accessibility coverage |
| Accessibility | `@axe-core/playwright` | Automated serious/critical violation detection |
| Lint/format | ESLint with Astro plugin, Prettier with Astro plugin | Consistent source and templates |
| Server | Caddy 2 | Automatic HTTPS, compression, redirects, headers, small footprint |
| Container | Docker multi-stage | Reproducible and portable deployment |
| Orchestration | Docker Compose + Makefile | One workflow locally and on the VPS |
| Registry | None | The VPS builds from `main`; no image transfer |
| CI | GitHub Actions | Existing repository hosting; no new infrastructure |

Do not add React, a client-side router, a state library, a CMS, or an analytics package in this phase.

## 5. Repository structure

```text
.
├── .github/workflows/ci.yml
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
├── Caddyfile
├── compose.yaml
├── Dockerfile
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
| `SITE_URL` | Build | `https://203.0.113.10.sslip.io` | Absolute base URL; no trailing slash |
| `SITE_ENV` | Build | `staging` or `production` | Controls `noindex` and robots |
| `SITE_ADDRESS` | Caddy runtime | `https://203.0.113.10.sslip.io` | Host and TLS address |
| `BASE_URL` | Smoke script only | `https://...` | Overrides the test target |

- `src/config/env.ts` validates `SITE_URL` and `SITE_ENV` with Zod at build time.
- Development may fall back to `http://localhost:4321`, but deployments must set `SITE_URL` explicitly.
- `SITE_ENV` defaults to `staging` when omitted; production must be explicit to avoid accidental indexing.
- `.env.example` contains only non-secret examples.
- Site constants live in `src/config/site.ts`, not in environment variables.
- No secret is exposed through `PUBLIC_*` or client bundles.

## 10. Container and Caddy design

### 10.1 Dockerfile

Multi-stage build:

1. `node:24-bookworm-slim` build stage:
   - Enable Corepack.
   - Install with `pnpm install --frozen-lockfile`.
   - Accept `SITE_URL` and `SITE_ENV` build arguments.
   - Run `pnpm build`.
2. `caddy:2-alpine` runtime stage:
   - Copy `Caddyfile`.
   - Copy `dist/` to `/srv`.
   - Run as the standard Caddy container process.
   - No Node.js, package manager, source, tests, or secrets in the final image.

### 10.2 Compose

- Single `web` service built from the repository root with `build.args` for `SITE_URL` and
  `SITE_ENV`; the image is tagged locally as `ea-electricidad:local`.
- `SITE_URL` is required, so Compose fails fast instead of baking a wrong canonical URL.
- `restart: unless-stopped`.
- Ports 80 and 443, including HTTP/3 UDP 443.
- Persistent `caddy_data` and `caddy_config` volumes for certificates.
- `SITE_ADDRESS` from the host environment file.
- Health check against `/healthz`.
- Docker `json-file` logs with `max-size: 10m` and `max-file: 3`.
- Apply least-privilege capabilities where Caddy still functions reliably.

### 10.3 Caddy behavior

- Automatic HTTPS through Let's Encrypt.
- `root * /srv`, compression, and `file_server`.
- `/healthz` returns 200 without touching the filesystem.
- `/` redirects permanently to `/es/`.
- Directory paths without a trailing slash redirect to the slash form.
- Locale-aware 404 mapping:
  - `/es/*` → `/es/404/`
  - `/en/*` → `/en/404/`
  - `/fr/*` → `/fr/404/`
  - Other paths → Spanish 404
- Security headers:
  - HSTS after HTTPS is verified
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` denying camera, microphone, and geolocation
  - `X-Frame-Options: DENY` and `frame-ancestors 'none'`
  - Content Security Policy tuned to Astro output: self-hosted scripts, styles, fonts, and images only
- Build outputs keep scripts and stylesheets external (`assetsInlineLimit: 0` and
  `inlineStylesheets: 'never'`), so the CSP does not need `unsafe-inline`.
- Security headers are defined in a reusable snippet and applied to error responses too.
- Caddy access logs to stdout with bounded Docker rotation; no request bodies.

Caddy-specific behavior must be verified with `curl` against the built container, not only against `astro preview`.

## 11. Build, Makefile, and deployment

### 11.1 Make targets

`Makefile` is the single entry point for the container workflow. The same targets exist locally and on the VPS.

| Target | Command | Purpose |
|---|---|---|
| `build` | `docker compose build` | Build the image from the current source |
| `up` | `docker compose up -d --wait` | Start the service and wait for health |
| `down` | `docker compose down --remove-orphans` | Stop and remove containers; volumes preserved |
| `restart` | `docker compose restart` | Restart containers without rebuilding |
| `logs` | `docker compose logs -f --tail=200` | Follow bounded logs |
| `status` | `docker compose ps` | Show container state and health |
| `deploy` | stop → remove image → sync `main` → build → start | VPS only |
| `clean` | `docker compose down --rmi all --remove-orphans` | Remove containers and application images; volumes preserved |

Supporting `help` and `smoke` targets are convenience only. `smoke` defaults to `http://127.0.0.1` and accepts `BASE_URL=https://...` for the staging host.

Rules:

- Compose reads `.env` automatically; `SITE_URL` is mandatory for any Compose command.
- No target uses `-v`, so `caddy_data` and `caddy_config` survive `down`, `deploy` and `clean`.
- `deploy` is intentionally destructive to the VPS working copy: it fetches `origin`, checks out `main`, and hard-resets to `origin/main`, discarding tracked local edits. Ignored files such as `.env` are preserved.
- `deploy` removes the previous application image before rebuilding so a broken build cannot silently keep serving the old image.

### 11.2 Local build and run

```bash
cp .env.example .env     # local defaults: SITE_URL=http://localhost, SITE_ADDRESS=:80
make build
make up
make status
make smoke               # http://127.0.0.1
```

Locally `SITE_ADDRESS=:80` serves plain HTTP. The same image and Compose file are used on the VPS with `SITE_ADDRESS=https://<VPS_IP>.sslip.io`, where Caddy obtains the certificate.

### 11.3 VPS preflight

Before any deployment:

1. Confirm OS is Ubuntu Server 24.04 LTS, or record why 22.04 LTS is required.
2. Confirm 1 vCPU, 2 GB RAM, and sufficient free disk for a build plus the running image.
3. Confirm sudo access and SSH key authentication.
4. Confirm time synchronization.
5. Confirm inbound TCP 22, 80, and 443, plus UDP 443 if HTTP/3 is desired.
6. Confirm `<VPS_IP>.sslip.io` resolves to the VPS IPv4 address.
7. Confirm no existing service occupies ports 80 or 443.
8. Confirm Docker Engine, the Compose plugin, and `git` are available or installable from official repositories.

If HTTPS cannot be issued because DNS or ports fail, stop and report before presenting the staging site.

### 11.4 Host setup

- Create a non-root `deploy` user with SSH key access and Docker permissions.
- Disable password SSH authentication and direct root SSH login after verifying the deploy user.
- Configure UFW: allow 22, 80, and 443; deny other inbound traffic.
- Enable unattended upgrades.
- Optionally add fail2ban; keep it configured minimally if used.
- Install Docker Engine, the Compose plugin, and `git`.
- Clone the repository to `/opt/ea-electricidad/` and check out `main`.
- Create `.env` from `.env.example` with the staging values and `chmod 600 .env`.
- Do not install Node.js, pnpm, or build tooling on the host; the build runs inside the Docker build stage.

### 11.5 Deploy and verify

1. Merge the reviewed pull request into `main`.
2. On the VPS, from `/opt/ea-electricidad/`, run `make deploy`. This stops the service, removes the old image, fast-forwards the working copy to `origin/main`, rebuilds the image, and starts the service with `--wait`.
3. Run `make status` to confirm the container is healthy.
4. Run `make smoke BASE_URL=https://<VPS_IP>.sslip.io`:
   - `/` returns a redirect to `/es/`
   - `/es/`, `/en/`, `/fr/` return 200
   - unknown localized routes return 404 with localized content
   - security headers are present
   - staging responses include `noindex`
   - certificate chain is valid
5. Expect downtime between the stop and the successful start. That is acceptable on this staging VPS.

### 11.6 Rollback

There is no registry, so rollback rebuilds source:

1. Identify the previous known-good commit on `main`.
2. On the VPS: `git fetch origin && git checkout <commit>`.
3. Run `make build` and `make up`.
4. Verify with `make status` and `make smoke BASE_URL=https://...`.
5. Return to `main` when ready; the next `make deploy` resets the working copy automatically.

### 11.7 Domain switch

When the client domain becomes available:

1. Point the domain’s `A`/`AAAA` records to the VPS.
2. Set `SITE_URL` and `SITE_ADDRESS` to the production domain and `SITE_ENV=production` in the VPS `.env`.
3. Run `make deploy` to rebuild from `main` with the new build arguments.
4. Verify certificate issuance, canonical URLs, sitemap, and crawlability.
5. Confirm the staging hostname is no longer used or is explicitly retired.

### 11.8 Resource and disk policy

- Building on the VPS is expected. `deploy` stops the service first, which frees memory for the build.
- The build downloads the Node.js base image and pnpm dependencies; keep Docker’s cache between deploys so rebuilds stay fast.
- Monitor free space because the VPS has only 20 GB. `docker system df` shows usage; `make clean` removes the application image but keeps volumes.
- Prune build cache with `docker builder prune` only when disk pressure appears, and never remove `caddy_data` unless certificates should be reissued.
- Keep Docker log rotation enabled and bounded.

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

`scripts/smoke.sh` runs the built image and verifies:

- Health endpoint.
- Root redirect.
- Trailing-slash redirect.
- Locale routes.
- Localized 404 status and content.
- Security headers.
- Static assets and compressed responses.
- No Node.js binary in the runtime image.

The same script accepts `BASE_URL` for post-deployment verification.

### 12.4 CI

`.github/workflows/ci.yml` runs on pull requests and pushes to `main`:

1. Install with `pnpm install --frozen-lockfile`.
2. `pnpm lint`.
3. `pnpm format:check`.
4. `pnpm check`.
5. `pnpm test`.
6. `pnpm build`.
7. Playwright end-to-end tests.
8. `docker compose build` and container smoke test, so CI exercises the same build path as local and VPS deployments.

Use dependency and Playwright browser caching where it is straightforward. Do not add a deployment workflow in `001`; deployment remains manual.

## 13. Security and privacy

- No customer data is collected in `001`; there is no form, cookie, analytics, or tracking.
- Static pages only; no server-side input handling.
- Secrets never enter the repository, image, build arguments, or documentation.
- No registry credentials exist because there is no registry.
- VPS environment file is mode 600.
- SSH keys only; no password authentication.
- UFW limits inbound ports; Caddy is the only public service.
- Security headers are applied at Caddy.
- Access logs are bounded and contain no request bodies; disable them if they are not needed.
- Legal and privacy placeholders contain no fabricated claims.
- Staging is excluded from indexing at both metadata and `robots.txt` levels.

## 14. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| `sslip.io` or certificate issuance fails | No trusted staging URL | Verify DNS and ports before deployment; stop and report; consider a temporary domain |
| Ports 80/443 blocked by provider | ACME challenge fails | Check firewall and provider rules during preflight |
| Ubuntu 24.04 incompatible with provider image | Setup blocked | Document and request approval for 22.04 LTS |
| VPS build exhausts memory | Build fails, site stays down | `deploy` stops the service first; rebuild on a machine with more RAM only if it repeatedly fails |
| VPS disk fills | Deployment failure | Stop-before-build, log rotation, `make clean`, periodic `docker builder prune` |
| Bad merge lands on `main` | Staging breaks | Pull request with manual review; CI on the PR; rollback by rebuilding a previous commit |
| Local VPS edits are lost | Operator confusion | `deploy` hard-resets to `origin/main`; changes must go through Git |
| Caddy redirect or 404 rules wrong | SEO/UX defects | Curl-based container smoke tests and E2E coverage |
| Astro sitemap lacks `x-default` | Incomplete SEO | Inspect output; customize sitemap serialization |
| Astro/Tailwind/Fontsource version mismatch | Build failure | Pin versions at implementation and verify with frozen install |
| Logo is a non-transparent JPG | Poor placement on blue surfaces | Keep logo on white in `001`; request vector/transparent asset before final polish |
| Client hosting is static-only with different server rules | Redirect/header differences | Static output remains portable; document equivalent host configuration |
| Future API couples to the site | Rework | Keep the static site independent; integrate `004` through a fetch endpoint or separate API host |
| Staging gets indexed | Incomplete content leaks into search | Staging `noindex` metadata, disallow-all robots, and automated test |

## 15. Rollout sequence

1. Rename the GitHub default branch to `main` and enable pull-request review.
2. Complete preflight and obtain approval for any VPS change.
3. Implement the site and local quality gates on a feature branch.
4. Build and smoke-test the Docker image locally with `make build` and `make smoke`.
5. Clone `main` on the VPS, create `.env` with staging values, and run `make deploy`.
6. Verify HTTPS, redirects, locales, headers, `noindex`, and health.
7. Demonstrate rollback by rebuilding a previous commit.
8. Open the pull request into `main` with verification evidence.
9. Update `MEMORY.md`.

## 16. PENDING items

- Rename the GitHub default branch from `master` to `main`.
- VPS IP, SSH user/key, sudo policy, OS image, firewall state, and port reachability.
- Confirmation that `https://<VPS_IP>.sslip.io` can obtain a valid certificate.
- Final production domain and DNS access, after staging approval.
- Email credentials or transactional provider for `004`.
- Transparent or vector logo and real project photography.
- Final legal and privacy copy.

## 17. Definition of done

The plan is complete when the specification’s acceptance criteria are met, CI is green on `main`, the VPS builds and deploys from `main` with the Make targets, rollback by rebuilding a previous commit is demonstrated, staging is excluded from indexing, and the README plus `MEMORY.md` describe the actual state and remaining limitations.
