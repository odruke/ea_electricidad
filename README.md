# EA electricidad y multiservicios — website

Static, multilingual website for **EA electricidad y multiservicios**, an independent
low-voltage electrical installer based in Calpe, Alicante.

The site is built with Astro, exported as static HTML/CSS/JS, and served in production by
two Docker containers: a public Caddy **edge** proxy and an internal Caddy **web** server on
a private network. Only the edge publishes ports. The public site does **not** require
Node.js at runtime.

- Spanish (`es`) is the default locale.
- English (`en`) and French (`fr`) are also available.
- Every page is served under a locale prefix: `/es/`, `/en/`, `/fr/`.
- The root path redirects to `/es/`.

This phase (`001-project-foundation`) contains no quote form, email sending, uploads,
database, analytics, cookies, or CMS. The quote form is planned for a later phase.

## Stack

| Concern         | Choice                                             |
| --------------- | -------------------------------------------------- |
| Framework       | Astro (static output)                              |
| Language        | TypeScript (strict)                                |
| Styling         | Tailwind CSS v4 with CSS theme tokens              |
| Translations    | Typed TypeScript dictionaries (`es`, `en`, `fr`)   |
| Unit tests      | Vitest                                             |
| Browser tests   | Playwright + `@axe-core/playwright`                |
| Lint / format   | ESLint + Prettier                                  |
| Package manager | pnpm, with committed `pnpm-lock.yaml`              |
| Build runtime   | Node.js 24 LTS                                     |
| Production      | Caddy edge proxy + internal Caddy static container |
| Image builds    | Docker Compose, on the host that runs the stack    |
| CI              | None — checks run locally before deploying         |

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

| Variable       | Scope         | Description                                                                 |
| -------------- | ------------- | --------------------------------------------------------------------------- |
| `SITE_URL`     | Build time    | Absolute site URL used for canonical links, hreflang and sitemap.           |
| `SITE_ENV`     | Build time    | `staging` (default) or `production`. Controls `noindex`/robots.             |
| `SITE_ADDRESS` | Caddy runtime | Host and TLS address used by the edge, e.g. `:80` or `https://example.com`. |
| `BASE_URL`     | Smoke script  | Target URL for `scripts/smoke.sh`.                                          |

Notes:

- `SITE_URL` must be an absolute URL with no trailing slash. Compose refuses to run without
  it, so a missing value fails fast instead of baking a wrong canonical URL.
- `SITE_ENV` defaults to `staging`; production must be set explicitly to avoid accidental
  indexing.
- `SITE_URL` and `SITE_ENV` are baked into the build. Changing the domain or indexing mode
  requires a new image build (`make build`) before `make up`.
- `.env.example` ships local defaults (`http://localhost`, `SITE_ADDRESS=:80`) with a
  generic production-style example commented out. Never commit a real `.env`.

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
only; production behavior (redirects, 404 status, headers, compression) is handled by Caddy.

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

The stack has two services built from one multi-stage `Dockerfile`:

1. A Node.js 24 + pnpm build stage produces `dist/` with `SITE_URL`/`SITE_ENV` build
   arguments.
2. The `web` target copies the static output and `Caddyfile.web` into a Caddy image,
   listens on `:8080`, and serves the site with localized 404 pages.
3. The `edge` target copies `Caddyfile` into a Caddy image and handles TLS, redirects,
   security headers, compression, logs, and reverse proxying to `web:8080`.

Both final stages strip the `cap_net_bind_service` file capability that the official Caddy
image sets on its binary. When the capability bounding set is empty (`cap_drop: ALL`), Linux
fails `execve` with `operation not permitted`, so the container never starts; neither service
needs the file capability, because the edge receives `NET_BIND_SERVICE` from Compose and the
web server listens on 8080.

Neither final image contains Node.js, package manager, source code, tests, or environment
files. There is no image registry: every host builds both images from source with the same
`compose.yaml` and `Dockerfile`.

```text
Internet
  │  TCP 80/443 + UDP 443
  ▼
edge · Caddy · only published ports
  ├─ TLS, compression, security headers
  ├─ / → /es/, trailing-slash redirects
  ├─ /healthz
  └─ reverse_proxy → web:8080
       │ private app network
       ▼
web · Caddy · expose 8080 only, no host port
  ├─ static dist/
  └─ localized 404 pages with HTTP 404
```

`compose.yaml` fixes the Compose project name `ea-electricidad`, so container and network
names are predictable. Both services join the private bridge network `app` and resolve each
other by service name.

`edge` (image `ea-electricidad-edge:local`):

- publishes TCP 80, TCP 443 and UDP 443 for HTTP/3
- waits for a healthy `web` through `depends_on: condition: service_healthy`
- mounts the persistent `caddy_data` and `caddy_config` volumes
- health check on the internal `:8081/healthz` listener
- bounded JSON logs, `no-new-privileges`, only `NET_BIND_SERVICE`

`web` (image `ea-electricidad-web:local`):

- declares `expose: ['8080']` and never `ports`
- health check on `:8080/healthz`
- bounded JSON logs, `no-new-privileges`, all capabilities dropped

### Make targets

`make help` lists them. They run on the machine that hosts the stack; nothing is specific to
a particular provider or server.

| Target         | Action                                                           |
| -------------- | ---------------------------------------------------------------- |
| `make build`   | Build both service images from the current source.               |
| `make up`      | Start the stack and wait for health.                             |
| `make down`    | Stop and remove containers; volumes are preserved.               |
| `make restart` | Restart containers without rebuilding.                           |
| `make logs`    | Follow the last 200 log lines from every service.                |
| `make status`  | Show container state and health for every service.               |
| `make smoke`   | Run the smoke test; `BASE_URL=...` targets a remote host.        |
| `make clean`   | Remove containers and application images; volumes are preserved. |

