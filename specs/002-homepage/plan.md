# Implementation Plan — 002 Homepage (2026-11-06 revision + 2026-11-21 change request)

- Status: implemented — 2026-11-21 change request (§14) validated 2026-11-21; the 2026-11-06 revision in §§1–13 is implemented
- Date: 2026-11-04, revised 2026-11-05, revised 2026-11-06, updated 2026-11-21
- Reading order: §§1–13 describe the implemented homepage and stay valid except where §14 supersedes them (those spots are marked “2026-11-21”). §14 is the plan for the 2026-11-21 change request (spec R60–R78 and the changed R1, R5, R7, R9, R10, R13, R43, R46–R48, R51, R55–R58).
- Related specification: `specs/002-homepage/spec.md`
- Branch: `feat/002-homepage`
- Target: owner-managed; no fixed integration branch requirement

## 1. Summary

Replace the previous overlapping-photo hero and four-photo triptych with a shorter, transparent hero over the new **Peñón de Calpe** landscape, followed by three alternating work categories: **Iluminación**, **Electricidad**, and **Climatización**. Each category owns one dominant slideshow stage — two images side by side on desktop, one on mobile — and a short bullet list of work types. The reveal language is slower and softer, and the slideshow advances with a right-to-left vanish/appear handoff and no visible chrome. The green WhatsApp action, compact closing band, and three-column footer stay.

The existing `001` architecture stays: Astro static output, typed `es`/`en`/`fr` dictionaries, existing routes and metadata, no new dependencies, no backend, no data collection. The five service categories remain canonical on `/services/`; the homepage categories are portfolio groupings. The H1, canonical URLs, `hreflang`, and sitemap remain unchanged.

2026-11-21: the change request adds the new EA logo (white beside the hero panel at `lg`, blue above it below `lg`, blue in the header and the favicons, and a new share image), the RBET credential, a category pictogram row between the hero and the credential rail, and the new urgent-work note and contact lead. See §14.

## 2. Confirmed decisions

| Area | Decision |
|---|---|
| Hero image | New `public/homepage/hero.jpg`, 4898×3265, view of the Peñón de Calpe |
| Hero treatment | Photo behind a translucent blue scrim and translucent copy panel |
| Hero height | Roughly half the previous height; target ~26–28rem desktop, ~31–33rem mobile |
| Main body | Three categories in order: Iluminación, Electricidad, Climatización |
| Category media | One dominant slideshow stage per category |
| Desktop stage | Two images side by side at `lg` and above |
| Mobile stage | One image at a time |
| Photo folders | `/homepage/ilumination`, `/homepage/electricity`, `/homepage/climatization` |
| Motion | Slower, softer reveals; auto-advance slideshow with a right-to-left fade handoff |
| Slideshow UI | No visible controls and no visible image counter |
| Slideshow pausing | Pause on hover/focus; click/tap or Space/Enter toggles pause; reduced-motion default off |
| Slideshow timing | ~8s interval; ~1.1s fade handoff; page-sized advances; immediate advances under reduced motion |
| Canonical services | The five service categories remain on `/services/`; homepage categories are work groupings |
| Scope | Homepage redesign; shared CTA styles remain on services/contact; no other page redesigns |

## 3. Design plan

### 3.1 Concept — “El Peñón y el cuadro”

The hero is the one bold moment: the local crag and coastline behind a deep-blue translucent panel, like a view through the window of a well-ordered workshop. The body is the “cuadro”: three labelled circuits, each with a light table of real work. The page should feel rooted in Calpe and in the trade, not like a generic small-business template.

Spend the boldness on the hero photograph and the three large stages. Everything else stays quiet: flat blue and white fields, thin rules, small yellow markers, and disciplined type.

### 3.2 Color tokens

| Token | Value | Use |
|---|---|---|
| `--color-brand` | `#00208f` | Hero scrim, copy panel, closing, footer |
| `--color-brand-strong` | `#001a73` | Hover/pressed blue |
| `--color-accent` | `#fad951` | Quote action, structural ticks, bullet markers, top rule, category pictograms (2026-11-21, R5) |
| `--color-accent-strong` | `#f0c62f` | Yellow hover |
| `--color-surface-muted` | `#f4f6fb` | Alternate category bands |
| `--color-ink` | `#0b1220` | Primary text |
| `--color-ink-muted` | `#4a5568` | Secondary text |
| `--color-line` | `#d7dce7` | Hairlines on light surfaces |
| `--color-whatsapp` | `#25d366` | WhatsApp action only |
| `--color-whatsapp-strong` | `#1ebe5a` | WhatsApp hover |
| `--color-whatsapp-ink` | `#052e16` | Text/icon on WhatsApp green |

No new decorative hues. The only gradient is the hero scrim, which exists for legibility over the photograph. (2026-11-21) The yellow-to-orange gradient inside the logo belongs to the brand mark and is not a decorative gradient (R1).

### 3.3 Typography

- Display: Space Grotesk Variable, weights 500/600/700.
- Body: Source Sans 3 Variable, weights 400/600.
- H1: `clamp(2.15rem, 3.4vw, 3rem)`, weight 600, tracking `-0.025em`, line-height `1.04`. The maximum is capped at 3rem so the headline stays two lines inside the landscape panel.
- H2 (category titles): `clamp(1.9rem, 3.2vw, 2.75rem)`, weight 600, tracking `-0.02em`.
- Lead: `clamp(1.05rem, 1.3vw, 1.2rem)`, line-height `1.55`, max 58ch.
- Body/bullets: `1rem`–`1.0625rem`, line-height `1.6`.
- Labels: `0.875rem`, weight 600, sentence case, no uppercase tracking.

No single-word color accent in the H1. No all-caps eyebrows. No monospace meta strings.

### 3.4 Layout principles

- Left-aligned on a 12-column grid, max content width about 1180px.
- Hero is a full-bleed landscape with a constrained copy panel; the credential rail is a thin full-width band.
- Each category alternates stage and text, but on mobile the stage always comes first.
- The stage is the dominant element: 7 of 12 columns at `md` and 8 of 12 at `lg`, with two image frames at `lg`.
- Small radii (2–4px); flat surfaces; no card grids.
- Yellow is a marker and action color, never body text on white.
- Closing and footer remain one compact blue base.

### 3.5 Review against the brief

- The hero is not a generic full-screen photo: it is a deliberately short, transparent local-landmark band with a translucent blue panel and a credential rail. The photo remains visible behind the copy.
- The body is not a card kit: it is three alternating editorial bands, each dominated by one large two-up light table.
- The slideshow is not a decorative auto-carousel: it moves slowly, fades instead of snapping, offers a hidden pause mechanism and keyboard paging, and defaults to off under reduced motion. The absence of chrome keeps the photographs dominant.
- The three categories are presentation groupings, not a silent replacement of the five service categories; the canonical services page remains linked from the hero.
- The yellow markers, hairlines, and small radii carry the “Cuadro” language without numbered labels or all-caps chrome.

## 4. Page composition

### 4.1 Hero and credential rail

Desktop:

```text
┌──────────────────────────────────────────────────────────────┐
│ hero.jpg: Peñón de Calpe, full-bleed, object-cover           │
│  ┌───────────────────────────────┐                           │
│  │ ▸ Electricista en Calpe       │   photo visible behind    │
│  │ Instalaciones eléctricas ...  │   and to the right        │
│  │ Lead ...                      │                           │
│  │ [Solicitar presupuesto] [Ver] │                           │
│  └───────────────────────────────┘                           │
└──────────────────────────────────────────────────────────────┘
  ▸ 20+ años   ▸ Instalador autorizado (RBET)   ▸ Seguro RC
```

(2026-11-21) The diagram above predates the logo and the pictogram row. The current composition is hero (with logo), category pictogram row, credential rail; see §14.5.

Implementation:

- Section: `relative isolate overflow-hidden bg-brand text-white`, `min-h-[33rem] sm:min-h-[31rem] lg:min-h-[28rem]`.
- Background: `<img src="/homepage/hero.jpg" width="4898" height="3265" class="absolute inset-0 h-full w-full object-cover object-[50%_50%] lg:object-[50%_45%]">`.
- Scrim: a `.hero-scrim` layer with a horizontal blue gradient on desktop and a vertical lower gradient on mobile.
- Copy panel: `hero-copy w-full max-w-2xl border-l-4 border-accent bg-brand/80 p-5 sm:p-7 lg:max-w-[42rem] lg:p-8`.
- Content: eyebrow, H1, lead, quote `accent`, services `outline-light`.
- Mobile: copy panel sits in the lower part; stronger scrim; same content order.
- Credential rail: full-width brand-blue strip, `border-b border-white/15`, three facts in a wrapping row with small yellow squares.

### 4.2 Work categories

Desktop, category 1 and 3:

```text
┌──────────────────────────────────────────────────────────────┐
│ ▸ Iluminación                                                │
│ ┌───────────────────────────┐  ┌───────────────────────────┐ │
│ │ image 1                   │  │ image 2                   │ │
│ └───────────────────────────┘  └───────────────────────────┘ │
│                                ▸ Puntos de luz y enchufes    │
│                                ▸ Iluminación interior ...    │
│                                ▸ Cambio de luminarias ...    │
│                                ▸ Tiras LED                   │
└──────────────────────────────────────────────────────────────┘
```

Category 2 mirrors the layout: text left, stage right. On mobile:

```text
▸ Electricidad
┌───────────────────────────┐
│ image 1                   │
└───────────────────────────┘
▸ Instalaciones nuevas ...
▸ Cuadros y protecciones ...
▸ Averías y reparaciones ...
▸ Revisiones y certificados ...
```

