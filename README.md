# EA electricidad y multiservicios — website

Static, multilingual website for **EA electricidad y multiservicios**, an independent
low-voltage electrical installer based in Calpe, Alicante.

The site is built with Astro, exported as static HTML/CSS/JS, and served in production by
one Docker container: a Caddy **web** server that holds the site and its HTTP policy
(security headers, redirects, caching, localized 404 pages). It publishes no port. A
**shared reverse proxy**, a separate Caddy project on the VPS that serves several sites,
terminates TLS and forwards this site's domain to it over the external `proxy` Docker
network. The public site does **not** require Node.js at runtime.

- Spanish (`es`) is the default locale.
- English (`en`) and French (`fr`) are also available.
- Every page is served under a locale prefix: `/es/`, `/en/`, `/fr/`.
- The root path redirects to `/es/`.

This phase (`001-project-foundation`) contains no quote form, email sending, uploads,
database, analytics, cookies, or CMS. The quote form is planned for a later phase.

## Stack

| Concern         | Choice                                           |
| --------------- | ------------------------------------------------ |
| Framework       | Astro (static output)                            |
| Language        | TypeScript (strict)                              |
| Styling         | Tailwind CSS v4 with CSS theme tokens            |
| Translations    | Typed TypeScript dictionaries (`es`, `en`, `fr`) |
| Unit tests      | Vitest                                           |
| Browser tests   | Playwright + `@axe-core/playwright`              |
| Lint / format   | ESLint + Prettier                                |
| Package manager | pnpm, with committed `pnpm-lock.yaml`            |
| Build runtime   | Node.js 24 LTS                                   |
| Production      | Caddy static container behind a shared VPS proxy |
| Image builds    | Docker Compose, on the host that runs the stack  |
| CI              | None — checks run locally before deploying       |

## Prerequisites

- Node.js 24 LTS (see `.nvmrc`)
- pnpm 12.16.1 (pinned in `package.json` via `packageManager`)
- Docker Engine with the Compose plugin, for the container workflow
- GNU Make, for the `build`/`up` targets

With `nvm`:

```bash
nvm install
nvm use
corepack enable
pnpm install --frozen-lockfile
```

## Local development

```bash
cp .env.example .env
pnpm dev
```

The dev server listens on `http://localhost:4321`. The root path redirects to `/es/`.

### Environment variables

| Variable   | Scope        | Description                                                       |
| ---------- | ------------ | ----------------------------------------------------------------- |
| `SITE_URL` | Build time   | Absolute site URL used for canonical links, hreflang and sitemap. |
| `SITE_ENV` | Build time   | `staging` (default) or `production`. Controls `noindex`/robots.   |
| `BASE_URL` | Smoke script | Target URL for `scripts/smoke.sh` (default `127.0.0.1:8080`).     |

The domain, TLS certificates and public ports are configured in the shared reverse proxy
project, not here; `SITE_URL` must match the domain that proxy serves.

Notes:

- `SITE_URL` must be an absolute URL with no trailing slash. Compose refuses to run without
  it, so a missing value fails fast instead of baking a wrong canonical URL.
- `SITE_ENV` defaults to `staging`; production must be set explicitly to avoid accidental
  indexing.
- `SITE_URL` and `SITE_ENV` are baked into the build. Changing the domain or indexing mode
  requires a new image build (`make build`) before `make up`.
- `.env.example` ships local defaults (`http://localhost`, `staging`) with a generic
  production-style example commented out. Never commit a real `.env`. A leftover
  `SITE_ADDRESS` in an older `.env` is ignored.

## Commands

| Command             | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `pnpm dev`          | Start the Astro development server.                       |
| `pnpm build`        | Build the static site into `dist/`.                       |
| `pnpm preview`      | Preview the production build locally.                     |
| `pnpm lint`         | Run ESLint.                                               |
| `pnpm format`       | Format files with Prettier.                               |
| `pnpm format:check` | Verify formatting without writing.                        |
| `pnpm check`        | Run Astro/TypeScript diagnostics.                         |
| `pnpm test`         | Run Vitest unit tests.                                    |
| `pnpm test:e2e`     | Build and run the Playwright suite.                       |
| `pnpm validate`     | Run lint, format check, type check, unit tests and build. |

### Production build

```bash
SITE_URL=https://example.com SITE_ENV=production pnpm build
pnpm preview
```

The static output is written to `dist/`. Astro's preview server is for local verification
only; production behavior (redirects, 404 status, headers, compression) is handled by the
Caddy `web` container (`Caddyfile.web`).

### Tests

```bash
pnpm test                 # unit tests
pnpm exec playwright install chromium
pnpm test:e2e             # build + browser tests
```

The Playwright suite starts `pnpm preview` automatically unless `BASE_URL` is set. It covers
locale routing, language switching, the mobile navigation, contact targets, `noindex`,
responsive overflow, axe accessibility checks, and no-JavaScript behavior.

## Docker and Compose

This project ships one service, built from a multi-stage `Dockerfile`:

1. A Node.js 24 + pnpm build stage produces `dist/` with `SITE_URL`/`SITE_ENV` build
   arguments.