No target uses `docker compose down -v`. `caddy_data` and `caddy_config` hold the
certificates and must survive `down` and `clean`.

### Quick start

```bash
cp .env.example .env
make build
make up
make status           # edge healthy, web healthy
make smoke            # http://127.0.0.1
```

Locally `.env` sets `SITE_ADDRESS=:80`, so the edge serves plain HTTP on port 80. The web
container is reachable only on the private `app` network; it has no host port.

### Smoke test

```bash
make smoke                              # running local stack
make smoke BASE_URL=https://example.com # any reachable host
```

Against a local `BASE_URL` the script also verifies the Docker topology: both services are
running and healthy, only the edge publishes ports, the edge reaches `web:8080` by service
DNS, and neither image contains Node.js. For a remote `BASE_URL` it runs only the HTTP
assertions: health, locales, redirects, localized 404 status/content, security headers
(including on error pages), immutable asset caching, and compressed responses.

### Adding a future backend

The reserved path prefix is `/api/*`. A future backend such as the quote API in `004` must
stay on the private network and must not publish a host port:

1. Add a `backend` service to `compose.yaml` on the same `app` network, with `expose` only,
   a health check, bounded logs, and no `ports`.
2. Add a health dependency if the public site needs the backend at startup.
3. In `Caddyfile`, in the `edge` site block, replace the single proxy with ordered handlers:

   ```caddyfile
   handle /api/* {
       reverse_proxy backend:3000
   }
   handle {
       reverse_proxy web:8080
   }
   ```

4. Rebuild and restart with `make build && make up`.
5. Extend `scripts/smoke.sh` with assertions for the new prefix.

Because the backend stays behind the edge, `connect-src 'self'` remains valid, no CORS is
needed, and no additional public hostname or port is introduced. If a future service must
live in a separate Compose project, attach it to an explicitly shared external network and
document that choice.

## Local checks

There is no CI pipeline. Run the checks locally before the owner commits or deploys:

```bash
pnpm validate      # lint, format check, Astro/TypeScript check, unit tests, build
pnpm test:e2e      # build + Playwright browser tests
make build         # both container images
make up            # start the stack and wait for health
make smoke         # HTTP + Docker topology assertions
```

`pnpm validate` covers the static site; the `make` steps cover the container path. The smoke
test fails fast if the topology drifts (an extra published port, an unhealthy service, or
Node.js leaking into an image).

## Git workflow

- The owner owns Git: they branch, add, commit, push, and deploy.
- Agents may create a feature branch (`feat/NNN-name`) when starting a feature, but never
  commit, push, rebase, or reset unless explicitly asked.
- There is no pull-request gate, no CI, and no GitHub automation. Nothing in the repository
  contacts GitHub, and no branch-protection or release tooling is required.

## Deployment

Deployment is local-first: the stack is built and started on whatever machine runs it, using
the quick start above. There is no registry and no remote build: the host compiles both
images from source. Downtime between a rebuild and a healthy start is expected, but the
Caddy volumes are preserved.

### Using another host

The stack is provider-neutral. Any host with Docker Engine and the Compose plugin works:

1. Clone the repository and check out the revision to run.
2. Create `.env` from `.env.example` and set `SITE_URL`, `SITE_ENV`, and `SITE_ADDRESS` for
   that host; `chmod 600 .env`.
3. Make sure inbound TCP 80 and 443 (and UDP 443 for HTTP/3) reach the edge and that ports
   80/443 are free.
4. Run `make build && make up`, then `make smoke` locally on that host.
5. From another machine, verify with `make smoke BASE_URL=https://<host>`.

Do not install Node.js or pnpm on the host; the build runs inside the Docker build stage.
Never publish the `web` port or route traffic around the edge.

### Rollback

Without a registry, roll back by rebuilding the last known-good revision:

```bash
git checkout <known-good-revision>
make build
make up
make status
make smoke
```

Return to the current branch when ready and rebuild.

### Domain switch

1. Point the domain's `A`/`AAAA` records at the host.
2. Set `SITE_URL` and `SITE_ADDRESS` to the production domain.
3. Set `SITE_ENV=production`.
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
- Apply the security headers from the edge `Caddyfile`, including on error responses.
- Keep language alternates, canonical URLs, and the generated sitemap intact.

## Project structure

```text
.
├── public/logo.jpg
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
├── Caddyfile                      # public edge: TLS, headers, redirects, proxy
├── Caddyfile.web                  # internal static server and localized 404
├── compose.yaml                   # edge + web on the private app network
├── Dockerfile                     # build stage plus web and edge targets
├── Makefile
├── package.json
└── pnpm-lock.yaml
```

## Status and limitations

- The site foundation, translations, pages, tests, container files, and Makefile are in
  place.
- The runtime is a multi-container Compose stack: a public `edge` and an internal `web` on
  the private `app` network. Only the edge publishes ports.
- The images have not yet been built or deployed on the owner's machine because the agent
  has no Docker socket access; `make build`, `make up`, and the stack smoke test are still
  unverified end to end. The `web` container is currently restarting in a loop and needs
  diagnosis from its logs.
- Deployment is local and owner-managed: no CI, no registry, no remote deploy target. The
  revision to run is chosen and deployed by the owner.
- The quote form, email delivery, uploads, privacy policy, and legal content belong to later
  phases. The `/api/*` prefix and the `app` network are reserved for the future backend but
  no backend is implemented.
- `public/logo.jpg` is the current brand asset. A vector/transparent version and genuine
  project photography are still pending.
- Legal and privacy pages are placeholders and are marked `noindex`.
