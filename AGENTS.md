# AGENTS.md — EA electricidad y multiservicios

Compact standing instructions for OpenCode agents. `MEMORY.md` holds current state and history; feature requirements belong in `specs/`.

## Read first

- Read `MEMORY.md` at the start of every task and update it at the end (keep it ~50 lines or fewer).
- Read the relevant `specs/NNN-*/spec.md`, `plan.md`, and `task.md` before touching a feature.
- Do not duplicate these permanent rules into `MEMORY.md`.

## Current repository state

- `specs/001-project-foundation/` is implemented but uncommitted on `feat/001-project-foundation`; the GitHub default branch is still `master` and must be renamed to `main`.
- Stack: Astro 7.4.4 static output, TypeScript strict, Tailwind 4, pnpm 12.16.1, Node 24.16.0.
- Commands: `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm test`, `pnpm test:e2e`, `pnpm validate`.
- Container workflow: `compose.yaml`, `Dockerfile`, `Caddyfile`, `Makefile` (`build`, `up`, `down`, `restart`, `logs`, `status`, `smoke`, `deploy`, `clean`), `scripts/smoke.sh`.
- No image registry: Compose builds `ea-electricidad:local` locally and on the VPS; the VPS deploys only `main` via `make deploy`.
- Local Docker access is unavailable to the current user; image build, `make up`, and smoke in a container are unverified.
- Do not add a database, admin dashboard, or authentication unless an approved specification requires it.
- `.agents/skills/` is installer-managed and pinned by `skills-lock.json`; don't hand-edit installed skills. Installed: `find-skills`, `frontend-design`, `seo-audit`.
- `.gitignore` exists and must keep excluding dependencies, build output, and `.env` files.

## Workflow (spec-driven)

- Meaningful work: create `specs/NNN-feature-name/` with `spec.md` (requirements, acceptance criteria, edge cases), `plan.md` (approach, trade-offs, dependencies), and `task.md` (ordered, verifiable tasks).
- Use sequential zero-padded ids; the next expected directory is `001-project-foundation`.
- Write or update the spec before implementing, and record significant technical trade-offs in `plan.md`.
- Ask when business, legal, or technical requirements are unclear. Record assumptions explicitly and mark unconfirmed decisions `PENDING`; never silently invent requirements.
- Do not start substantial implementation while the spec or plan is incomplete.
- Small maintenance changes need proportional documentation, not a new spec.

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
- Use placeholders until genuine project photos exist; never present stock or fabricated images as proof of work.
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