2. The `web` target copies the static output and `Caddyfile.web` into a Caddy image,
   validates the Caddyfile at build time, and listens on `:8080`.

`Caddyfile.web` owns the whole HTTP policy of this site, so the shared proxy needs no
site-specific rules: security headers and CSP (also on error responses), `/` → `/es/`,
trailing-slash redirects, immutable caching for `/_astro/*`, zstd/gzip compression, JSON
access logs, `/healthz`, and the localized 404 pages with HTTP 404. It trusts
`X-Forwarded-For` from private ranges, so the logs show the real client address.

The final stage strips the `cap_net_bind_service` file capability that the official Caddy
image sets on its binary. When the capability bounding set is empty (`cap_drop: ALL`), Linux
fails `execve` with `operation not permitted`, so the container would never start; the server
listens on 8080 and needs no capability.

The final image contains no Node.js, package manager, source code, tests, or environment
files. There is no image registry: the host builds the image from source.

```text
Internet
  │  TCP 80/443 (+ UDP 443)
  ▼
shared reverse proxy · Caddy · separate project on the VPS, serves several sites
  ├─ TLS certificates, public ports
  └─ <domain> → reverse_proxy ea-electricidad-web:8080
       │ external `proxy` network
       ▼
web · Caddy · this project · no host port
  ├─ security headers + CSP, redirects, caching, compression
  ├─ /healthz
  ├─ static dist/
  └─ localized 404 pages with HTTP 404
       │ private `app` network (reserved for a future backend)
```

`compose.yaml` fixes the Compose project name `ea-electricidad`. `web` (image
`ea-electricidad-web:local`):

- has no `ports`; it joins the external `proxy` network with the alias
  `ea-electricidad-web`, and the private `app` bridge network
- health check on `:8080/healthz`
- bounded JSON logs, `no-new-privileges`, all capabilities dropped

`compose.local.yaml` is a local-only override that publishes `127.0.0.1:8080`, for testing
without the shared proxy. Never load it on the VPS.

### Shared reverse proxy

The proxy lives in its own project and repository. This project only expects:

- an external Docker network named `proxy` (`make network` creates it if missing; the proxy
  project must join the same network);
- a site block that forwards the domain to the alias, with no site policy of its own:

  ```caddyfile
  example.com {
  	reverse_proxy ea-electricidad-web:8080
  }

  www.example.com {
  	redir https://example.com{uri} 308
  }
  ```

Do not set security headers, CSP, redirects or caching for this site in the proxy: they
come from `Caddyfile.web`, and a second copy would drift. Certificates and their volumes
belong to the proxy project.

### Make targets

`make help` lists them. They run on the machine that hosts the site; nothing is specific to
a particular provider or server.

| Target          | Action                                                               |
| --------------- | -------------------------------------------------------------------- |
| `make network`  | Create the external `proxy` network if it does not exist.            |
| `make build`    | Build the web image from the current source.                         |
| `make up`       | Start the site behind the shared proxy (no host port), wait healthy. |
| `make up-local` | Same, plus publish `127.0.0.1:8080` for local tests.                 |
| `make down`     | Stop and remove the containers.                                      |
| `make restart`  | Restart containers without rebuilding.                               |
| `make logs`     | Follow the last 200 log lines.                                       |
| `make status`   | Show container state and health.                                     |
| `make smoke`    | Run the smoke test; `BASE_URL=https://<domain>` goes via the proxy.  |
| `make clean`    | Remove the containers and the application image.                     |

The site keeps no state, so `down` and `clean` lose nothing.

### Quick start

Locally, without the shared proxy:

```bash
cp .env.example .env
make build
make up-local
make status           # web healthy
make smoke            # http://127.0.0.1:8080
```

On the VPS, with the shared proxy project running and its site block in place:

```bash
make build
make up
make smoke BASE_URL=https://<domain>
```

### Smoke test

```bash
make smoke                              # local site published by `make up-local`
make smoke BASE_URL=https://example.com # through the shared proxy
```

Against a local `BASE_URL` the script also verifies the Docker topology: `web` is running
and healthy, joins the `proxy` network as `ea-electricidad-web`, publishes nothing beyond
loopback, and its image contains no Node.js. Every run checks health, locales, redirects,
localized 404 status/content, security headers (including on error pages), immutable asset
caching, and compressed responses; through the public domain this also proves the proxy
forwards correctly.

### Adding a future backend

The reserved path prefix is `/api/*`. A future backend such as the quote API in `004` stays
inside this project, on the private `app` network, with no host port:

1. Add a `backend` service to `compose.yaml` on the `app` network only, with `expose`, a
   health check, bounded logs, and no `ports`.
2. Add a health dependency if the site needs the backend at startup.
3. In `Caddyfile.web`, uncomment the `handle /api/*` block so it proxies to `backend:3000`
   before the file server.
4. Rebuild and restart with `make build && make up`.
5. Extend `scripts/smoke.sh` with assertions for the new prefix.