Implementation:

- One `<section>` per category, `py-14 sm:py-20`, alternating `bg-white` and `bg-surface-muted`.
- Inner grid: `md:grid-cols-12 md:items-center md:gap-8 lg:gap-12`.
- Stage: `md:col-span-7 lg:col-span-8`; text: `md:col-span-5 lg:col-span-4`. The stage stays first in the DOM; category 2 flips it to the right with `md:order-2`.
- Category heading: `h2` with a small yellow square marker.
- Lead: muted, max 42ch.
- Bullets: `ul` with `border-t border-line`, each `li` `flex gap-3 border-b border-line py-3`, yellow square marker.
- Stage: `work-slideshow` with a clipped track and two-up CSS at `lg`.
- Reveal: stage `data-reveal="left"` or `right`; heading/text `data-reveal="up"`; bullets stagger.

### 4.3 Slideshow

Markup:

```html
<div class="work-slideshow" data-slideshow data-interval="8000">
  <div
    class="work-slideshow-track"
    data-slideshow-track
    tabindex="0"
    role="group"
    aria-label="Galería de Iluminación. Pulse o use la barra espaciadora para pausar o reanudar."
  >
    <figure class="work-slide" data-slideshow-slide>…</figure>
    …
  </div>
</div>
```

There are no buttons, no counter, and no live status. The localized group label carries the pause instruction so the hidden mechanism remains discoverable.

CSS:

```css
.work-slideshow-track {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  transition:
    opacity 650ms cubic-bezier(0.22, 1, 0.36, 1),
    translate 650ms cubic-bezier(0.22, 1, 0.36, 1);
}

.work-slideshow-track.is-leaving {
  opacity: 0;
  translate: -1.5% 0;
  transition:
    opacity 450ms cubic-bezier(0.55, 0, 0.55, 0.2),
    translate 450ms cubic-bezier(0.55, 0, 0.55, 0.2);
}

.work-slideshow-track.is-entering {
  opacity: 0;
  translate: 1.5% 0;
  transition: none;
}
```

Behavior in `src/scripts/home-slideshow.ts`:

- Find all `[data-slideshow]` and add `slideshow-ready` to the root so the no-JS scrollbar is hidden.
- Compute the step from the first slide width plus the track gap; visible count is 2 at `lg`, otherwise 1.
- Page by the visible count: the timer and ArrowRight/ArrowLeft move by two images on desktop and one on mobile, so consecutive two-up pages never repeat a photo. If a manual swipe settles between pages, skip forward to the next page that does not reuse a visible image.
- The Iluminación array starts with `skyscraper1.jpg` and `skyscraper2.jpg`; the rest follow. This fixes the opening frame without adding a special case to the component.
- Programmatic advance runs a fade handoff:
  1. Wait up to 250ms for the target image to decode.
  2. Add `is-leaving`; the track fades and drifts left for 450ms.
  3. With the track invisible, jump `scrollLeft` to the target with `behavior: 'auto'`.
  4. Add `is-entering` (offset right, transparent), force a reflow, then remove it so the track settles over 650ms.
- Guard concurrent advances and queue the latest requested target. Cancel the handoff on resize, swipe, or a reduced-motion change.
- Auto-advance uses `setTimeout` (8s), only when the root intersects the viewport, the document is visible, and the user has not paused it. Clear the timer when off-screen or hidden.
- Pause on `pointerenter`/`focusin`; resume on `pointerleave`/`focusout`.
- Click/tap toggles pause when the pointer did not drag more than ~8px; Space/Enter toggles pause when the track is focused.
- ArrowLeft/ArrowRight move one visible page and Home/End jump to the ends; prevent default. End lands on the last page start.
- The final page of an odd image count holds a lone slide aligned to the start edge. The stylesheet adds a trailing flex spacer at `lg` so `scrollLeft` can reach that position; no photo is repeated to fill the second column.
- Keep the current index in sync with manual scrolling, and recompute it on resize.
- Under `prefers-reduced-motion: reduce`, start paused and advance instantly with no classes or fade.
- Expose the paused state on the root (`data-paused`, `is-paused`) for styling and tests; no counter or status is announced.

No new dependencies. The script is homepage-only, bundled by Astro, and small.

### 4.4 Closing and footer

Keep the compact blue base from the previous revision:

- Closing band: brand blue, yellow top rule, contact heading/lead, call `accent` + phone icon, WhatsApp `whatsapp` + mark.
- Footer: three columns (contact, hours, area), hairline separator, business name only in the copyright line.
- No changes to the legal link, hours, service area, or contact details.

## 5. Files and components

| File | Change |
|---|---|
| `src/pages/[locale]/index.astro` | Use the new hero, credential rail, and three-category body; keep the closing band and reveal script. |
| `src/components/home/Hero.astro` | Rewrite with the landscape background, scrim, translucent copy panel, and credential rail. |
| `src/components/home/HeroFacts.astro` | Optional small component for the credential rail; keep it simple if inlined. |
| `src/components/home/WorkCategories.astro` | Map the three categories to sections. |
| `src/components/home/WorkCategory.astro` | One alternating category band with heading, lead, bullets, and stage. |
| `src/components/home/WorkSlideshow.astro` | Reusable slideshow stage with images and no visible controls or counter. |
| `src/lib/home-work.ts` | Category keys, image paths, dimensions, and folder metadata. |
| `src/scripts/home-slideshow.ts` | Fade handoff, auto-advance, hidden pause mechanism, keyboard paging, and reduced-motion handling. |
| `src/components/home/ServicesPanel.astro` | Remove from the homepage; the five services stay on `/services/`. |
| `src/components/home/WorkGallery.astro` | Remove; replaced by the three category stages. |
| `src/i18n/messages/es.ts` | Replace `home.jobs.*`/`home.services*` with `home.work.*` and slideshow labels; update hero alt. |
| `src/i18n/messages/en.ts` | Mirror the Spanish keys. |
| `src/i18n/messages/fr.ts` | Mirror the Spanish keys. |
| `src/styles/global.css` | Add hero scrim, slideshow track/fade transition styles, slower reveal timing, and reduced-motion rules. |
| `tests/e2e/homepage.spec.ts` | Replace the old jobs/services assertions with hero, rail, three categories, two-up stage, fade handoff, hidden UI, no-JS, reduced motion, and overflow checks. |
| `tests/unit/i18n.test.ts` | Add assertions for three categories and four bullets per category; keep five service categories. |
| `MEMORY.md` / `AGENTS.md` | Record the revised homepage state and PENDING inputs. |

No new dependencies. No changes to `astro.config.mjs`, `compose.yaml`, `Dockerfile`, or the Caddy files.

## 6. Content and i18n

### 6.1 Hero copy

Keep:

- `home.eyebrow`, `home.title`, `home.lead`, `home.facts.*`.
- `cta.quote`, `cta.viewServices`.

Change:

- `home.heroImageAlt`:
  - ES: “Vista del Peñón de Calpe y la costa.”
  - EN: “View of the Peñón de Calpe and the coast.”
  - FR: “Vue du Peñón de Calpe et de la côte.”

### 6.2 Work categories

Add `home.work.heading` (optional, visually hidden if needed), `home.work.categories.<key>.title`, `.lead`, `.bullets`, `.imageAlt`, and `home.work.slideshow.*`.

| Key | Spanish | English | French |
|---|---|---|---|
| `ilumination.title` | Iluminación | Lighting | Éclairage |
| `ilumination.lead` | Luz interior y exterior, puntos de luz y tomas de corriente. | Interior and exterior lighting, light points and power outlets. | Éclairage intérieur et extérieur, points lumineux et prises. |
| `electricity.title` | Electricidad | Electrical | Électricité |
| `electricity.lead` | Instalaciones, cuadros, averías y revisiones. | Installations, consumer units, faults and inspections. | Installations, tableaux, pannes et contrôles. |
| `climatization.title` | Climatización | Climate control | Climatisation |
| `climatization.lead` | Aire acondicionado, mantenimiento y fontanería básica. | Air conditioning, maintenance and basic plumbing. | Climatisation, entretien et plomberie de base. |

Bullets (4 per category), all within the five approved services:

- **Iluminación:** puntos de luz y enchufes; iluminación interior y exterior; cambio de luminarias y mecanismos; tiras LED.
- **Electricidad:** instalaciones nuevas y reformas; cuadros eléctricos y protecciones; búsqueda de averías y reparaciones; revisiones y certificados.
- **Climatización:** instalación de aire acondicionado; mantenimiento y limpieza de equipos; fontanería básica; termos y pequeños trabajos de agua.

Image alts: neutral category descriptions, e.g. “Trabajo de iluminación realizado por EA electricidad y multiservicios.” Append the image number in the component if needed for uniqueness.

Slideshow label (only one key remains):

- stage label, including the hidden pause instruction:
  - ES: “Galería de {category}. Pulse o use la barra espaciadora para pausar o reanudar.”
  - EN: “{category} gallery. Click or press Space to pause or resume.”
  - FR: “Galerie : {category}. Cliquez ou appuyez sur Espace pour mettre en pause ou reprendre.”

Remove the previous/next/pause/play/status keys; there is no visible control copy or counter.

### 6.3 Removals

Remove unused keys:

- `home.jobs.*`
- `home.servicesHeading`
- `home.servicesLead`

Keep the five `services.items.*` for `/services/`. Keep the footer, contact, and CTA keys.

### 6.4 Metadata

