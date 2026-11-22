# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

The permanent project rules (business facts, spec-driven workflow, Git ownership, language, privacy, verification) live in `AGENTS.md` and are imported here. Current state and history live in `MEMORY.md`: read it at the start of a task and update it at the end (≤ ~50 lines). `README.md` holds the full Docker, deployment and rollback runbook.

@AGENTS.md

## Commands

```bash
pnpm dev                 # Astro dev server (http://localhost:4321, root redirects to /es/)
pnpm validate            # lint + format:check + astro check + unit tests + build: the main gate
pnpm test                # Vitest unit tests (tests/unit/**/*.test.ts)
pnpm exec vitest run tests/unit/routes.test.ts      # single unit file
pnpm exec vitest run -t "swapLocale"                # tests matching a name
pnpm test:e2e            # builds, then Playwright (chromium) against `astro preview` on :4321
pnpm exec playwright test tests/e2e/homepage.spec.ts -g "slideshow"   # single e2e (needs a prior `pnpm build`)
pnpm format              # Prettier write (includes .astro via prettier-plugin-astro)
make build && make up && make smoke   # container stack; the agent has no Docker access, so ask the owner
```

E2E pitfall: Astro 7 preview daemonizes, so Playwright may report an early webServer exit. Workaround: run `pnpm preview --host 127.0.0.1 --port 4321`, then `BASE_URL=http://127.0.0.1:4321 pnpm exec playwright test`, and stop it with `pnpm exec astro preview stop`.

## Architecture

**Static Astro site served by Caddy, with no Node at runtime.** `astro build` emits `dist/` (`output: 'static'`, `trailingSlash: 'always'`). The Dockerfile builds it and copies it into a Caddy image. `compose.yaml` runs two Caddy containers on a private `app` network:

- `edge` (`Caddyfile`) is the only service that publishes ports. It handles TLS, security headers/CSP, root and trailing-slash redirects, compression and the reverse proxy. `/api/*` is reserved for a future backend on the same network.
- `web` (`Caddyfile.web`) is an internal static server (`expose: 8080`) that serves the localized 404 pages.

Assets and stylesheets are never inlined (`assetsInlineLimit: 0`, `inlineStylesheets: 'never'`) so the strict CSP can forbid inline code. Keep it that way: no inline `<script>`/`<style>` that would need `unsafe-inline`.

**Routing and i18n.** Every real page lives under `src/pages/[locale]/` and uses `getStaticPaths() { return localeStaticPaths() }` plus `assertLocale(Astro.params.locale)`. Locales (`es` default, `en`, `fr`) are defined once in `src/lib/routes.ts`, which also provides the helpers `localizedPath` and `swapLocale`. `astro.config.mjs` mirrors that list for Astro i18n and the sitemap. To add a locale, change both places and add a dictionary. UI copy lives in typed dictionaries `src/i18n/messages/{es,en,fr}.ts`. The `Dictionary` type comes from `es.ts`, so `en`/`fr` fail type-checking if a key is missing. Read copy with `getDictionary(locale)` and never hardcode customer-facing strings in components.

**Business data and config.** Contact details, hours, service area and the WhatsApp link builder (`site`, `whatsappUrl`) are in `src/config/site.ts`. `src/lib/services.ts` holds the five canonical service categories and `src/lib/home-work.ts` the homepage photo sets. Build-time env (`SITE_URL`, `SITE_ENV`) is read in `astro.config.mjs` and validated with Zod in `src/config/env.ts`. `SITE_ENV=staging` (the default) emits `noindex` and a disallow-all `robots.txt` (`src/lib/robots.ts`, `src/pages/robots.txt.ts`). SEO helpers (canonical, hreflang alternates plus `x-default`) are in `src/lib/seo.ts` and rendered by `src/components/seo/Seo.astro` through `src/layouts/BaseLayout.astro`. Pure logic belongs in `src/lib`/`src/config`, which is what the unit tests cover.

**Client scripts.** These are small, framework-free TypeScript modules in `src/scripts/`: `home-reveal.ts` handles reveal-on-scroll through `data-reveal` attributes and `home-slideshow.ts` drives the homepage slideshows. They must degrade cleanly without JS and honor `prefers-reduced-motion`. The e2e suite checks the slideshow behavior and runs axe in all three locales; the axe audit waits for motion to settle because of reveal transitions.

**Styling.** This uses Tailwind 4 through the Vite plugin, with tokens in `src/styles/global.css` (brand `#00208f`, accent `#fad951`). The `@/` alias maps to `src/` in both Astro and Vitest.
