# AGENTS.md — EA electricidad y multiservicios

Compact standing instructions for OpenCode agents. `MEMORY.md` holds current state and history; feature requirements belong in `specs/`.

## Read first

- Read `MEMORY.md` at the start of every task and update it at the end (keep it ~50 lines or fewer).
- Read the relevant `specs/NNN-*/spec.md`, `plan.md`, and `task.md` before touching a feature.
- Do not duplicate these permanent rules into `MEMORY.md`.

## Current repository state

- `specs/001-project-foundation/` is committed. `specs/002-homepage/` is implemented on `feat/002-homepage` (uncommitted; revised 2026-11-06) with the owner's visual review and commit PENDING. The owner handles commits, pushes, and deployment.
- Stack: Astro 7.4.4 static output, TypeScript strict, Tailwind 4, pnpm 12.16.1, Node 24.16.0.
- Commands: `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm test`, `pnpm test:e2e`, `pnpm validate`.
- Container workflow: `compose.yaml` (`edge` + `web` on the private `app` network), `Dockerfile` (`web`/`edge` targets), `Caddyfile` (public edge), `Caddyfile.web` (internal static server), `Makefile` (`build`, `up`, `down`, `restart`, `logs`, `status`, `smoke`, `clean`), `scripts/smoke.sh`.
- Only `edge` publishes ports; `web` uses `expose: 8080` and is unreachable from the host. `/api/*` is reserved for the future backend.
- No image registry and no CI: Compose builds `ea-electricidad-edge:local` and `ea-electricidad-web:local` on the machine that runs the stack; local deployment is `make build && make up`.
- The `web` crash loop is diagnosed: the official Caddy image sets a file capability that makes `exec` fail under `cap_drop: ALL`; both image targets now strip it. Rebuild with `make build && make up` and verify.
- Local Docker access is unavailable to the agent; image build, `make up`, stack smoke, and topology checks must be run by the owner.
- Homepage images `public/homepage/hero.jpg` plus `ilumination/` (6), `electricity/` (4), and `climatization/` (5) are confirmed real EA jobs (2026-11-05); per-photo alt text/captions are PENDING. The 002 homepage uses gentle 1.5s/1.8s slide reveals without scroll hijack, a short full-bleed landscape hero with a translucent panel, a three-fact credential rail, three alternating category bands with two-up slideshows at `lg`, a compact three-column closing/footer, and green WhatsApp plus phone-mark call actions site-wide. Iluminación opens on `skyscraper1` and, at `lg`, `skyscraper1` + `skyscraper2`. The slideshows advance every 8s by one visible page (two images at `lg`, so desktop pairs never repeat), with a right-to-left fade handoff; there are no visible controls or counter, keyboard arrows/Home/End remain, and hover/focus, click/tap, or Space/Enter pause. Climatización's odd count ends on a lone fifth image with a trailing gap. The old services panel and four-photo triptych were removed; the five service categories remain on `/services/`. The second motion revision and crops await owner visual approval.
- Do not add a database, admin dashboard, or authentication unless an approved specification requires it.
- `.agents/skills/` is installer-managed and pinned by `skills-lock.json`; don't hand-edit installed skills. Installed: `find-skills`, `frontend-design`, `seo-audit`.
- `.gitignore` exists and must keep excluding dependencies, build output, and `.env` files.

## Workflow (spec-driven)

- Meaningful work: create `specs/NNN-feature-name/` with `spec.md` (requirements, acceptance criteria, edge cases), `plan.md` (approach, trade-offs, dependencies), and `task.md` (ordered, verifiable tasks).
- Use sequential zero-padded ids; `001-project-foundation` and `002-homepage` exist, so the next new spec uses `003`.
- Write or update the spec before implementing, and record significant technical trade-offs in `plan.md`.
- Ask when business, legal, or technical requirements are unclear. Record assumptions explicitly and mark unconfirmed decisions `PENDING`; never silently invent requirements.
- Do not start substantial implementation while the spec or plan is incomplete.
- Small maintenance changes need proportional documentation, not a new spec.

## Git and deployment

- The owner owns Git history and deployment: they add, commit, push, and deploy.
- Agents may create feature branches (`feat/NNN-name`) and must not run `git add`, `git commit`, `git push`, `git rebase`, or `git reset` unless explicitly asked.
- Commit only when explicitly requested, with a meaningful message describing the change.
- Do not add GitHub automation: no CI workflows, no GitHub API clients, no release or branch-protection tooling.
- Work local-first: deploy locally with `make build && make up`. Keep the stack portable to any Docker-capable host and avoid provider-specific configuration.
- Never run `sudo`. When a privileged command is needed for verification, ask the owner to run it and explain what output to share.

## Language

- Project docs, code comments, identifiers, and agent instructions: **English**.
- Customer-facing content: Spanish (primary), English, French; keep the i18n architecture extensible for Russian and German.
- Never machine-translate legal or regulatory content without review.

## Non-negotiable business facts

- Business: EA electricidad y multiservicios, independent low-voltage electrical installer in Calpe, Alicante, Spain; 20+ years; IBTB basic category; states it holds the required authorization and civil liability insurance.
- Exactly five MVP service categories: (1) new installations and construction, (2) inspections and certificates, (3) faults and repairs, (4) air conditioning and plumbing, (5) installation maintenance. Do not add others without approval.
- Confirmed service area only: Calpe, Altea, Benidorm, Benissa, Teulada. Nearby urbanizations (~30 minutes) are unconfirmed.
- Hours: Monday–Friday, 08:00–20:00. Urgent work is only within those hours and may carry a surcharge. **Never advertise 24/7 availability.**
- Phone/WhatsApp: +34 668 56 32 87. Email: info@ea-electricidadymultiservicios.com.
- Never invent registration numbers, insurance details, certificates, reviews, ratings, project counts, photographs, or coverage.

## Brand and UI

- Brand colors: primary `#00208f`, secondary `#fad951`, white `#ffffff`.
- Logo is `public/logo.jpg`; do not replace it without approval (an SVG refresh may be explored later).
- The homepage uses confirmed genuine EA job photos; other pages use placeholders until genuine photos exist. Never present stock or fabricated images as proof of work, and never invent captions, locations, dates, or project details.
- Mobile-first, accessible, and conversion-focused: every page should offer a clear path to the quote form.

## Quote form and privacy (MVP core)

- Collect only: name, phone, email, municipality, service category, description, optional photos, and privacy acknowledgement with a policy link. Mark required vs optional fields.
- Validate on client and server; validate uploads on the server.
- Send the full submission by email to the business address, send the customer an acknowledgement, and localize success and error states.
- Uploads: whitelist extensions, MIME types, and actual content; document per-file and total size limits; generate safe storage names; store privately; expose only protected links (no permanent public URLs, no large email attachments); protect endpoints against abuse; never serve uploads as application code.
- Never expose submissions or uploads publicly; minimize collected data; avoid logging personal data; define retention and deletion before production.
- Do not claim GDPR compliance until the full implementation and legal documentation are verified.

## Verification and delivery

- Run only checks that exist, and list what you actually ran. Never claim a check passed unless it was executed.
- For affected work, verify all three languages, responsive behavior, keyboard access, form validation, and error states.
- SEO: use localized titles/descriptions, canonical URLs, and language alternates; never fabricate ratings, reviews, addresses, or business details in structured data.
- Make focused changes; inspect before overwriting user work; do not commit unless asked.
- Report changed files, checks performed, and remaining limitations at the end of each task.