Keep the exact H1 strings and the homepage title/description, canonical, `hreflang`, `x-default`, sitemap, and robots behavior. No structured data changes.

## 7. Image handling

- Hero: `/homepage/hero.jpg`, `width="4898"`, `height="3265"`, `loading="eager"`, `fetchpriority="high"`, `decoding="async"`, localized alt.
- Categories:
  - `/homepage/ilumination/` — 6 images.
  - `/homepage/electricity/` — 4 images.
  - `/homepage/climatization/` — 5 images.
- Each image has explicit width/height from the source, `loading="lazy"`, `decoding="async"`, and localized alt.
- Stage frames use a consistent `aspect-[3/4]` and `object-cover`; do not stretch.
- Tune `object-position` after owner review, especially for landscape images inside the portrait frames and for `skyscraper3.jpg` (9:16).
- Do not move, rename, or delete the source files.
- The old `/homepage/header.jpg` is no longer used by the homepage; leave it in place for the owner. Do not delete it.

Trade-off: direct public images avoid a new build pipeline but forgo Astro image optimization. The hero is about 2 MB, so it stays eager and high priority; category images stay lazy. If performance is insufficient, propose WebP/srcset variants as a follow-up.

## 8. Accessibility, SEO, and performance

### 8.1 Accessibility

- One `h1`; each category is an `h2`; no heading for the credential rail, the bullets, or (2026-11-21, R48) the pictogram-row labels.
- Icons `aria-hidden="true"`; any remaining buttons keep visible or accessible labels.
- The slideshow has no visible buttons or counter; the group label explains the click/Space pause.
- Auto-advance pauses on hover/focus, stops off-screen, toggles on click/tap or Space/Enter, and is off by default under reduced motion. This keeps a pause mechanism under WCAG 2.2.2 without visible chrome.
- The track is focusable with a visible focus ring and supports arrow keys, Home, and End.
- Contrast:
  - White on the brand scrim and `#00208f`.
  - `#0b1220` on `#fad951`.
  - `#052e16` on `#25d366`.
  - `#4a5568` on white and `#f4f6fb`.
  - Hero lead at white/90 over the scrim; verify AA.
- Reduced motion and no-JS paths tested.
- Alt text for all hero and category images; no empty alt unless an image is decorative (not the case here).

### 8.2 SEO

- Canonical, `hreflang`, `x-default`, sitemap, staging `noindex`, and robots output must not change.
- Keep the homepage title/description.
- No new structured data, reviews, ratings, addresses, or service-area claims.
- The category names are work groupings, not new service claims.

### 8.3 Performance

- No new dependencies.
- Hero eager/high priority; category images lazy.
- Explicit dimensions/aspect ratios prevent CLS.
- Slideshow script is small and homepage-only; no page-level scroll listeners.
- Fonts remain self-hosted from `001`.
- Inspect the build output for JS/CSS growth; record what was measured, not a guessed score.

## 9. Testing

### 9.1 Unit tests

- Translation parity catches missing/removed keys.
- Add assertions that `home.work.categories` has exactly three keys, each with four bullets, and that `services.items` still has exactly five categories.

### 9.2 End-to-end tests

Update `tests/e2e/homepage.spec.ts`:

- For each locale, the homepage returns 200 and has the correct `lang`.
- The H1 text is unchanged.
- Hero image is `/homepage/hero.jpg` with `alt`, `loading="eager"`, `fetchpriority="high"`, width 4898, height 3265.
- The hero scrim and copy panel exist; the hero height at 1280 is below the old ~758px and within the target range.
- The credential rail shows three facts.
- Exactly three category sections exist with the localized headings.
- Each category has one slideshow stage, the expected image count, and four bullets.
- At 1280, two slides are visible in the first stage; at 375, one.
- No control bar, button, counter, or live status exists in the stage. Keyboard paging applies the fade classes and moves the track; click/Space toggles `data-paused`.
- With JavaScript disabled, the hero, rail, categories, first images, bullets, closing, and footer are visible; the track scrolls and no controls exist.
- With `reducedMotion: 'reduce'`, reveal elements are visible, the slideshow starts paused, and advances are immediate with no fade classes.
- No horizontal overflow at 320, 375, 768, and 1280 in all locales.
- Axe: no serious or critical violations on the homepage in all locales (existing suite covers home; keep it).

### 9.3 Visual review

- Generate screenshots at 375, 768, and 1280 for the hero, each category, and the closing/footer.
- The owner reviews the landscape crop, the alternating layouts, the two-up stage, the slower reveals, and the slideshow fade handoff.
- The agent must not claim to have visually approved the images.

### 9.4 Commands

1. `pnpm validate`
2. `pnpm test:e2e`
3. Review the build output for the new assets and JS size.
4. Update `MEMORY.md` and `AGENTS.md`.

No Docker rebuild is required for a static homepage change; the owner can rebuild later to verify through the edge.

## 10. Risks and trade-offs

| Risk | Impact | Mitigation |
|---|---|---|
| Short hero crops the Peñón | Weak local identity | Responsive `object-position`; owner review at 375/768/1280; slightly taller mobile hero if needed |
| Hero text over bright sky/water | Contrast failure | Translucent blue scrim plus copy panel at 80% opacity; verify contrast |
| 2 MB hero | Slow LCP | Eager/high priority, explicit dimensions; propose WebP/srcset follow-up if needed |
| Portrait images in portrait frames | Some landscape photos crop at the sides | Consistent `aspect-[3/4]` with `object-cover`; tune focal points after review |
| Odd image count in Climatización | Lone slide on the final desktop page | Page by the visible count and add trailing track space so the last image is reachable without repeating the previous one; note the empty half until a sixth photo exists |
| Slideshow auto-advance distracts | Accessibility/UX issue | Slower 8s cadence, hover/focus pause, click/Space toggle, off-screen stop, reduced-motion default off |
| Repeated photos on two-up | The next page reuses a visible image | Advance by the visible count and skip overlapping pages after a manual swipe; E2E checks consecutive pairs |
| Blank frame during fade handoff | Visible flicker | Keep the stage geometry stable, wait up to 250ms for decode, keep the handoff short |
| JS disabled | No controls available | There are no controls; keep the native scroller and all images in the document |
| Horizontal overflow | Broken mobile layout | Clip the stage; keep the track inside; test document overflow; keep the fade drift inside the container padding |
| Three categories read as new services | Business-rule conflict | Present them as work groupings; keep the five canonical services on `/services/` and link from the hero |
| Long FR/EN labels | Clipped text | Only the stage label and body copy remain; allow wrapping; test all locales |
| Agent cannot see images | Visual defects missed | Owner reviews screenshots/crops; mark PENDING |
| Branch mixing | Messy history | Work stays on `feat/002-homepage`; owner commits |

## 11. Rollout sequence

1. Update the spec, plan, and task for the 2026-11-06 revision.
2. Slow the reveal to 1500ms for opacity/translate and 1800ms for the clip mask with a gentle ease-in-out curve; align the clip-mask timeout.
3. Add the category data and i18n keys; remove the old jobs/services homepage keys.
4. Rewrite the hero with the landscape, scrim, translucent panel, and credential rail.
5. Build the three category sections and the two-up slideshow stage.
6. Implement the fade handoff, page-sized advances (two on desktop, one on mobile), the fixed Iluminación opening pair, the odd-tail spacer, hidden pause mechanism, keyboard paging, 8s auto-advance, and reduced-motion behavior; remove the visible controls and counter.
7. Remove `ServicesPanel` and `WorkGallery` from the homepage; keep the five services on `/services/`.
8. Update the homepage and unit tests.
9. Run `pnpm validate` and `pnpm test:e2e`.
10. Generate screenshots; ask the owner to review the hero crop, category layouts, slower reveals, and fade handoff.
11. Update `MEMORY.md` and `AGENTS.md`.
12. Owner commits and deploys when ready. No push, commit, or deployment by the agent.

## 12. PENDING items

- Per-photo descriptions and final alt text for the three category folders.
- Owner visual approval of the hero crop, the alternating category layouts, the two-up stage, the fixed Iluminación opening pair, the slower reveals, and the slideshow fade handoff.
- Bullet refinement after the owner reviews the work-type wording.
- Optional resized/WebP image variants if the 2 MB hero or category images fail performance review.
- Whether to extend the category design language to the services page in a later specification.

## 13. Definition of done

The plan is complete when the specification’s acceptance criteria are met, the landscape hero is short and legible with the Peñón visible, the three categories dominate the body with working two-up slideshows and the slow fade handoff, the reveals are slower and no visible slideshow chrome remains, the pause and reduced-motion/no-JavaScript paths work, the five service categories remain canonical on `/services/`, `pnpm validate` and `pnpm test:e2e` pass, the owner has reviewed the crops and motion, and `MEMORY.md` plus `AGENTS.md` record the actual state and remaining PENDING inputs.

## 14. Change request 2026-11-21 — logo, RBET credential, category pictogram row, urgent-work copy

Plan decisions in this section are numbered `P-n` so they are not confused with the `D-n` entries in `DECISIONS.md`.

### 14.1 Summary

- **Brand assets.** Prepare the logo assets once, with a one-off Pillow script that is not committed (P-5). They are committed as static files under `public/brand/`:
  - two display variants: blue 362×324 and white 833×746;
  - a 32×32 icon and a 180×180 apple-touch icon, both on opaque white;
  - a 1200×630 share image.
  The file names and dimensions are declared once in a new `src/config/brand.ts`.
