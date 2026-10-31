# MEMORY.md — Project Memory

Keep concise (~50 lines). Update after meaningful work and remove obsolete information. Permanent rules live in `AGENTS.md`.

## Current State

- `001-project-foundation` is implemented but uncommitted on `feat/001-project-foundation`; specs are approved in `specs/001-project-foundation/`.
- Astro 7.4.4 static site, TypeScript strict, Tailwind CSS 4, Node 24.16.0, pnpm 12.16.1.
- Locales `es` (default), `en`, `fr` via typed dictionaries; routes `/es/`, `/en/`, `/fr/`.
- Pages: home, services, contact, legal (noindex), localized 404; root redirects to `/es/`.
- SEO: canonical, hreflang + `x-default`, sitemap, staging `noindex` and disallow-all robots.
- Container files: multi-stage `Dockerfile`, `Caddyfile`, `compose.yaml`, `Makefile`, `scripts/smoke.sh`.
- Compose builds the image `ea-electricidad:local` from source; there is no image registry.
- CI (`.github/workflows/ci.yml`) targets `main` and builds through `docker compose build`.
- Docker image build not verified locally: current user lacks access to `/var/run/docker.sock`. Compose config and Make targets are verified statically.
- Caddy runtime verified with a local Caddy 2.10.2 binary against `dist/`: all smoke assertions pass.
- No quote form, email, uploads, database, analytics, cookies, or CMS in `001`.

## Decisions

- Public site remains portable static output; Caddy is the only production runtime; no Node.js.
- Workflow: feature branch → pull request → manual review → `main`; only `main` deploys.
- Local and VPS both build with the same `compose.yaml`/`Dockerfile`/`Makefile`; no image transfer.
- `make deploy` (VPS only): stop → remove old image → fetch and hard-reset `origin/main` → rebuild → start with `--wait`.
- VPS is staging/demo only: downtime and application data loss are acceptable; `caddy_data`/`caddy_config` and `Caddyfile` are preserved.
- Rollback rebuilds a previous known-good commit, then returns to `main`.
- Staging target: `https://<VPS_IP>.sslip.io`, conditional on trusted HTTPS; no custom domain yet.
- Root redirect: `src/pages/index.astro` emits a static meta refresh; Caddy enforces `308` in production.
- `i18n.routing.redirectToDefaultLocale` is `false` to avoid a duplicate-route build warning.
- Scripts/styles stay external (`assetsInlineLimit: 0`, `inlineStylesheets: 'never'`) for strict CSP.
- Security headers are a Caddy snippet applied to normal and error responses.

## Learnings and Pitfalls

- Never advertise 24/7 availability, unconfirmed coverage, or invented business claims.
- Keep the existing `public/logo.jpg` on light surfaces; no vector/transparent asset yet.
- `handle_errors` preserves the 404 status, but headers must be re-imported inside it.
- Astro preview returns 404 for `/es` without a slash; Caddy adds the `308` redirect.
- Email delivery success is not submission success; handle notification failures in `004`.
- Never copy images to the VPS and never build outside the documented Compose path.
- The VPS `deploy` discards tracked local edits; changes must go through Git.
- Never use `docker compose down -v`; certificates live in the Caddy volumes.
- Verify `sslip.io` DNS, ports 80/443, and ACME issuance before presenting staging.
- `.agents/skills/` is installer-managed through `skills-lock.json`; do not hand-edit it.

## Next Steps

- Commit on `feat/001-project-foundation`, push, open the PR, and let CI run.
- Rename the GitHub default branch `master` → `main` and require review (repo-admin action).
- Complete VPS preflight: OS, sudo/SSH, firewall, ports, DNS, and TLS feasibility.
- Build the image + smoke on a machine with Docker access; then `make deploy` and prove rollback.
- Acceptance-criteria status per item is recorded at the end of `specs/001-project-foundation/task.md`.