Because the API is served from the same origin, `connect-src 'self'` remains valid, no CORS
is needed, and the shared proxy needs no change.

## Local checks

There is no CI pipeline. Run the checks locally before the owner commits or deploys:

```bash
pnpm validate      # lint, format check, Astro/TypeScript check, unit tests, build
pnpm test:e2e      # build + Playwright browser tests
make build         # the web image
make up-local      # start it on 127.0.0.1:8080 and wait for health
make smoke         # HTTP + Docker topology assertions
```

`pnpm validate` covers the static site; the `make` steps cover the container path. The smoke
test fails fast if the topology drifts (a public port, a missing `proxy` alias, an unhealthy
service, or Node.js leaking into the image).

## Git workflow

- The owner owns Git: they branch, add, commit, push, and deploy.
- Agents may create a feature branch (`feat/NNN-name`) when starting a feature, but never
  commit, push, rebase, or reset unless explicitly asked.
- There is no pull-request gate, no CI, and no GitHub automation. Nothing in the repository
  contacts GitHub, and no branch-protection or release tooling is required.

## Deployment

The site is built and started on the VPS that runs the shared reverse proxy. There is no
registry and no remote build: the host compiles the image from source. Downtime between a
rebuild and a healthy start is expected; the site keeps no state.

### Using another host

The project is provider-neutral. Any host with Docker Engine and the Compose plugin works:

1. Run the shared reverse proxy project there (or any proxy on the `proxy` network that
   forwards the domain to `ea-electricidad-web:8080`).
2. Clone this repository and check out the revision to run.
3. Create `.env` from `.env.example` and set `SITE_URL` and `SITE_ENV`; `chmod 600 .env`.
4. Run `make build && make up`.
5. Add the site block to the proxy, reload it, and verify with
   `make smoke BASE_URL=https://<domain>`.

Do not install Node.js or pnpm on the host; the build runs inside the Docker build stage.
Never publish the `web` port on the VPS or load `compose.local.yaml` there.

### Rollback

Without a registry, roll back by rebuilding the last known-good revision:

```bash
git checkout <known-good-revision>
make build
make up
make status
make smoke BASE_URL=https://<domain>
```

Return to the current branch when ready and rebuild.

### Domain switch

1. Point the domain's `A`/`AAAA` records at the VPS.
2. In the shared proxy project, change the site block to the production domain and reload.
3. Here, set `SITE_URL` to the production domain and `SITE_ENV=production`.
4. Run `make build && make up` so the new build arguments are baked in.
5. Verify HTTPS, canonical URLs, sitemap, and crawlability.
6. Retire the staging hostname if there is one.

## Static host handoff

If the client moves to another static host, mirror the Caddy behavior:

- `/` → `308` redirect to `/es/`.
- Directory paths without a trailing slash → `308` to the slash form.
- Unknown `/es/*`, `/en/*`, `/fr/*` → the matching localized 404 page with HTTP `404`.
- Other unknown paths → Spanish 404 page with HTTP `404`.
- Serve static assets from `/_astro/` with long-lived immutable caching.
- Apply the security headers from `Caddyfile.web`, including on error responses.
- Keep language alternates, canonical URLs, and the generated sitemap intact.

## Project structure

```text
.
├── public/brand/                  # logos, favicons, share image
├── public/homepage/               # hero and real job photos
├── scripts/smoke.sh
├── specs/001-project-foundation/
├── src/
│   ├── components/{layout,seo,ui}/
│   ├── config/{env,site}.ts
│   ├── i18n/{index.ts,messages/{es,en,fr}.ts}
│   ├── layouts/BaseLayout.astro
│   ├── lib/{routes,seo,robots,services}.ts
│   ├── pages/[locale]/{index,services,contact,legal,404}.astro
│   ├── pages/{index.astro,404.astro,robots.txt.ts}
│   └── styles/global.css
├── tests/{unit,e2e}/
├── astro.config.mjs
├── Caddyfile.web                  # site server: headers, redirects, caching, localized 404
├── compose.yaml                   # web on the external proxy network (no host port)
├── compose.local.yaml             # local only: publish 127.0.0.1:8080
├── Dockerfile                     # build stage plus the web target
├── Makefile
├── package.json
└── pnpm-lock.yaml
```

## Status and limitations

- The site foundation, translations, pages, tests, container files, and Makefile are in
  place.
- The runtime is one `web` container behind a shared reverse proxy that lives in a separate
  project on the VPS and serves several sites. This project publishes no port.
- The agent has no Docker socket access, so `make build`, `make up`, and the smoke test
  after the 2026-11-23 proxy separation are unverified until the owner runs them.
- Deployment is owner-managed: no CI, no registry. The revision to run is chosen and
  deployed by the owner.
- The quote form, email delivery, uploads, privacy policy, and legal content belong to later
  phases. The `/api/*` prefix and the `app` network are reserved for the future backend but
  no backend is implemented.
- Brand assets (SVG logos, favicons, share image) live in `public/brand/`. The homepage uses
  genuine EA job photos; other pages still use placeholders.
- Legal and privacy pages are placeholders and are marked `noindex`.