- **Hero.** The temporary `logoVariant` prototype becomes the final, prop-free layout:
  - at `lg`, a 1.4fr/1fr grid with a 2.5rem gap. The white logo sits in an absolutely positioned box that spans the panel's row, with `object-contain`, so it follows the panel and never sets the hero height;
  - below `lg`, the blue logo sits above the panel at 112 px (144 px from `sm`), with a 16 px gap.
- **Header, head and share image.** The header uses the blue logo at 44 px tall. `BaseLayout` links the two icons. `Seo.astro` switches the share image to `/brand/share.png`.
- **Pictogram row.** A new static band between the hero and the credential rail. It holds three in-page links (Electricidad, Iluminación, Climatización), each with a hand-drawn yellow pictogram and a white label that reuses the category heading text.
  - Layout: three across from 360 CSS px; one stacked column below that.
  - Destinations: anchors on the category sections, with `scroll-margin-top` so the sticky header does not cover them.
  - No JavaScript and no reveal animation.
- **Credential rail.** It moves out of `Hero.astro` into its own component, unchanged except for the text.
- **Copy.** Three dictionary values change in each locale: `home.facts.authorization`, `contact.hoursNote` and `contact.lead`. No key is added or removed.
- **Cleanup.** The temporary preview page, `public/logo-preview/` and `docs/logo-preview/` are deleted. The cut-outs are deleted last (Algorithm A).
- **Unchanged.** No new dependency, route, script, structured data or SEO change apart from the share-image URL.

### 14.2 Files and responsibilities

| File | Change | Requirements |
|---|---|---|
| `public/brand/logo-blue.svg` (new) | Blue display variant, 362×324, indexed PNG with alpha | R60, R61, R63, R66 |
| `public/brand/logo-white.svg` (new) | White display variant, 833×746 (the cap), indexed PNG with alpha | R60, R61, R62 |
| `public/brand/icon-32.png` (new) | 32×32 RGB icon, white background, made from the blue variant | R67 |
| `public/brand/apple-touch-icon.png` (new) | 180×180 RGB apple-touch icon, white background, made from the blue variant | R67 |
| `public/brand/share.png` (new) | 1200×630 share image, white background, made from the 833×746 blue cut-out | R68 |
| `src/config/brand.ts` (new) | Asset paths and dimensions; the placed-mark parameters for the icons and the share image; pure ratio helpers | R60, R61, R66–R68 |
| `src/components/home/Hero.astro` | Remove `logoVariant`, its type, the prototype comment and the variants. Add the final compact (blue) and `lg` (white) logos. Move the rail out. | R9, R10, R62–R65 |
| `src/components/home/CredentialRail.astro` (new) | The rail markup moved verbatim from `Hero.astro` (`data-testid="credential-rail"`) | R7, R9, R13 |
| `src/components/home/CategoryRow.astro` (new) | The pictogram row band: three in-page links, with labels from the dictionaries | R7, R70–R75 |
| `src/components/home/CategoryPictogram.astro` (new) | Three original inline SVGs, keyed by `WorkCategoryKey`; `currentColor`, `aria-hidden` | R5, R72 |
| `src/components/home/WorkCategory.astro` | Add `id={workSectionId(key)}` and `scroll-mt-20` to the category `<section>` | R75 |
| `src/lib/home-work.ts` | Add `categoryRowOrder` and `workSectionId()` | R70, R71, R75 |
| `src/pages/[locale]/index.astro` | Order: `Hero`, `CategoryRow`, `CredentialRail`, `WorkCategories`, closing | R7 |
| `src/pages/[locale]/logo-preview.astro` | Delete | R65 |
| `public/logo-preview/` | Delete after the assets are generated and the R61 white-size check passes (Algorithm A, step 8) | R65 |
| `docs/logo-preview/` | Delete (D-24) | R65 |
| `src/components/layout/Header.astro` | Blue logo `h-11 w-auto`, no `rounded`, no fixed width; the link gap goes from `gap-3` to `gap-1.5` (P-12) | R66 |
| `src/layouts/BaseLayout.astro` | Replace the `/logo.jpg` icon link with the 32×32 icon and apple-touch links | R67 |
| `src/components/seo/Seo.astro` | Share image `absoluteAssetUrl(env.SITE_URL, brandAssets.share.src)` | R68 |
| `src/i18n/messages/{es,en,fr}.ts` | New values for `home.facts.authorization`, `contact.hoursNote` and `contact.lead`; code comments mark the en/fr values PENDING owner review | R13, R43, R46, R47, R76–R78 |
| `tests/support/motion.ts` (new) | `waitForMotion` (moved out of `foundation.spec.ts`) plus `waitForFonts` | R55 |
| `tests/support/visible-image.ts` (new) | `containRect()`: the visible image after `object-fit: contain` | R61, R62 |
| `tests/support/png.ts` (new) | `readPngInfo()`: signature, IHDR (width, height, colour type), chunk list | R60, R61, R67, R68 |
| `tests/unit/brand.test.ts` (new) | Brand helpers, and the committed files' dimensions, ratio, colour type, opacity and byte budgets | R60, R61, R67, R68 |
| `tests/unit/home-work.test.ts` (new) | Row order; permutation of the three keys; unique section ids that differ from the heading ids | R70, R71, R75 |
| `tests/unit/test-support.test.ts` (new) | `containRect` and `readPngInfo` on synthetic input | R55 |
| `tests/unit/i18n.test.ts` | Exact R13, R76 and R77 strings; no “IBTB”; urgent note without digits or weekdays; existing parity and 24/7 checks kept | R13, R43, R46, R47, R76–R78 |
| `tests/unit/seo.test.ts` | Fixture `/logo.jpg` becomes `/brand/share.png` (P-18) | R69 |
| `tests/e2e/homepage.spec.ts` | Hero logo, hero-height deltas, credential text, row layout, labels and links, no-JS additions | R7, R9, R10, R13, R48, R55, R62–R64, R70–R75 |
| `tests/e2e/site-brand.spec.ts` (new) | Header logo on every page, header height and name room, favicon and share files, pixel checks, preview-page 404, urgent note and contact lead, same-origin requests | R55, R60, R61, R65–R68, R72, R76, R77 |
| `tests/e2e/build-output.spec.ts` (new) | Audit of `dist/`: no inline script or style, no “IBTB”, no logo-preview, icons and share image on every page, sitemap URL set, no JSON-LD | R51, R55, R56, R65, R67, R68, R72, R78 |
| `tests/e2e/foundation.spec.ts` | Import `waitForMotion` from `tests/support/motion.ts`; otherwise unchanged | R55 |

Reused without change: `Container.astro`, `ButtonLink.astro`, `WorkCategories.astro`, `WorkSlideshow.astro`, `home-slideshow.ts`, `home-reveal.ts`, `global.css` (the `hero-copy` entrance, the `.on-dark :focus-visible` yellow ring, the global reduced-motion rule that already forces `scroll-behavior: auto`), `absoluteAssetUrl` in `src/lib/seo.ts`, the category titles in `home.work.categories.*.title`, and the inline-SVG pattern of `src/components/ui/icons/IconPhone.astro`. Also unchanged: `astro.config.mjs`, `playwright.config.ts`, `package.json`, the Caddy files, `public/logo.jpg` and `public/logo2.jpeg`.

### 14.3 Logic (pure units)

`src/config/brand.ts`:

```ts
export const logoCutout = { width: 833, height: 746 } as const; // D-30
export function logoHeightForWidth(width: number): number;       // Math.round(width * 746 / 833)
export function isUndistortedFile(width: number, height: number): boolean;   // |height − logoHeightForWidth(width)| ≤ 1 (D-53)
export function isUndistortedRender(width: number, height: number): boolean; // |height − width * 746 / 833| ≤ 1 (D-53)
export interface PlacedMark { x: number; y: number; width: number; height: number } // D-54
export const brandAssets: {
  logoBlue:       { src: '/brand/logo-blue.svg';        width: 362;  height: 324 };
  logoWhite:      { src: '/brand/logo-white.svg';       width: 833;  height: 746 };
  icon32:         { src: '/brand/icon-32.png';          width: 32;   height: 32;  mark: { x: 1;   y: 2;  width: 30;  height: 27 } };
  appleTouchIcon: { src: '/brand/apple-touch-icon.png'; width: 180;  height: 180; mark: { x: 10;  y: 18; width: 160; height: 143 } };
  share:          { src: '/brand/share.png';            width: 1200; height: 630; mark: { x: 320; y: 64; width: 560; height: 502 } };
};
```

`src/lib/home-work.ts` (additions):

```ts
export const categoryRowOrder: readonly WorkCategoryKey[] = ['electricity', 'ilumination', 'climatization']; // R70, D-11
export function workSectionId(key: WorkCategoryKey): string; // `work-section-${key}`; the heading ids stay `work-${key}`
```

Test support (pure, test-only, so not in `src/`):

- `containRect(box: {x, y, width, height}, natural: {width, height}) → {x, y, width, height}` is the centred rectangle that `object-fit: contain` draws: scale = min(box.w / nat.w, box.h / nat.h).
- `readPngInfo(bytes: Uint8Array) → { width, height, colorType, chunks: string[] }` throws on a bad signature. Only IHDR and the chunk types are read; nothing is decoded.

No time, randomness or other I/O is involved. The PNG files are read only by the tests.

### 14.4 Algorithm

**A. One-off asset preparation** (P-5, P-6). This runs once in the implementer's session as `.tmp/brand-assets.py`, with system Python 3 and Pillow 12.1.1. `.tmp/` is git-ignored as “Local tooling”, and the script is never committed. Its parameters are recorded here and in `src/config/brand.ts`.

