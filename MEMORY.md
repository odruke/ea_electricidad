# MEMORY.md — Project Memory

Keep concise (~50 lines). Update after meaningful work and remove obsolete information. Permanent rules live in `AGENTS.md`.

## Current State

- `001-project-foundation` is implemented but uncommitted; the 2026-11-01 multi-container revision is on `feat/001-multi-container`.
- Astro 7.4.4 static site, TypeScript strict, Tailwind CSS 4, Node 24.16.0, pnpm 12.16.1.
- Locales `es` (default), `en`, `fr` via typed dictionaries; routes `/es/`, `/en/`, `/fr/`.
- Pages: home, services, contact, legal (noindex), localized 404; root redirects to `/es/`.
- SEO: canonical, hreflang + `x-default`, sitemap, staging `noindex` and disallow-all robots.
- Container stack: `edge` (public Caddy) + `web` (internal Caddy) on the private `app` network; project name `ea-electricidad`.
- Images `ea-electricidad-edge:local`/`ea-electricidad-web:local` from one multi-stage `Dockerfile`; only `edge` publishes TCP 80/443 + UDP 443, while `web` uses `expose: 8080`.
- `Caddyfile` is the edge (TLS, headers, redirects, compression, logs, proxy); `Caddyfile.web` is the internal static server and localized 404 mapping.
- `scripts/smoke.sh` checks HTTP behavior plus, for local `BASE_URL`, topology: health, only-edge exposure, edge→web DNS, no Node.js in either image.
- `Makefile` targets: `help`, `build`, `up`, `down`, `restart`, `logs`, `status`, `smoke`, `clean`. No `deploy` target and no Git commands in the Makefile.
- No CI and no `.github/` directory; checks run locally (`pnpm validate`, `pnpm test:e2e`, `make build`, `make up`, `make smoke`).
- Docker image build/up/smoke not verified by the agent: no access to `/var/run/docker.sock`. Root cause of the `web` crash loop found: the official Caddy image sets `cap_net_bind_service=+ep` on its binary, and `execve` returns EPERM when the bounding set is empty (`cap_drop: ALL`); both Dockerfile targets now strip that file capability, pending the owner's rebuild.
- Caddy edge+web behavior verified locally with a real Caddy 2.11.7 binary against `dist/`.
- No backend, quote form, email, uploads, database, analytics, cookies, or CMS in `001`; `/api/*` is reserved.

## Decisions

- Public site remains portable static output; Caddy is the only production runtime; no Node.js.
- Owner owns Git and deployment: agents create `feat/NNN-name` branches only and never commit/push/reset unasked.
- Local-first delivery: `make build && make up` on any Docker-capable host; no registry, no remote deploy target, no provider-specific config.
- No GitHub automation: no CI workflows, API clients, release or branch-protection tooling.
- Root/trailing-slash redirects and security headers live on the edge; localized 404s live on web.
- Future backend joins the same `app` network, publishes no port, and is routed through the edge under `/api/*`.
- Scripts/styles stay external (`assetsInlineLimit: 0`, `inlineStylesheets: 'never'`) for strict CSP.
- `i18n.routing.redirectToDefaultLocale` is `false` to avoid a duplicate-route build warning.

## Learnings and Pitfalls

- Never advertise 24/7 availability, unconfirmed coverage, or invented business claims.
- Keep the existing `public/logo.jpg` on light surfaces; no vector/transparent asset yet.
- `handle_errors` keeps the 404 status and must re-import headers; it catches Caddy errors (502/504), not upstream 404s, so localized bodies pass through the proxy.
- Astro preview returns 404 for `/es` without a slash; the edge adds the `308` redirect.
- Start order matters: edge waits for a healthy web via `depends_on`.
- Never use `docker compose down -v`; certificates live in the Caddy volumes.
- The official Caddy image sets `cap_net_bind_service=+ep` on `/usr/bin/caddy`; with `cap_drop: ALL` the empty bounding set makes `execve` fail with `operation not permitted` (container exits 255). Strip it at build time with `getcap`/`setcap -r`.
- Never publish the web service port, and never route backend traffic around the edge.
- `.agents/skills/` is installer-managed through `skills-lock.json`; do not hand-edit it.
- Docker access needs the `docker` group or root; the agent must ask the owner to run privileged or Docker commands and share the output.

## Next Steps

- Owner runs `docker compose ps -a`, `docker compose logs --tail=80 web`, and `docker inspect ea-electricidad-web-1 --format '{{json .State.Health}}'`; share the output to diagnose the `web` crash loop.
- After the fix: rebuild, `make up`, `make smoke`, and confirm both services are healthy.
- Owner commits the 001 work when ready; acceptance-criteria status per item is recorded at the end of `specs/001-project-foundation/task.md`.
