# EA electricidad y multiservicios — website

Static, multilingual website for **EA electricidad y multiservicios**, an independent
low-voltage electrical installer based in Calpe, Alicante.

The site is built with Astro, exported as static HTML/CSS/JS, and served in production by
Caddy inside a Docker container. The public site does **not** require Node.js at runtime.

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
| Production      | Caddy serving static files from a Docker image   |
| Image builds    | Docker Compose, locally and on the VPS           |
| CI              | GitHub Actions                                   |

## Prerequisites

- Node.js 24 LTS (see `.nvmrc`)
- pnpm 12.16.1 (pinned in `package.json` via `packageManager`)
- Docker Engine with the Compose plugin, for the container workflow
- GNU Make, for the `build`/`up`/`deploy` targets

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

| Variable       | Scope         | Description                                                       |
| -------------- | ------------- | ----------------------------------------------------------------- |
| `SITE_URL`     | Build time    | Absolute site URL used for canonical links, hreflang and sitemap. |
| `SITE_ENV`     | Build time    | `staging` (default) or `production`. Controls `noindex`/robots.   |
| `SITE_ADDRESS` | Caddy runtime | Host and TLS address, e.g. `https://<VPS_IP>.sslip.io`.           |
| `BASE_URL`     | Smoke script  | Target URL for `scripts/smoke.sh`.                                |

Notes:

- `SITE_URL` must be an absolute URL with no trailing slash. Compose refuses to run without
  it, so a missing value fails fast instead of baking a wrong canonical URL.
- `SITE_ENV` defaults to `staging`; production must be set explicitly to avoid accidental
  indexing.
- `SITE_URL` and `SITE_ENV` are baked into the build. Changing the domain or indexing mode
  requires a new image build, which `make deploy` performs on the VPS.
- `.env.example` ships local defaults (`http://localhost`, `SITE_ADDRESS=:80`) with the
  staging values commented out. Never commit a real `.env`.

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
SITE_URL=https://203.0.113.10.sslip.io SITE_ENV=staging pnpm build
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

The site is packaged as a multi-stage image:

1. Node.js 24 + pnpm build the static output with `SITE_URL`/`SITE_ENV` build arguments.
2. Caddy serves `/srv` from the runtime image.

The final image contains no Node.js, package manager, source code, tests, or environment
files. There is no image registry: the same `compose.yaml` and `Dockerfile` build the image
locally and on the VPS.

`compose.yaml` runs a single `web` service (tagged `ea-electricidad:local`) with:

- ports 80 and 443 (TCP) plus 443/UDP for HTTP/3
- persistent `caddy_data` and `caddy_config` volumes
- a health check against the internal `/healthz` endpoint
- bounded JSON logs
- `no-new-privileges` and only `NET_BIND_SERVICE`

### Make targets

`make help` lists them. The same targets work on the development machine and the VPS.

| Target         | Action                                                             |
| -------------- | ------------------------------------------------------------------ |
| `make build`   | Build the image from the current source.                           |
| `make up`      | Start the service and wait for health.                             |
| `make down`    | Stop and remove containers; volumes are preserved.                 |
| `make restart` | Restart containers without rebuilding.                             |
| `make logs`    | Follow the last 200 log lines.                                     |
| `make status`  | Show container state and health.                                   |
| `make smoke`   | Run the smoke test; `BASE_URL=...` targets a remote host.          |
| `make deploy`  | VPS only: stop, remove the old image, sync `main`, rebuild, start. |
| `make clean`   | Remove containers and application images; volumes are preserved.   |

No target uses `docker compose down -v`. `caddy_data` and `caddy_config` hold the
certificates and must survive `down`, `deploy`, and `clean`.

### Local run

```bash
cp .env.example .env
make build
make up
make status
make smoke            # http://127.0.0.1
```

Locally `.env` sets `SITE_ADDRESS=:80`, so the site is served over plain HTTP on port 80.

### Smoke test

```bash
make smoke                              # running local stack
make smoke BASE_URL=https://<VPS_IP>.sslip.io
```

The script starts a temporary container when `BASE_URL` is unset and checks health, locales,
redirects, localized 404 status/content, security headers (including on error pages),
compressed responses, static assets, and the absence of Node.js in the runtime image. With
`BASE_URL` set it tests that environment directly.

## CI

`.github/workflows/ci.yml` runs on pull requests and pushes to `main`:

1. Frozen install.
2. Lint and format check.
3. Astro/TypeScript check.
4. Unit tests.
5. Build with staging configuration.
6. Playwright end-to-end tests.
7. `docker compose build` and container smoke test, the same build path used locally and on
   the VPS.

