# MEMORY.md — Project Memory

Keep concise (~50 lines). Update after meaningful work and remove obsolete information. Permanent rules live in `AGENTS.md`.

## Current State

- `001-project-foundation` is committed. `002-homepage` is implemented on `feat/002-homepage` (revised 2026-11-06) and uncommitted; the owner reviews, commits, and deploys.
- Homepage: short full-bleed landscape hero over `hero.jpg` (Peñón de Calpe) with a translucent blue scrim and copy panel; a three-fact credential rail; exactly three work categories — Iluminación, Electricidad, Climatización — each with a dominant slideshow stage (two images at `lg`, one below) and four bullets; compact blue closing band and three-column footer; gentle 1.5s/1.8s slide reveals without scroll hijack; green WhatsApp and telephone-mark call actions site-wide.
- The three stages auto-advance every 8s with a right-to-left fade handoff (450ms out, 650ms in) and move by one visible page, so desktop pairs never repeat a photo. Iluminación opens on `skyscraper1` and, at `lg`, `skyscraper1` + `skyscraper2`; Climatización's odd count ends on a lone fifth image with a trailing gap. There are no visible controls or counter; keyboard arrows/Home/End, hover/focus/off-screen pause, and click/tap or Space/Enter pause remain. Reduced motion starts paused and advances instantly; no-JS keeps the native scroller.
- Removed from the homepage in the 2026-11-05 revision: the circuit-row services panel and the four-photo job triptych (`ServicesPanel.astro`, `WorkGallery.astro`). The five canonical service categories remain on `/services/`.
- Homepage photos are confirmed real EA jobs: `hero.jpg` plus the 6/4/5 images in `public/homepage/{ilumination,electricity,climatization}`. Iluminación's array is ordered with `skyscraper1`/`skyscraper2` first so the opening frame is fixed. Neutral localized alt text is in use; per-photo descriptions/captions remain PENDING. `header.jpg` is unused but left in place.
- Final checks (2026-11-06): `pnpm validate` passed (lint, format, `pnpm check` 0 errors, 32/32 unit tests, 17-page build); `pnpm test:e2e` 43/43 including axe in `es`/`en`/`fr` and the fade/page-pair/opening-pair tests.
- Review screenshots: `/tmp/opencode/ea-002-screenshots` (regenerated 2026-11-06 after the second motion revision). The owner's first review asked for slower reveals, the `skyscraper1`/`skyscraper2` opening, and no repeated desktop pairs; final approval of those changes, the odd Climatización tail, and the crops is PENDING.
- Responsive/hero measurements (2026-11-05): overflow 0 at 320/375/768/1024/1280/1440; hero heights 579/528/496/448/448/454px; desktop H1 stays two lines.
- Astro 7.4.4 static site, TypeScript strict, Tailwind CSS 4, Node 24.16.0, pnpm 12.16.1; locales `es` (default), `en`, `fr` via typed dictionaries; pages: home, services, contact, legal (noindex), localized 404; root redirects to `/es/`. SEO: canonical, hreflang + `x-default`, sitemap, staging `noindex` and disallow-all robots.
- Container stack: `edge` (public Caddy) + `web` (internal Caddy) on the private `app` network; project name `ea-electricidad`. Images `ea-electricidad-edge:local`/`ea-electricidad-web:local` come from one multi-stage `Dockerfile`; only `edge` publishes TCP 80/443 + UDP 443, while `web` uses `expose: 8080`.
- `Caddyfile` is the edge (TLS, headers, redirects, compression, logs, proxy); `Caddyfile.web` is the internal static server. `scripts/smoke.sh` checks HTTP behavior plus local topology: health, only-edge exposure, edge→web DNS, no Node.js in either image.
- `Makefile` targets: `help`, `build`, `up`, `down`, `restart`, `logs`, `status`, `smoke`, `clean`. No `deploy` target, no Git commands, no CI, no `.github/`; checks run locally (`pnpm validate`, `pnpm test:e2e`, `make build`, `make up`, `make smoke`).
- Docker image build/up/smoke not verified by the agent: no access to `/var/run/docker.sock`. The `web` crash-loop cause is fixed in both Dockerfile targets (Caddy file capability + empty bounding set), pending the owner's rebuild.
- No backend, quote form, email, uploads, database, analytics, cookies, or CMS in `001` or `002`; `/api/*` is reserved.