```
CUT_BLUE  = public/logo-preview/logo-transparent.png   # 833×746, 151,058 B
CUT_WHITE = public/logo-preview/logo-white.svg         # 833×746, 150,503 B
mark_h(w) = round(w * 746 / 833)        # no value used here ends in .5, so Python and JS rounding agree

def resize(im_rgba, w):                  # premultiplied, area-averaging, no ringing
    return im_rgba.convert('RGBa').resize((w, mark_h(w)), Image.Resampling.BOX).convert('RGBA')
def to_palette(im_rgba):                 # indexed PNG, ≤ 256 colours, alpha kept in tRNS
    return im_rgba.quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)
def frame_ok(im):                        # R60: 4 corners + every pixel of the outermost 1-px frame have alpha 0
    a = im.convert('RGBA').getchannel('A'); check rows 0 and h-1, columns 0 and w-1 are all 0

0. Assert both cut-outs are 833×746 and pass frame_ok. Report the smallest transparent margin m
   (the distance from the alpha>0 bounding box to the edge; expected 6–7 px).
   Assert the blue footprint 833/362 = 2.3 px ≤ m (so BOX cannot reach the mark from the frame).
1. blue  = to_palette(resize(CUT_BLUE, 362))  → assert size (362, 324), frame_ok → save public/brand/logo-blue.svg (optimize=True)
2. white = to_palette(CUT_WHITE)  (no resize: the R61 cap, P-7) → assert (833, 746), frame_ok → save public/brand/logo-white.svg
3. src   = open(public/brand/logo-blue.svg).convert('RGBA')          # icons come from the blue variant (R67, D-14)
   for (size, w, x, y) in [(32, 30, 1, 2), (180, 160, 10, 18)]:
       mark = resize(src, w); canvas = Image.new('RGB', (size, size), (255, 255, 255))
       canvas.paste(mark, (x, y), mark) → save as RGB PNG (no alpha channel, no tRNS)
       → icon-32.png, apple-touch-icon.png
4. mark = resize(CUT_BLUE.convert('RGBA'), 560) → (560, 502)   # from the 833×746 cut-out, downscaled only (R68, D-31)
   canvas = Image.new('RGB', (1200, 630), white); paste at (320, 64) with its alpha
   → quantize to 256 colours (no tRNS) → save public/brand/share.png
5. Assert both display variants are smaller than their cut-out (151,058 B and 150,503 B).
   Print every file's size and bytes for VERIFICATION.md.
6. If any assert fails, stop and report. Do not clean, trim or recolour the mark to make an assert pass (R60).
7. Commit nothing. Wire the code to /brand/*, then run the unit and e2e asset checks.
8. Only after the e2e R61 white-size check (Algorithm B) passes, delete public/logo-preview/.
   The cut-outs are the only source for a re-run.
```

**B. Display-variant sizing (R61).** The plan fixes the rendered sizes.

- **Blue:** the largest rendered size is the hero compact logo from 640 to 1023 px: `sm:h-36` = 144 CSS px tall, 144 × 362/324 = 160.9 CSS px wide. The header is 44 px and the phone hero 112 px. The file is 362×324:
  - 2× = 321.8×288 ≤ 362×324;
  - 2.5× = 402.2×360 ≥ 362×324.
- **White:** the logo is width-limited from a 1152 px viewport up, because the container caps at 72rem. The column track is (1088 − 40) / 2.4 = 436.7 CSS px, so the expected largest visible width is about 437 CSS px and 2× ≈ 873 > 833. The cap applies: the file is exactly 833×746 (D-51).
  - Guard: the e2e test measures the largest visible white logo at 1024, 1280 and 1440 in es, en and fr.
  - IF 2× that size does not exceed 833×746, THEN the file must instead be 2–2.5× the measured size. Re-run step 2 with `resize(CUT_WHITE, ceil(2.25 × measured width))`, which is why the cut-outs are deleted last.

**C. Hero geometry.**

- **≥1024:** the grid is `minmax(0,1.4fr) minmax(0,1fr)` with `gap-10`. The logo column holds only an absolutely positioned `<img>` (`inset-0`, `h-full w-full`, `object-contain`).
  - The column contributes no height, so the row height is the panel height. The hero height does not depend on the logo (R10).
  - The visible image is `containRect(column box, 833×746)`. It is panel-tall unless the column width limits it, and it is centred on both axes, so it is vertically centred against the panel (R62).
- **<1024:** the compact wrapper is `mb-4` (16 px) and `lg:hidden`. The `<img>` is `h-28 sm:h-36 w-auto`, so its element box equals its visible image. It is left-aligned with the panel's left border edge (R63).
  - Hero growth equals the visible logo height plus 16 px, or less where the `min-h` absorbs part of it. That is within the R10 cap.

**D. E2E measurement procedures** (all after `waitForFonts` and `waitForMotion`, because the `hero-copy` entrance translates the logo and panel):

1. Visible image: read `getBoundingClientRect()`, `naturalWidth` and `naturalHeight` after `img.complete && naturalWidth > 0`, then apply `containRect`.
2. Hero-height delta at ≥1024 (D-41):
   - record `hero.height`;
   - remove only the white `<img>` element and wait two animation frames;
   - record it again and assert `|Δ| ≤ 2`.
3. Hero growth below 1024 (R10):
   - record the hero height, the visible logo height and the gap (panel top minus logo bottom);
   - remove `[data-testid="hero-logo-compact"]` and record the hero height again;
   - assert growth ≤ logo height + gap + 1. Record the values at 375 and 390.
4. Grid ratio (R62): split `getComputedStyle(grid).gridTemplateColumns` into px tracks; assert 1.3 ≤ t0 / t1 ≤ 1.5 and 36 ≤ `columnGap` ≤ 44.
5. Label integrity (R73), for each label:
   - it is visible;
   - `scrollWidth ≤ clientWidth + 0.5`;
   - its rect lies inside its link's rect and inside `[0, innerWidth]`;
   - for every word, a `Range` over that word's text returns exactly one client rect (a mid-word break gives two).
6. Link destination (R75):
   - press Enter on the focused link and poll `scrollY` until two reads 100 ms apart match;
   - assert the section's `top` ≥ the header's `bottom` − 0.5 and `top` < `innerHeight`;
   - under reduced motion, assert that the `scrollY` read one frame after Enter equals the settled value (no animation).
7. Header name room (R66): the 5edbb07 header spent 44 + 12 = 56 px on the logo and the gap before the name. Assert that the measured logo width plus the computed link `column-gap` is ≤ 56 at 320, 375, 390, 768, 1024 and 1280. With the same text and font, the name then never gets less room than at 5edbb07. Record the name's `scrollWidth − clientWidth` at 375 and 390.

### 14.5 Interface

**Hero** (`Hero.astro`). Props are `{ locale }` only. The structure is the prototype's `white` variant, finalised:

```astro
<section class="on-dark relative isolate overflow-hidden bg-brand text-white" data-testid="hero">
  <!-- hero.jpg and .hero-scrim unchanged -->
  <Container class="relative">
    <div class="flex min-h-[33rem] items-end pb-5 pt-16 sm:min-h-[31rem] sm:pb-8 lg:min-h-[28rem] lg:items-center lg:py-10">
      <div class="w-full lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-10" data-testid="hero-grid">
        <div class="hero-copy mb-4 flex lg:hidden" aria-hidden="true" data-testid="hero-logo-compact">
          <img src={logoBlue.src} width={logoBlue.width} height={logoBlue.height} alt=""
               loading="eager" decoding="async" class="h-28 w-auto sm:h-36" />
        </div>
        <div class="hero-copy … unchanged panel classes …" data-testid="hero-panel"> eyebrow, H1, lead, two actions </div>
        <div class="hero-copy relative hidden lg:block" aria-hidden="true" data-testid="hero-logo">
          <img src={logoWhite.src} width={logoWhite.width} height={logoWhite.height} alt=""
               loading="eager" decoding="async" class="absolute inset-0 h-full w-full object-contain" />
        </div>
      </div>
    </div>
  </Container>
</section>
```

Both logo wrappers reuse `hero-copy`, so they enter with the panel and add no new animation. Under reduced motion and without JS the existing rules keep them static and visible (R64).

**Category pictogram row** (`CategoryRow.astro`, placed in `index.astro` between `Hero` and `CredentialRail`):

```astro
<div class="on-dark border-t border-white/15 bg-brand text-white" data-testid="category-row">
  <Container>
    <ul class="grid grid-cols-1 gap-x-2 py-2 min-[22.5rem]:grid-cols-3 sm:gap-x-6 sm:py-3">
      {categoryRowOrder.map((key) => (
        <li>
          <a href={`#${workSectionId(key)}`} data-category={key}
             class="group flex min-h-11 items-center gap-3 rounded-panel py-2 text-white no-underline
                    min-[22.5rem]:flex-col min-[22.5rem]:items-start min-[22.5rem]:gap-2
                    sm:flex-row sm:items-center sm:gap-3">
            <CategoryPictogram category={key} />
            <span class="block text-sm font-semibold leading-tight group-hover:underline sm:text-base">
              {t.home.work.categories[key].title}
            </span>
          </a>
        </li>
      ))}
    </ul>
  </Container>
</div>
```

- The layout has three states: one column with the pictogram beside the label below 360 px; three columns with the pictogram above the label from 360 to 639 px; three columns with the pictogram beside the label from 640 px. All items are left-aligned (R4).
- The links get the global `.on-dark :focus-visible` ring: 3 px `#fad951`, 3 px offset. Nothing in the band clips overflow.
- The row carries no `data-reveal` attribute and no script (P-14).
- The row has no heading and no landmark name. The list of three named links needs none, so no dictionary key is added (P-15).

