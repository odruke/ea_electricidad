# Implementation Plan — 002 Homepage (2026-11-06 revision)

- Status: Implemented — owner visual review and commit PENDING
- Date: 2026-11-04, revised 2026-11-05, revised 2026-11-06
- Related specification: `specs/002-homepage/spec.md`
- Branch: `feat/002-homepage`
- Target: owner-managed; no fixed integration branch requirement

## 1. Summary

Replace the previous overlapping-photo hero and four-photo triptych with a shorter, transparent hero over the new **Peñón de Calpe** landscape, followed by three alternating work categories: **Iluminación**, **Electricidad**, and **Climatización**. Each category owns one dominant slideshow stage — two images side by side on desktop, one on mobile — and a short bullet list of work types. The reveal language is slower and softer, and the slideshow advances with a right-to-left vanish/appear handoff and no visible chrome. The green WhatsApp action, compact closing band, and three-column footer stay.

The existing `001` architecture stays: Astro static output, typed `es`/`en`/`fr` dictionaries, existing routes and metadata, no new dependencies, no backend, no data collection. The five service categories remain canonical on `/services/`; the homepage categories are portfolio groupings. The H1, canonical URLs, `hreflang`, and sitemap remain unchanged.

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
| `--color-accent` | `#fad951` | Quote action, structural ticks, bullet markers, top rule |
| `--color-accent-strong` | `#f0c62f` | Yellow hover |
| `--color-surface-muted` | `#f4f6fb` | Alternate category bands |
| `--color-ink` | `#0b1220` | Primary text |
| `--color-ink-muted` | `#4a5568` | Secondary text |
| `--color-line` | `#d7dce7` | Hairlines on light surfaces |
| `--color-whatsapp` | `#25d366` | WhatsApp action only |
| `--color-whatsapp-strong` | `#1ebe5a` | WhatsApp hover |
| `--color-whatsapp-ink` | `#052e16` | Text/icon on WhatsApp green |

No new decorative hues. The only gradient is the hero scrim, which exists for legibility over the photograph.

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
  ▸ 20+ años   ▸ IBTB básica   ▸ Seguro RC
```

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

- One `h1`; each category is an `h2`; no heading for the credential rail or bullets.
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