Deployment is intentionally manual. CI does not deploy to the VPS.

## Git workflow

1. Branch from `main` (for example `feat/002-homepage`).
2. Open a pull request into `main` and wait for review plus green CI.
3. Merge into `main`; only `main` is deployable.

The VPS tracks `main` exclusively. Local branches and pull-request heads are never deployed.

## Deployment

The target is the existing Infomaniak VPS (1 vCPU, 2 GB RAM, 20 GB, Ubuntu 24.04 LTS,
subject to compatibility). It is a staging/demonstration host: downtime and loss of
application data are acceptable, but Caddy certificates are preserved. The VPS builds the
image from source; no image is transferred.

### Preflight

Before deploying, confirm:

- OS version, CPU, RAM, disk and time synchronization.
- SSH key access and the sudo policy.
- Inbound TCP 22, 80 and 443 (and UDP 443 for HTTP/3).
- `<VPS_IP>.sslip.io` resolves to the VPS.
- Ports 80/443 are free.
- A trusted certificate can be issued. If not, stop and report.

### Host setup

1. Create a non-root `deploy` user with SSH key access and Docker permissions.
2. Disable password SSH and direct root login once the deploy user is verified.
3. Allow 22, 80 and 443 in UFW; deny other inbound traffic.
4. Enable unattended upgrades and Docker log rotation.
5. Install Docker Engine, the Compose plugin, and `git`.
6. Clone the repository into `/opt/ea-electricidad/` and check out `main`.
7. Create `.env` from `.env.example` with the staging values and `chmod 600 .env`.

Do not install Node.js or pnpm on the host. The build runs inside the Docker build stage.

### Deploy

On the VPS, in `/opt/ea-electricidad/`:

```bash
make deploy
```

`make deploy` runs, in order:

1. `docker compose down` to free memory for the build.
2. `docker image rm ea-electricidad:local` so a failed build cannot keep serving the old
   image.
3. `git fetch origin main` and hard-reset the working copy to `origin/main`. Tracked local
   edits are discarded; ignored files such as `.env` are kept.
4. `docker compose build` from the new source.
5. `docker compose up -d --wait` and `docker compose ps`.

Then verify:

```bash
make status
make smoke BASE_URL=https://<VPS_IP>.sslip.io
```

Expect downtime between the stop and the successful start.

### Rollback

There is no registry, so rollback rebuilds an earlier commit:

```bash
git fetch origin
git checkout <known-good-commit>
make build
make up
make smoke BASE_URL=https://<VPS_IP>.sslip.io
```

Return to `main` when ready; the next `make deploy` resets the working copy automatically.

### Domain switch

1. Point the client domain's `A`/`AAAA` records at the VPS.
2. Set `SITE_URL` and `SITE_ADDRESS` to the production domain.
3. Set `SITE_ENV=production`.
4. Run `make deploy` to rebuild from `main` with the new build arguments.
5. Verify HTTPS, canonical URLs, sitemap, and crawlability.
6. Retire the staging hostname.

## Static host handoff

If the client moves to another static host, mirror the Caddy behavior:

- `/` → `308` redirect to `/es/`.
- Directory paths without a trailing slash → `308` to the slash form.
- Unknown `/es/*`, `/en/*`, `/fr/*` → the matching localized 404 page with HTTP `404`.
- Other unknown paths → Spanish 404 page with HTTP `404`.
- Serve static assets from `/_astro/` with long-lived immutable caching.
- Apply the security headers from the `Caddyfile`, including on error responses.
- Keep language alternates, canonical URLs, and the generated sitemap intact.

## Project structure

```text
.
├── .github/workflows/ci.yml
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
├── Caddyfile
├── compose.yaml
├── Dockerfile
├── Makefile
├── package.json
└── pnpm-lock.yaml
```

## Status and limitations

- The site foundation, translations, pages, tests, container files, Makefile, and CI
  workflow are in place.
- CI builds through Docker Compose and runs the container smoke test; the image has not yet
  been built or deployed on a machine with Docker access.
- VPS preflight, staging TLS, `make deploy`, rollback, and the production domain are still
  pending.
- The GitHub default branch is still `master`; the workflow assumes it is renamed to `main`.
- The quote form, email delivery, uploads, privacy policy, and legal content belong to later
  phases.
- `public/logo.jpg` is the current brand asset. A vector/transparent version and genuine
  project photography are still pending.
- Legal and privacy pages are placeholders and are marked `noindex`.