**Pictograms** (`CategoryPictogram.astro`). Each is one `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" class="h-8 w-8 shrink-0 text-accent" data-pictogram={key}>`. They use presentation attributes only: no `style` attribute, no `<style>` or `<script>` element. The implementer hand-authors the paths and copies no path from any icon set. The concepts are:

- **electricity:** a wall socket, drawn as a rounded-square plate with an inner circle and two pin holes;
- **ilumination:** a ceiling pendant lamp, drawn as a drop cord, a trapezoid shade, a bulb arc and three short light rays;
- **climatization:** a wall-mounted split unit, drawn as a long rounded rectangle with a vent line and three wavy airflow lines below it.

The owner reviews whether they are simple and original (R58, R72). Contrast: `#fad951` on `#00208f` is 9.4 : 1, above the 3 : 1 minimum; the white labels on `#00208f` are 13.1 : 1, above 4.5 : 1.

**Category sections** (`WorkCategory.astro`): `<section id={workSectionId(key)} class="scroll-mt-20 py-14 sm:py-20 …">`. The 80 px scroll margin is larger than the 65 px sticky header (`h-16` plus a 1 px border). Smooth scrolling comes from the existing `html { scroll-behavior: smooth }`. The existing reduced-motion rule (`* { scroll-behavior: auto !important }`) makes the jump instant. Without JS the native fragment navigation works, and the reveal observer reveals the destination on arrival.

**Credential rail** (`CredentialRail.astro`): the markup moves unchanged out of `Hero.astro`. It renders `[t.home.facts.experience, t.home.facts.authorization, t.home.facts.insurance]`.

**Header:**

```astro
<a href=… class="flex min-w-0 items-center gap-1.5 no-underline">
  <img src={logoBlue.src} width={logoBlue.width} height={logoBlue.height} alt=""
       class="h-11 w-auto shrink-0" loading="eager" decoding="async" />
  <span class="truncate …">{site.name}</span>
</a>
```

The rendered logo is 49.2×44 CSS px. Logo plus gap is 55.2 px, against 56 px at 5edbb07. The header row stays `h-16`.

**Head** (`BaseLayout.astro`):

```html
<link rel="icon" href="/brand/icon-32.png" type="image/png" sizes="32x32" />
<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" sizes="180x180" />
```

Both values come from `brandAssets`.

**Share image** (`Seo.astro`): `og:image` and `twitter:image` become `${SITE_URL}/brand/share.png`. No other meta tag is added (R51).

### 14.6 Data and persistence

Static assets (committed binaries, prepared once, with no build pipeline, R61):

| Path | Pixels | Format | Placed mark (D-54) | Byte rule |
|---|---|---|---|---|
| `/brand/logo-blue.svg` | 362×324 | indexed + tRNS | — | < 151,058 B |
| `/brand/logo-white.svg` | 833×746 | indexed + tRNS | — | < 150,503 B (≈ 29 KB measured) |
| `/brand/icon-32.png` | 32×32 | RGB, opaque white | 30×27 at (1, 2) | — |
| `/brand/apple-touch-icon.png` | 180×180 | RGB, opaque white | 160×143 at (10, 18) | — |
| `/brand/share.png` | 1200×630 | indexed, opaque white, no tRNS | 560×502 at (320, 64) | — |

Every placed mark satisfies height = round(width × 746/833) and is a downscale (no upscaling).

Dictionary values (keys unchanged; en and fr carry a `// PENDING owner review (R13/R76/R77)` comment):

| Key | es | en | fr |
|---|---|---|---|
| `home.facts.authorization` | Instalador autorizado de baja tensión (RBET) | Authorised low-voltage installer (RBET) | Installateur autorisé basse tension (RBET) |
| `contact.hoursNote` | Las urgencias sin cita previa pueden tener un recargo. | Urgent work without an appointment may carry a surcharge. | Les urgences sans rendez-vous peuvent entraîner un supplément. |
| `contact.lead` | Puede contactar por teléfono, WhatsApp o correo electrónico. | You can contact us by phone, WhatsApp or email. | Vous pouvez nous contacter par téléphone, WhatsApp ou e-mail. |

The grep for “IBTB” found it only in `home.facts.authorization` (es.ts:53, en.ts:54, fr.ts:55). There is no metadata or structured data to change. The new fragment ids are `work-section-electricity`, `work-section-ilumination` and `work-section-climatization`; the heading ids `work-{key}` stay.

Backward compatibility:

- `public/logo.jpg` and `public/logo2.jpeg` stay in place and keep shipping in `dist/` (R69).
- After this change no built page and no file under `src/` or `tests/` references `/logo.jpg`. The remaining mentions are documentation only: `README.md:330` and `README.md:368`, `AGENTS.md:63`, the `docs/learning/` lessons 002, 004 and 005, `MEMORY.md`, and the specs. The owner can delete the file; that is the owner's decision (R69).
- No route, sitemap, canonical or `hreflang` change. Removing the preview page brings back the 9-URL sitemap of 5edbb07.

### 14.7 Decisions

- **P-1 (a): switch the share image to `/brand/share.png`, 1200×630.** Why:
  - after this change every other brand surface shows the new logo, so link previews should too;
  - `Seo.astro` already declares `twitter:card` `summary_large_image`, which expects about 1.91 : 1;
  - the mark is a 560×502 downscale of the 833×746 blue cut-out on white padding (R68, D-31);
  - switching leaves `/logo.jpg` unreferenced by the site.

  Discarded: keeping `/logo.jpg`, which shows the old brand in previews and keeps the old file referenced; a square 1200×1200 canvas, which large-image cards crop.
- **P-2: `/logo.jpg` becomes unreferenced by the build and the code.** The implementation report lists the remaining documentation mentions (§14.6). Deleting the file is the owner's call (R69). Discarded: deleting it, which the spec forbids in this change.
- **P-3 (b): the row is three across from 360 CSS px and stacks below that.** Why:
  - at 320 px a column is about 88 px, while “Climatización” and “Climatisation” need about 80–95 px at 14 px depending on font metrics and on the fallback font before the web font loads, which is too tight to guarantee;
  - from 360 px a column is at least 101 px, and 111 px at 390.
  - Below 360 px the stacked list costs about 150 px of height, on very few devices.

  Discarded: three across at every width with smaller labels (fragile, and below 14 px); stacking on every phone below 640 px (it triples the band height on the most common phones for no gain in fit).
- **P-4 (c): the items are links to the start of their category sections.** Why:
  - the owner suggested it;
  - a row of labelled pictograms reads as tappable, so dead labels would mislead;
  - plain fragment links need no JavaScript, work without JS, and the existing global rule already makes them instant under reduced motion;
  - the only additions are section ids and an 80 px `scroll-margin-top` that clears the 65 px sticky header.

  Focus uses the existing yellow `.on-dark` ring. The targets are the full item, at least 44 px tall and 88 px wide. Discarded: non-link items, which are simpler but are dead UI; links to the headings, which D-39 replaced.
- **P-5: a one-off asset script in `.tmp/` (git-ignored), not committed, using system Python and Pillow 12.1.1.** Its parameters are recorded in §14.4 and §14.6 and in `brand.ts`. Why:
  - D-46 says no new dependency;
  - the assets are prepared once (R61);
  - a committed script would depend on an undeclared system tool and become an unlinted, unverifiable artefact.

  Discarded: a committed Python script; a Node script using `sharp`, which is only a transitive Astro dependency, so pnpm may not resolve it from the root, and importing it would be an undeclared dependency.
- **P-6: premultiplied BOX downscaling, then FASTOCTREE quantisation to 256 colours without dither.** Why:
  - BOX averages only the output pixel's own footprint. At the blue scale that footprint is 2.3 source px, smaller than the 6–7 px transparent margin, so the frame rule holds by construction;
  - BOX has no ringing, so it adds no halo;
  - premultiplying stops the RGB of transparent pixels bleeding into the edge;
  - no dither keeps the output deterministic and keeps noise out of the transparent frame.

  Discarded: Lanczos, which is sharper but rings (halo) and can leak alpha into the frame (observed); dithering, which avoids banding but adds noise and bytes. Any banding goes to the owner's review.
- **P-7: blue 362×324 (2.25× its 160.9×144 maximum); white exactly 833×746 (the cap).** Why: these are R61's rules applied to the fixed rendered sizes, with the Algorithm B guard. Discarded: separate files per surface, because R60 allows exactly one file per variant.
- **P-8: icon placement.**
  - 32×32: the mark at 30×27 with 1 px side padding, for maximum detail at tab size.
  - 180×180: the mark at 160×143, inside iOS's rounded-corner mask.
  - Both on opaque white (D-23), as RGB, so no transparent pixel is possible.

  Discarded: edge-to-edge marks, which iOS crops at the corners.
- **P-9: asset names are `/brand/logo-blue.svg`, `/brand/logo-white.svg`, `/brand/icon-32.png`, `/brand/apple-touch-icon.png` and `/brand/share.png`.** Each file name identifies its variant (R60).
- **P-10: at `lg` the logo is an absolutely positioned `<img>` with `object-contain` filling the column box, with no container-query units.** Why:
  - it gives the same geometry as the prototype's `white` variant, which only used `container-type` for its `circle` variant;
  - the absolute box spans exactly the panel's row, so the logo can never set the height (R10) or overflow the column.

  Discarded: sizing with `cqw`/`cqh` units, which gives the same result with more CSS.