## Decisions

- Public site remains portable static output; Caddy is the only production runtime; no Node.js.
- Owner owns Git and deployment: agents create `feat/NNN-name` branches only and never commit/push/reset unasked.
- Local-first delivery: `make build && make up` on any Docker-capable host; no registry, no remote deploy target, no provider-specific config.
- Root/trailing-slash redirects and security headers live on the edge; localized 404s live on web.
- Future backend joins the same `app` network, publishes no port, and is routed through the edge under `/api/*`.
- Scripts/styles stay external (`assetsInlineLimit: 0`, `inlineStylesheets: 'never'`) for strict CSP; `i18n.routing.redirectToDefaultLocale` is `false` to avoid a duplicate-route build warning.
- 002 keeps the H1 text, metadata, routes, five service categories, and canonical/hreflang behavior; no new dependencies or image-optimization pipeline.
- 002 hero: `clamp(2.15rem, 3.4vw, 3rem)` H1, `lg:max-w-[42rem]` panel, ~28rem desktop / ~33rem mobile. Category stage `md:col-span-7 lg:col-span-8`, consistent `aspect-[3/4]`, 8s slideshow with page-sized advances and the fade handoff; reveals use 1500ms opacity/translate, 1800ms clip-path, and `cubic-bezier(0.4, 0, 0.2, 1)`; button transitions exclude `outline-color` so focus rings appear immediately.

## Learnings and Pitfalls

- Never advertise 24/7 availability, unconfirmed coverage, or invented business claims.
- Keep the existing `public/logo.jpg` on light surfaces; no vector/transparent asset yet.
- `handle_errors` keeps the 404 status and must re-import headers; it catches Caddy errors (502/504), not upstream 404s, so localized bodies pass through the proxy.
- Astro preview returns 404 for `/es` without a slash; the edge adds the `308` redirect. Start order matters: edge waits for a healthy web via `depends_on`.
- Never use `docker compose down -v`; certificates live in the Caddy volumes.
- The official Caddy image sets `cap_net_bind_service=+ep` on `/usr/bin/caddy`; with `cap_drop: ALL` the empty bounding set makes `execve` fail with `operation not permitted` (exit 255). Strip it at build time with `getcap`/`setcap -r`.
- Never publish the web service port, and never route backend traffic around the edge.
- `.agents/skills/` is installer-managed through `skills-lock.json`; do not hand-edit it.
- Docker access needs the `docker` group or root; the agent must ask the owner to run privileged or Docker commands and share the output.
- 002 slideshow: no visible controls; the track keeps a localized group label and click/Space pause, and hides its scrollbar only after JS marks the root ready. Desktop advances a full pair; a `data-odd` trailing spacer lets the lone Climatización image reach the start edge. `skyscraper3.jpg` is 9:16 and needs its own crop review. The agent cannot preview images; the owner reviews crops.
- Axe blends colors during the reveal transition and can report a false contrast violation; the E2E audit waits for motion to settle. Astro 7 preview daemonizes; if Playwright reports an early webServer exit, start `pnpm preview --host 127.0.0.1 --port 4321`, set `BASE_URL=http://127.0.0.1:4321`, and stop it with `pnpm exec astro preview stop`.

## Next Steps

- Owner provides per-photo descriptions/alt text, reviews the second motion revision (slower reveals, opening pair, odd Climatización tail), the hero crop, category layouts, and 3:4 crops, then commits `feat/002-homepage` when ready; agents do not commit or push.
- Owner rebuilds the Caddy fix and verifies: `make build && make up && make status && make smoke`.