- **P-11: both hero logos load eagerly.** Why: they are 39 KB in total next to the 2 MB hero photo, and a lazy load could arrive after the panel's entrance (R64). Discarded: `loading="lazy"`, which avoids downloading the hidden variant.
- **P-12: the header link gap goes from `gap-3` to `gap-1.5`.** Why: the new 49.2 px logo plus 6 px is ≤ the old 44 + 12 px, so the business name never gets less room at any width (R66), and nothing else in the header moves. Discarded: keeping `gap-3`, which costs the name 5.2 px and fails R66 at 375 px, where the name probably already truncates (an estimate; Algorithm D-7 records the measured value); narrowing the outer header gaps, which changes the spacing of the navigation on every page.
- **P-13: the credential rail moves into `CredentialRail.astro`, and the row is its own component.** Why: `index.astro` then shows the R7 order directly, and the hero stays one section. Discarded: putting the row inside `Hero.astro` between the section and the rail.
- **P-14: the row is not animated.** Why:
  - it sits directly under the hero, in view on load, like the static rail;
  - a reveal would hide it until intersection, could clip the focus ring during the clip-path phase, and would make axe blend the colours;
  - R74 allows it to be static.

  Discarded: `data-reveal="up"` with stagger.
- **P-15: no new dictionary keys.** The labels reuse `home.work.categories.<key>.title`, so they equal the headings by construction (R70). The row needs no accessible name, and the logos are decorative (R43). Discarded: a `nav` landmark with a new label key, which would add unreviewed copy for little benefit.
- **P-16: yellow pictograms with white labels on brand blue.** Why: they match the rail's yellow markers (R5, R72). Discarded: white pictograms, which are flatter and less distinct from the labels.
- **P-17: Playwright runs on system Chrome through a temporary `.tmp/playwright.chrome.config.mjs`.** It is git-ignored and never committed. It sets `testDir: '../tests/e2e'`, `channel: 'chrome'` and the `BASE_URL` base URL, with no `webServer`. Why: `--browser` cannot override a configured project, and an environment variable needs a config change; this way the committed `playwright.config.ts` stays unchanged. Discarded: committing an optional `PLAYWRIGHT_CHANNEL` override (test-infrastructure scope creep); downloading the bundled browser (network, outside the repository).
- **P-18: the `seo.test.ts` fixture becomes `/brand/share.png`.** Why: the helper test stays the same, and no code or test reference to `/logo.jpg` remains (R69).
- **P-19: test-only helpers live in `tests/support/`, not `src/`.** Why: they have no runtime use, and principle 3 applies to app logic. They have their own unit tests because the logo e2e assertions depend on them.
- **P-20: tests never contain the literal preview path.** The R65 assertions use a pattern such as `/logo[-_]preview/`, so the R65 source-tree grep for `logo-preview` stays clean.
- **P-21: the hero keeps `pt-16` below `lg`.** Why: the measured growth at 375 px is expected to equal the R10 cap exactly (112 + 16 px), and that keeps a strip of photo above the logo for the Peñón. Discarded: reducing the top padding, which would cover more of the photo.

### 14.8 Test strategy

Commands. These are the real scripts. In agent shells, use `node_modules/.bin/*` when `pnpm` is not on `PATH`.

1. `pnpm validate`, which is `eslint .`, `prettier --check .`, `astro check`, `vitest run` and `astro build`. Without pnpm: `node_modules/.bin/eslint . && node_modules/.bin/prettier --check . && node_modules/.bin/astro check && node_modules/.bin/vitest run && node_modules/.bin/astro build`.
2. `pnpm test:e2e`. It works around the preview daemon pitfall. After the build:
   - start the server with `node_modules/.bin/astro preview --host 127.0.0.1 --port 4321`;
   - run `BASE_URL=http://127.0.0.1:4321 node_modules/.bin/playwright test`, adding `-c .tmp/playwright.chrome.config.mjs` when the bundled browser is missing (P-17);
   - stop the server with `node_modules/.bin/astro preview stop`.
3. Source-tree grep, for R65, R69 and R78. Run `grep -rn "logo-preview" src public tests docs --exclude-dir=learning` (expect nothing) and `grep -rn "/logo.jpg" src tests` (expect nothing). Grep `dist/` for `IBTB` (expect nothing). Record the full list of remaining `/logo.jpg` mentions for the report.

Unit tests (`vitest`):

- **`brand.test.ts`**
  - `logoHeightForWidth` and the two `isUndistorted*` helpers, including ±1 edge cases.
  - Each `public/brand/*.png` exists and its IHDR matches `brandAssets`.
  - Both display variants pass `isUndistortedFile` and are indexed (colour type 3).
  - The white variant is exactly 833×746. Both variants are smaller in bytes than their cut-outs.
  - Both icons are colour type 2 with no `tRNS` chunk, so they are opaque.
  - The share image is 1200×630 with no `tRNS`.
  - Every `mark` passes `isUndistortedFile`, fits inside its canvas, and is ≤ 833×746.
- **`home-work.test.ts`**: `categoryRowOrder` equals `['electricity','ilumination','climatization']` and is a permutation of the `workCategories` keys. `workSectionId` values are unique and differ from `work-{key}`.
- **`i18n.test.ts`**
  - The exact R13, R76 and R77 strings per locale.
  - No dictionary value contains `IBTB`.
  - `hoursNote` contains no digit and no weekday word (lunes–domingo, Monday–Sunday, lundi–dimanche).
  - The existing parity, five-services and 24/7 checks are kept.
- **`test-support.test.ts`**: `containRect` for width-limited, height-limited and exact fits; `readPngInfo` on a synthetic minimal PNG, and its rejection of a bad signature.
- **`seo.test.ts`**: the fixture path update.

E2E (`playwright`, chromium or system Chrome; es, en and fr unless stated):

- **Hero logo** (`homepage.spec.ts`)
  - Exactly one hero logo is visible at 320, 375, 390, 639, 640, 768, 1023, 1024, 1280 and 1440.
  - Below 1024 it is blue, at 1024 and above it is white.
  - Both have `alt=""` and an `aria-hidden="true"` wrapper.
  - Compact logo: visible height in 108–116 below 640 and in 140–148 from 640; gap to the panel 12–24; left edge within 1 px of the panel's left edge; `isUndistortedRender`.
  - ≥1024: grid ratio 1.3–1.5 and gap 36–44; visible height = panel height ± 2, or visible width = column width ± 2 with vertical centring ± 2; never taller than the panel, wider than the column, or outside the hero (2 px tolerance).
  - Hero-height delta ≤ 2 at 1024 and 1280 (D-41). Growth below 1024 within the R10 cap at 375, 390 and 768.
  - Under default motion, the logo wrapper's `animation-name` equals the panel's. Under reduced motion it is `none`.
  - R61: the largest visible size per variant, measured across the widths above and the header, against the file's natural size (Algorithm B).
- **Credential rail:** the exact R13 text in each locale. The rail comes after the row in DOM order and on screen.
- **Pictogram row**
  - DOM and visual order: hero, row, rail, first category.
  - Three links in R70 order. Each label equals the matching category `h2` text on the page. No heading inside the row.
  - Each pictogram is an `svg[aria-hidden="true"][focusable="false"]` with no `style` attribute, a computed colour of `rgb(250, 217, 81)` and a band background of `rgb(0, 32, 143)`.
  - At 320, 360, 375, 390, 768, 1024 and 1280, plus 640×400 for 200% zoom of a 1280×800 window: zero document overflow, and label integrity per Algorithm D-5.
  - At 320 the items form one column; at 360 and above, three across.
  - Links at 390×844 and 1280×800:
    - from the hero's services action, Tab reaches the first row link and the next Tabs reach the others;
    - the focused link has a solid outline of at least 2 px in `rgb(250, 217, 81)`;
    - each link's box is at least 44×44;
    - Enter sets the hash to `#work-section-{key}` and the section's top edge is in view below the header;
    - the destination's stage gains `is-visible`;
    - under reduced motion the jump is instant.
- **No-JS** (extends the existing test): the compact logo and the row are visible, and clicking a row link puts its section top in view.
- **Header and brand** (`site-brand.spec.ts`)
  - On `/`, `/services/`, `/contact/`, `/legal/` and `/404/` in each locale: the header logo `src` is `/brand/logo-blue.svg` with `alt=""`, it is 44 ± 0.5 px tall and passes `isUndistortedRender`, it has no border radius, and the header is 65 px tall.
  - The home link's accessible name is the business name.
  - The name-room check from Algorithm D-7. No overflow at 320 on the services and contact pages.
  - Canvas checks: draw each display variant at natural size; the four corners and every frame pixel have alpha 0. Every pixel of both icons has alpha 255.
  - `GET` each `/brand/*` file returns 200 with `image/png`.
  - `/{es,en,fr}/logo-preview/` returns 404.
  - Every request made by the homepage is same-origin (R72).
  - The footer on each page type shows the exact `hoursNote`. The contact page shows the exact `lead` and `hoursNote`.
- **Build output** (`build-output.spec.ts`, reading `dist/` relative to the test file)
  - No `<script>` without `src`, no `<style>` element, and no `style=` attribute.
  - No `IBTB`, no `logo[-_]preview` path, and no `application/ld+json`.
  - Every HTML page has exactly one `rel="icon"` link to `/brand/icon-32.png` with `sizes="32x32"`, one `apple-touch-icon` link to `/brand/apple-touch-icon.png`, and no icon link to `/logo.jpg`.
  - The `og:image` and `twitter:image` paths exist in `dist/`.
  - The sitemap's URLs are exactly es/en/fr × `/`, `/services/`, `/contact/`.
- **Kept:** axe in es, en and fr on `/`, `/contact/` and `/404/` after `waitForMotion`; the overflow tests at 320, 375, 768 and 1280; every existing homepage and foundation test.

Manual and owner review (R58; the agent cannot judge images): save screenshots at 390, 768, 1024 and 1280 in es, en and fr outside the repository, in the session scratchpad and not in `docs/`. The owner then reviews:

- the hero logo's size and placement;
- the white logo over bright parts of the photo;
- any halo or banding inside both variants;
- the Peñón with the compact logo at 375 and 768 (D-19);
- the header logo, both favicons, the share image, and the three pictograms (simple and original).

Results go into `specs/002-homepage/VERIFICATION.md` during validation (R56, AC25).

### 14.9 Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Resampling leaks alpha into the 1-px frame | R60 fails | BOX footprint (2.3 px) below the measured margin; `frame_ok` in the script and the canvas check in e2e; never “clean” the edge (P-6) |
| Palette banding or halo in the yellow-to-orange gradient | Visual quality | Owner review (R58); 256 colours; the white file at the cap keeps the most detail |
| The white logo's largest size does not reach the cap | R61 fails with an 833 file | Algorithm B guard; cut-outs deleted only after the check passes |
| Measuring during the `hero-copy` entrance or before web fonts load | Flaky geometry and label tests | `waitForFonts` and `waitForMotion` before every measurement |
| The narrower 1.4fr panel makes the desktop hero taller (about 488 px at 1280, against 448 today) | Exceeds the 28rem target | Accepted by R10 and D-29; the existing "≤ 540 at 1280" test still bounds it; record measurements |
| The compact logo pushes the phone hero to about 656 px at 375 and covers the Peñón | Weaker local identity | R10 cap test; owner reviews the crop (D-19); `pt-16` kept (P-21) |
| The white logo over bright sky or water at ≥1024 | Legibility of the mark | Owner review (D-21); the logo is decorative |
| The header name truncates more | R66 fails at 375 and up | P-12 gap change; overhead test (Algorithm D-7) |
| Row labels do not fit at the 360 px boundary or in the fallback font | Clipped label | Stacked below 360 px; label-integrity test at 320, 360, 375 and 390 after fonts load |
| Smooth-scroll timing, or the sticky header covering the destination | Flaky R75 test or a covered section | Poll `scrollY` until it is stable; `scroll-mt-20` (80 px) against the 65 px header; check at 390×844 and 1280×800 |
| The destination is still pre-reveal on arrival | Content invisible for 1.5 s | The existing observer reveals it on arrival; the test waits for `is-visible` |
| System Chrome differs from bundled Chromium | Small rendering differences | Record the browser and version in VERIFICATION.md |
| The Astro 7 preview daemon exits early under Playwright | E2E cannot start | Use `BASE_URL` with a manually started preview, stopped with `astro preview stop` |
| 200% zoom is approximated by a 640×400 viewport | Not true browser zoom | Recorded as the CSS-px equivalent (§8 of the spec) |
| `AGENTS.md` still says IBTB and `/logo.jpg` | Rules and site disagree | Before/after text for the owner (R57, D-2) |
| The en/fr credential, note and lead ship before review | Wording risk | Code comments mark them PENDING; the owner reviews them before deploying (D-25) |
| `public/logo2.jpeg` and `public/logo.jpg` keep shipping in `dist/` | Unused public bytes | Owner decision (R69, §10 of the spec) |

### 14.10 Requirement coverage (2026-11-21 change)

| ID | Approach | Test |
|---|---|---|
| G9 | §14.4 A–C, §14.5 hero, header and head | R60–R69 rows |
| G10 | §14.5 row, P-3, P-4 | R70–R75 rows |
| G11 | §14.6 dictionary values | R13, R76–R78 rows |
| R1 | Flat row band; the logo gradient belongs to the mark; no new CSS gradient | Code review of the CSS diff; owner review |
| R5 | Yellow pictograms (P-16); green stays WhatsApp-only | e2e: pictogram colour; existing action tests |
| R7 | `index.astro` order (P-13) | e2e: DOM and visual order |
| R9 | Hero content plus decorative logos; facts in `CredentialRail` | e2e: hero, rail and logo tests |
| R10 | Absolute logo column (Algorithm C); 16 px compact gap; P-21 | e2e: hero-height delta at 1024 and 1280 × 3 locales; growth cap at 375, 390 and 768 |
| R12 (impacted) | Crop unchanged; compact logo above the panel | Owner review at 375 and 768 (D-19) |
| R13 | `home.facts.authorization` values | unit: exact strings; e2e: rail text |
| R43 | No new keys (P-15); three values changed; none removed | unit: parity and exact values; `astro check` |
| R46 | `hoursNote` and `lead` copy; no hours in the note | unit: no digits or weekdays, no 24/7 |
| R47 | RBET fact; no number | unit and build-output: no “IBTB” |
| R48 | Row is a `ul` of links; no headings | e2e: no heading in the row; one `h1` (existing) |
| R51 | Preview page removed; share URL only; no JSON-LD | build-output: sitemap set, no `ld+json`; foundation tests |
| R55 | All tests in §14.8 | The suites themselves |
| R56 | §14.8 commands; dist audit | Verification task; VERIFICATION.md |
| R57 | The orchestrator updates `MEMORY.md`; `AGENTS.md` text goes to the owner | Report (not a code test) |
| R58 | Owner review list in §14.8 | Manual, PENDING owner |
| R60 | Algorithm A; P-6, P-9 | unit: IHDR, ratio, type; e2e: canvas frame check |
| R61 | Algorithm B; P-7 | e2e: measured largest size against natural size; unit: bytes and cap |
| R62 | Grid and absolute `object-contain` (P-10) | e2e: ratio, gap, height or width, centring, bounds |
| R63 | `h-28 sm:h-36`, `mb-4`, left-aligned | e2e: sizes, gap, alignment, one visible |
| R64 | `alt=""`, `aria-hidden`, `hero-copy` reuse | e2e: attributes, `animation-name`, reduced motion, no-JS; axe |
| R65 | Deletions; prop-free Hero | build-output; e2e 404; source grep |
| R66 | Header markup (P-12) | e2e: every page and locale, height, ratio, radius, name room |
| R67 | Icons (P-8); head links | unit: opaque and size; build-output: links on every page; e2e: canvas alpha |
| R68 | P-1 | unit: size and mark; build-output: file exists |
| R69 | Files kept; references listed (§14.6) | Source grep in verification; report |
| R70 | `categoryRowOrder`; reused titles | unit: order; e2e: order and label = heading |
| R71 | Row reuses the three groupings only | unit: permutation; five services (existing) |
| R72 | `CategoryPictogram` | build-output: no style or script; e2e: aria, colour, same-origin; owner review |
| R73 | P-3 layout | e2e: widths × locales, zoom, label integrity |
| R74 | No JS, no reveal (P-14) | e2e: no `data-reveal` in the row; no-JS test |
| R75 | P-4; `scroll-mt-20`; global reduced-motion rule | e2e: Tab, Enter, focus, 44×44, destination at both sizes, reduced motion, no-JS |
| R76 | `hoursNote` | unit: exact strings; e2e: footer on each page type and contact page |
| R77 | `contact.lead` | unit: exact; e2e: contact page |
| R78 | Value change; grep | unit; build-output: no “IBTB” |
| AC1 | This plan plus the next `tasks.md` update | Review |
| AC16, AC25 | §14.8 commands | VERIFICATION.md |
| AC18 | R57 | Report |
| AC19 | R60, R61, R65 | As R60, R61, R65 |
| AC20 | R10, R61–R64 | As R10, R62–R64 |
| AC21 | R66–R69 | As R66–R69 |
| AC22 | R13, R78 | As R13, R78 |
| AC23 | R70–R75 | As R70–R75 |
| AC24 | R46, R76, R77 | As R46, R76, R77 |
| AC26 | R58 | Owner review, PENDING |
| R2–R4, R6, R8, R11, R14–R42, R44, R45, R49, R50, R52–R54, R59 (unchanged) | §§1–13; R41, R49 and R50 also apply to the new links and labels; R52 holds because no JS is added | Existing unit and e2e suites (regression), axe in es, en and fr |

### 14.11 PENDING after this change

- Owner review of the R58 items listed in §14.8.
- en/fr wording for R13, R76 and R77.
- Whether EA does urgent work outside hours (D-33).
- Deleting `public/logo.jpg` and moving `public/logo2.jpeg` (owner).
- The `AGENTS.md` edits (owner).
- A vector logo from the client.

## Change log

- 2026-11-04 — Created.
- 2026-11-05 — Revised: landscape hero, credential rail, three work categories.
- 2026-11-06 — Revised: motion revision; implemented.
- 2026-11-21 — Updated for the approved 2026-11-21 change request (spec G-1). Added §14, covering:
  - the asset preparation, sizing and placement parameters;
  - the final hero logo layout, the header, favicons and share image;
  - the category pictogram row and its anchors;
  - the copy changes, decisions P-1–P-21, the test strategy, risks and coverage.

  Amended the header, §1, §3.2, §4.1 and §8.1 where §14 supersedes them. Status set to draft.
- 2026-11-21 — Plan approved (delegated approval, DECISIONS G-2).
- 2026-11-21 — Tasks file renamed to `tasks.md` (owner, DECISIONS D-58); naming only.
- 2026-11-21 — Change request implemented and validated (VERIFICATION.md, DECISIONS G-4).
