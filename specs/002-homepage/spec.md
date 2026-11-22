# 002 — Homepage

- Status: implemented — change request 2026-11-21 (new logo, RBET credential, category pictogram row, urgent-work copy) validated 2026-11-21 (VERIFICATION.md); owner visual review (R58) and en/fr wording PENDING
- Date: 2026-11-04, revised 2026-11-05, revised 2026-11-06, change request 2026-11-21
- Branch: `feat/002-homepage`
- Target branch: owner-managed; no fixed integration branch requirement
- Depends on: `001-project-foundation` (committed)
- Enables: homepage content for later service, contact, and quote work

## 1. Purpose

Redesign the homepage of **EA electricidad y multiservicios** around the local landscape and the company’s real work photography. The page opens with a short, transparent hero over a view of the Peñón de Calpe, then presents work in three dominant categories — **Iluminación**, **Electricidad**, and **Climatización** — each with a slideshow of real jobs and a short list of work types.

The `001` foundation stays intact: Astro static output, typed Spanish/English/French dictionaries, localized routes, SEO, accessibility, the five approved service categories, and the approved business facts. This specification does not add a backend, form, email, upload, analytics, or CMS.

The design direction remains **“Cuadro”**: brand-blue fields, safety yellow markers, thin rules, flat surfaces, and small radii. The 2026-11-05 revision adds a landscape hero and three work categories, and removes the old services panel and four-photo triptych from the homepage.

The 2026-11-21 change request introduces the new EA logo (in the hero, the site-wide header, and the favicons), replaces the credential wording with the owner-approved “Instalador autorizado de baja tensión (RBET)”, adds a row of category pictograms between the hero and the credential rail, and rewrites the urgent-work note and the contact-page lead. The header, favicon, and urgent-note changes are site-wide; everything else stays on the homepage.

## 2. Goals

- **G1 — Local identity:** Open with the new `hero.jpg` view of the Peñón de Calpe, placed behind a translucent copy panel.
- **G2 — Shorter hero:** Reduce the hero to roughly half its previous height without distorting the 4898×3265 photo; use responsive crops.
- **G3 — Three work categories:** Present Iluminación, Electricidad, and Climatización as the main body, each dominated by a single slideshow stage and a short bullet list.
- **G4 — Real work slideshows:** Read each category’s photos from its own folder (`/homepage/ilumination`, `/homepage/electricity`, `/homepage/climatization`) and rotate them with a slow right-to-left vanish/appear transition, without visible controls or a counter.
- **G5 — Two-up desktop stage:** Show two images at once on large screens and one on mobile.
- **G6 — Continuity:** Reuse the existing slide-reveal language, adapted to the alternating editorial bands; keep the compact closing/footer and green WhatsApp actions.
- **G7 — Quality floor:** Preserve responsive behavior, keyboard access, focus visibility, contrast, reduced-motion support, no-JavaScript access, localized metadata, and alternative text.
- **G8 — Honest content:** Use only confirmed business facts and real EA jobs. Keep per-photo descriptions PENDING; do not invent locations, dates, counts, or project details.
- **G9 — New brand mark (added 2026-11-21):** Show the new EA logo in the hero, the header, and the favicons, in a variant that stays visible on each surface.
- **G10 — Category overview (added 2026-11-21):** Let visitors see the three homepage work categories at a glance through simple pictograms, before the credential rail.
- **G11 — Accurate credential and urgent-work copy (added 2026-11-21):** Use the owner-approved RBET credential and urgent-work wording, never implying 24/7 availability.

## 3. Non-goals

- New routes, pages, navigation items, or a sixth work category.
- Replacing the canonical five service categories on `/services/`; the homepage categories are work/portfolio groupings.
- Quote form, backend, API, email delivery, uploads, database, authentication, CMS, analytics, cookies, or consent tooling.
- Redesign of the services, contact, legal, or 404 pages. Only shared CTA styles remain from the previous revision. (changed 2026-11-21) The site-wide header logo, favicons, and urgent-work note (R66, R67, R76), the social share image (R68), and the contact-page lead wording (R77) are the only changes those pages receive.
- (changed 2026-11-21) Redrawing the logo, recolouring it beyond the two approved variants, or vectorizing it; adding new photography beyond the supplied folders. Replacing the old logo with the new one is now in scope (R60–R69).
- Inventing reviews, ratings, project counts, dates, locations, certificates, registration numbers, insurance details, or coverage.
- (added 2026-11-21) Displaying any registration or authorization number next to the RBET credential.
- (added 2026-11-21) New service categories: the pictogram row shows only the three existing homepage work groupings.
- (added 2026-11-21) Agents editing `AGENTS.md`: the owner applies the approved business-fact changes there (DECISIONS D-2).
- (added 2026-11-21) Deleting `public/logo.jpg` or `public/logo2.jpeg`; deletion is the owner's decision.
- Per-photo captions, project names, or locations until the owner supplies them.
- Full-page scroll snapping, scroll hijacking, horizontal page scroll, or scroll-linked animation that blocks native scrolling.
- New fonts, icon packages, animation libraries, or client-side frameworks.
- Final legal or privacy copy; GDPR compliance claims.
- (changed 2026-11-21) Changes to canonical URLs, `hreflang`, the sitemap, robots policy, or structured data, measured against the build of the committed `5edbb07`; removing the uncommitted preview page restores that sitemap.

## 4. Users and stakeholders

- **Visitor:** Needs to recognise the local area, see credible work, and reach the business within seconds.
- **Mobile visitor:** Needs a short hero, one image at a time, swipe and tap-to-pause support, and no horizontal page overflow.
- **Business owner:** Needs to review the landscape crop, the three category layouts, and the slideshow images, and replace placeholder bullets later.
- **Developer or agent:** Needs a typed, testable implementation with no new dependencies and no regression to `001`.
- **Search engine:** Needs the existing localized metadata, canonical URLs, and language alternates to remain correct.

## 5. User stories

- **US1:** As a visitor, I see the Peñón de Calpe behind a translucent hero and understand what the company does and where it works.
- **US2:** As a visitor, I can scan Iluminación, Electricidad, and Climatización without a generic card grid.
- **US3:** As a visitor, I can view several real jobs in each category via a slideshow, with two images visible on a large screen.
- **US4:** As a mobile visitor, I can read the page without horizontal overflow and swipe the slideshow, tapping it to pause or resume.
- **US5:** As a visitor who prefers reduced motion or has JavaScript disabled, I can read all content and use every contact action; the slideshow does not auto-advance.
- **US6:** As a visitor, I can tap a green WhatsApp button with the WhatsApp mark or a call button with a telephone mark.
- **US7:** As the owner, I can add or remove photos in the category folders and replace the bullet copy later without redesigning the page.
- **US8:** As a developer, I can run the existing quality gates and know the homepage changes did not alter routing, SEO, or the five-category rule.
- **US9 (added 2026-11-21):** As a visitor, I recognise the new EA logo in the header, the hero, and the browser tab.
- **US10 (added 2026-11-21):** As a visitor, I see the three work categories as labelled pictograms right after the hero, in my language.
- **US11 (added 2026-11-21):** As a visitor with an urgent problem, I learn that urgent work without an appointment may carry a surcharge, without being told the business works around the clock.

## 6. Functional requirements

### 6.1 Design system

- **R1 (changed 2026-11-21):** THE SYSTEM SHALL keep the “Cuadro” direction: brand-blue fields, cool panel surfaces, thin rules, small yellow structural markers, flat surfaces, and no decorative gradients beyond the hero scrim. The yellow-to-orange gradient inside the logo belongs to the brand mark and does not count as a decorative gradient.
- **R2:** Keep the self-hosted Space Grotesk display face and Source Sans 3 body face. Do not add a font or icon package.
- **R3:** Use sentence-case labels. Do not add tracked-out all-caps eyebrows, monospace meta labels, or numbered category markers.
- **R4:** Use a left-aligned, 12-column layout with a maximum content width of approximately 1180px. Use small radii (2–4px) for panels and buttons, not pills.
- **R5 (changed 2026-11-21):** THE SYSTEM SHALL reserve safety yellow `#fad951` for the quote action, structural ticks, bullet markers, the closing top rule, and, if the plan chooses yellow, the category pictograms (R72). THE SYSTEM SHALL reserve green `#25d366` for WhatsApp actions only.
- **R6:** Do not accent a single word or phrase inside the H1 and do not use decorative numbering.

### 6.2 Hero

- **R7 (changed 2026-11-21):** THE SYSTEM SHALL render the homepage in this order: hero, category pictogram row, credential rail, three work categories, compact closing band, footer.
- **R8:** The hero uses `public/homepage/hero.jpg` (4898×3265, approximately 1.5:1) as a full-bleed background image. The photo is placed behind a translucent brand-blue scrim and a translucent copy panel; the landscape remains visible around and behind the copy.
- **R9 (changed 2026-11-21):** THE SYSTEM SHALL show in the hero the existing eyebrow, H1, lead, quote action, and services action, plus the decorative logo (R62–R64). The three approved facts sit in the thin credential rail directly below the category pictogram row.
- **R10 (changed 2026-11-21):** The hero is visibly shorter than the previous version: target about 26–28rem on desktop and about 31–33rem on mobile, approximately half the previous measured height. The photo uses `object-fit: cover` so its aspect ratio is never distorted. WHILE the viewport is at least 1024 CSS px wide, THE SYSTEM SHALL let the copy panel set the hero height, and the logo beside the panel SHALL NOT set or increase it: the hero height SHALL equal, within ±2 CSS px, the height of the same two-column layout at the same viewport width and locale with the logo image removed (DECISIONS D-29). The narrower panel produced by the R62 1.4 : 1 grid, and any extra hero height that narrower panel causes, are accepted: R62's ratio wins over the desktop height target. WHILE the viewport is narrower than 1024 CSS px, any growth caused by the logo is measured against the same hero at the same viewport width and locale rendered without the logo (DECISIONS D-12); IF the logo above the panel no longer fits within the mobile target, THEN THE SYSTEM SHALL let the hero grow by no more than the height of the logo's visible image (R61) plus the gap between that visible image and the panel (12–24 CSS px, R63; DECISIONS D-47, D-52), and SHALL NOT shrink the logo below the R63 sizes.
- **R11:** The hero copy panel is left-aligned, translucent, and marked with a yellow edge. On mobile, the copy occupies the lower portion of the image with a stronger scrim; no text sits on an unreadable part of the photo.
- **R12:** The hero photo uses responsive `object-position` values so the Peñón and coastline stay visible at 375, 768, and 1280. The photo loads eagerly with high fetch priority, explicit dimensions, and localized alternative text.
- **R13 (changed 2026-11-21):** THE SYSTEM SHALL show exactly three approved facts in the credential rail, in one compact row with small yellow markers: 20+ years, the authorization credential, and civil liability insurance. The credential text SHALL be exactly: es “Instalador autorizado de baja tensión (RBET)”; en “Authorised low-voltage installer (RBET)” (PENDING owner review); fr “Installateur autorisé basse tension (RBET)” (PENDING owner review). No registration number is shown.

### 6.3 Work categories

- **R14:** The main body is exactly three work categories, in this order: Iluminación, Electricidad, Climatización. They are portfolio groupings, not a replacement for the five service categories on `/services/`.
- **R15:** Each category is an editorial band with a category heading, a short lead, a dominant image stage, and a bullet list of work types. The image stage occupies about two-thirds of the width on desktop and dominates the section; the text column uses the remaining third.
- **R16:** The layout alternates: Iluminación has the stage left, Electricidad has the stage right, Climatización has the stage left again. On mobile, every category shows the stage first, then the text.
- **R17:** Each category shows exactly one image stage. On screens at `lg` and above, the stage shows two images side by side; below `lg`, it shows one image.
- **R18:** Category bullets are concise work types within the approved five service categories. Do not create a sixth service category, a project count, or a customer claim.
- **R19:** The three category headings and bullets are localized in Spanish, English, and French.
- **R20:** The image sources come from the supplied folders:
  - `/homepage/ilumination/` (6 images)
  - `/homepage/electricity/` (4 images)
  - `/homepage/climatization/` (5 images)
- **R21:** Each image has explicit width/height, `loading="lazy"`, `decoding="async"`, and localized alt text. Do not move, rename, or delete the source files.
- **R22:** A category with no images must not render an empty stage; it falls back to a clear neutral state or is treated as a build-time error. The supplied folders are not empty.

### 6.4 Slideshow

- **R23:** Each category stage is a horizontal slideshow with one visible image on mobile and two visible images on desktop. Programmatic advances move by one visible page — two images on desktop, one on mobile — so consecutive two-up pages never repeat a photo. Advances use a slow right-to-left vanish/appear handoff (about 1.1 seconds total) rather than an abrupt jump: the current page fades and drifts left, the track moves while invisible, and the next page fades in from the right. The Iluminación stage opens on `skyscraper1.jpg`; at `lg` it opens on `skyscraper1.jpg` and `skyscraper2.jpg`.
- **R24:** The slideshow has no visible control buttons and no visible image counter. It supports previous/next by native touch swipe, and Arrow Left, Arrow Right, Home, and End when the stage is focused; arrow paging moves by one visible page. The stage keeps a localized accessible label.
- **R25:** The slideshow auto-advances slowly (about 8 seconds) only while the stage is in view, the page is visible, and the user has not paused it. It pauses on hover and focus. Clicking or tapping the stage toggles pause, and Space or Enter toggles pause when the stage is focused, so a pause mechanism remains available without visible controls.
- **R26:** With `prefers-reduced-motion: reduce`, auto-advance is off by default and every advance is immediate, with no fade or drift. The user may still advance manually.
- **R27:** With JavaScript disabled, the first image(s) remain visible, the track remains manually scrollable, and no controls are shown because none exist.
- **R28:** There is no visible or announced image counter or live status. Alternative text still includes the photo position within the category.
- **R29:** The slideshow must not introduce horizontal page overflow. Its track is clipped inside the stage, and the page-level overflow tests must stay at zero.
- **R30:** The slideshow uses the supplied images directly; no new dependency or image-optimization pipeline is added. The next image is given a short decode window before the fade so the handoff does not show an empty frame.

### 6.5 Motion

- **R31:** Reuse the existing slide-reveal language: content enters once behind a clip mask with a small translate, using `IntersectionObserver`. Category stages slide in from the image side; category text and bullets enter upward with a short stagger. The reveal is deliberately slow and soft (about 1500ms for opacity/translate, 1800ms for the clip mask, with a gentle ease-in-out curve) rather than a quick fade.
- **R32:** Add one orchestrated hero load: the landscape fades and settles while the translucent copy panel slides in slightly. The H1 is visible immediately.
- **R33:** Do not hijack, snap, or lock native page scrolling. Do not add a horizontal page scroll. The only horizontal scroller is the slideshow track.
- **R34:** Respect `prefers-reduced-motion: reduce`: disable the hero load, reveals, transforms, clip paths, stagger, the slideshow fade handoff, and auto-advance. Content must be visible and static.
- **R35:** Keep all content visible and usable when JavaScript is disabled. Reveal styling may only activate after the script marks the document ready; if the observer is unavailable or errors, reveal everything.
- **R36:** The motion must not introduce layout shift, block interaction, or trap focus.

### 6.6 Calls to action, closing, and footer

- **R37:** Keep the WhatsApp button variant with a `#25d366` background, `#052e16` text and icon, and a darker green hover. Keep the telephone mark on call buttons.
- **R38:** Apply the WhatsApp and call styles on the homepage, services page, and contact page. Keep the header quote action unchanged.
- **R39:** Keep the light outline variant for secondary actions on blue surfaces.
- **R40:** Keep the compact closing band and the three-column footer from the previous revision: contact, hours, and service area, with the business name only in the copyright line.
- **R41:** Keep visible labels unchanged from the dictionaries; do not rely on an icon alone. Maintain at least a 44×44 CSS-pixel target and a visible focus indicator on green, yellow, blue, and white surfaces.

### 6.7 Content and localization

- **R42:** All new user-facing text comes from `es.ts`, `en.ts`, and `fr.ts`. No user-facing string is hardcoded in an Astro component.
- **R43 (changed 2026-11-21):** Add localized keys for the hero alt text, the three category titles, category leads, category bullets, category image alts, and the slideshow stage label. Remove keys that become unused, including the old `home.jobs.*`, `home.servicesHeading`, `home.servicesLead`, and the previous/next/pause/play/status slideshow labels. For the 2026-11-21 change, THE SYSTEM SHALL take the pictogram-row labels and any accessible name the row needs from the dictionaries, adding new keys only where existing text cannot be reused. It SHALL change the values of `home.facts.authorization`, `contact.hoursNote`, and `contact.lead` in all three locales (R13, R76, R77), SHALL add no text key for the decorative logos, and SHALL remove any key that becomes unused.
- **R44:** Keep exactly the five approved service categories in `services.items`. The three homepage categories are separate work groupings and must not add a sixth service.
- **R45:** Keep the existing H1 text in all three locales. Keep the existing homepage title, description, canonical URL, and language alternates unchanged.
- **R46 (changed 2026-11-21):** THE SYSTEM SHALL state hours only as Monday–Friday, 08:00–20:00. Urgent work without an appointment may be available and may carry a surcharge; the wording follows R76. THE SYSTEM SHALL NOT advertise or imply 24/7 or out-of-hours availability in any locale. THE SYSTEM SHALL list only Calpe, Altea, Benidorm, Benissa, and Teulada as the confirmed service area.
- **R47 (changed 2026-11-21):** THE SYSTEM SHALL use only the approved business facts: independent low-voltage installer, 20+ years, “Instalador autorizado de baja tensión (RBET)” (owner-approved 2026-11-21, replacing “IBTB basic”), the required authorization, and civil liability insurance. Do not add registration numbers, insurance details, certificates, reviews, ratings, project counts, or unconfirmed coverage.

### 6.8 SEO, accessibility, and performance

- **R48 (changed 2026-11-21):** Keep one `h1` per page and a logical heading order. Each category has an `h2`; the credential rail facts, the bullets, and the pictogram-row labels are not headings.
- **R49:** Meet WCAG 2.2 AA for contrast and focus. Verify the hero text over the scrim, the green WhatsApp button, the yellow call action, the slideshow stage label and focus ring, muted text, and footer links.
- **R50:** Provide meaningful alternative text, keyboard access, visible focus, reduced-motion support, and no-JavaScript access. Run axe on each locale with no serious or critical violations.
- **R51 (changed 2026-11-21):** Keep canonical URLs, `hreflang`, `x-default`, the sitemap, staging `noindex`, and robots behavior unchanged, where “unchanged” is measured against the build of the committed `5edbb07`. Add no structured data.
- **R52:** Do not add runtime dependencies. Keep the JavaScript limited to the reveal behavior and the slideshow handoff, pause, and keyboard paging.
- **R53:** Do not collect, log, or transmit personal data. No analytics, cookies, or third-party requests are introduced.
- **R54:** Reference the images from `public/homepage` directly. Do not move, rename, or delete them. The trade-off is no Astro image optimization; mitigate with lazy loading, explicit dimensions, a short hero, and a future WebP/srcset follow-up if performance requires it.

### 6.9 Quality and documentation

- **R55 (changed 2026-11-21):** Extend the existing translation parity tests to cover the new keys and the removed keys. Add homepage end-to-end coverage for the hero, credential rail, three categories, the fade handoff and pause behavior, the absence of visible controls and counter, no-JavaScript access, reduced motion, and responsive overflow. For the 2026-11-21 change:
  - Update the hero tests for the logo: the white variant beside the panel at ≥1024 px, the blue variant above it below 1024 px, exactly one visible, and decorative.
  - Add an end-to-end check that, at 1024 and 1280 CSS px in es, en, and fr, the hero height with and without the logo image differs by at most 2 CSS px (R10; DECISIONS D-41).
  - Update the credential-rail tests for the exact credential text.
  - Add end-to-end coverage for the pictogram row: placed between the hero and the rail, three items in the R70 order, localized labels, no overflow, no clipped labels, and, WHERE the items are links, keyboard activation, focus, target size, and destination.
  - Cover the urgent-note and contact-lead strings, the favicon references, the absence of the preview page, and the absence of “IBTB” in every locale.
  - Keep the axe audit in es, en, and fr.
- **R56 (changed 2026-11-21):** Run `pnpm validate` and `pnpm test:e2e`, including axe in es, en, and fr. Check the layout at 390, 768, 1024, and 1280 CSS px, keyboard focus, and reduced motion, and confirm that the build output contains no inline `<script>` or `<style>`. Record exactly which checks ran and which did not; for the 2026-11-21 change, record them in `specs/002-homepage/VERIFICATION.md` (earlier results stay in `tasks.md`).
- **R57 (changed 2026-11-21):** Update `MEMORY.md` after implementation and keep it at approximately 50 lines or fewer. The `AGENTS.md` changes (current-state block, credential fact, urgent-work rule, logo line) are delivered as exact before/after text for the owner to apply; agents do not edit `AGENTS.md` in this change (DECISIONS D-2).
- **R58 (changed 2026-11-21):** The owner performs the visual review of the hero crop, the category layouts, the two-up stage, and the slideshow motion. For the 2026-11-21 change, the owner also reviews the hero logo's size and placement at 390, 768, 1024, and 1280 CSS px, the white hero logo over bright parts of the photo at ≥1024 CSS px, any halo inside the logo display variants (R60), the header logo, the favicons, and the three pictograms (including whether they are simple and original, R72). The agent cannot preview images with the current model and must not claim visual approval on the owner’s behalf.
- **R59:** The owner owns Git history and deployment. Agents may use `feat/002-homepage` but must not add, commit, push, rebase, or reset unless explicitly asked. No CI, registry, or GitHub automation is added.

### 6.10 Brand logo and favicons (added 2026-11-21)

- **R60 (changed 2026-11-21):** THE SYSTEM SHALL publish exactly two display variants of the logo, made from the new logo source `public/logo2.jpeg`: a “blue” variant (navy `#002359` with the yellow-to-orange gradient) and a “white” variant (the same mark with the navy turned white, for dark surfaces). Each display variant SHALL be one PNG file with a transparent background: the four corner pixels and every pixel of the image's outermost 1-pixel frame SHALL have alpha 0. Each display variant MAY be resampled and palette-compressed (an indexed PNG of up to 256 colours with alpha); THE SYSTEM SHALL NOT clean, trim, or recolour the mark's edge, changes caused only by resizing and compression are allowed, and any halo is checked by the owner's review (R58; DECISIONS D-40, D-46). Each SHALL keep the aspect ratio of the approved cut-outs (833×746; DECISIONS D-30); a resized display variant keeps that ratio when its height in pixels equals round(width × 746 / 833) within ±1 px (DECISIONS D-38). Definition used throughout this spec: a logo mark is “undistorted” (“without distortion”; “distorted” is the opposite) when, for files (the display variants, and the mark inside the R67 icons and the R68 share image), its height in pixels equals round(width × 746 / 833) within ±1 px, and, for rendered logos, its height is within ±1 CSS px of width × 746 / 833, measured on the visible image (R61) (DECISIONS D-49, D-53). In the R67 icons and the R68 share image, “the mark” is the placed cut-out rectangle, not the visible artwork, and it is checked from the generation parameters: placed height = round(placed width × 746 / 833) within ±1 px (DECISIONS D-54). Each SHALL sit at a permanent public path whose file name identifies the variant (for example under `/brand/`), not under `/logo-preview/`. The R67 icons, derived from the blue variant, and, if the plan chooses, one share image made from the 833×746 blue cut-out (R68; DECISIONS D-31) are additional files; they are not display variants (DECISIONS D-14).
- **R61 (changed 2026-11-21):** THE SYSTEM SHALL size each display-variant file so its pixel dimensions are at least 2× and at most 2.5× the largest CSS size at which that variant is shown in es, en, or fr at any viewport width from 320 to 1440 CSS px. IF 2× that size exceeds the cut-out resolution (833×746), THEN THE SYSTEM SHALL make that variant's file exactly 833×746, still palette-compressed and smaller in bytes than its cut-out; THE SYSTEM SHALL NOT upscale any display variant beyond 833×746 (DECISIONS D-46, D-51). Each published display-variant file SHALL be smaller in bytes than the temporary cut-out it comes from. Baselines: `logo-transparent.png` (blue) 833×746, 151,058 bytes; `logo-white.svg` (white) 833×746, 150,503 bytes. The files are prepared once and stored as static assets; no build-time image pipeline and no new dependency are added. In R10, R61–R63, and acceptance criterion 20, a logo's size, the logo's rendered height (R10), and the gap between the logo and the copy panel (R63) are measured on the visible image (the rendered mark area after aspect-ratio fitting), not on the element box (DECISIONS D-35, D-52).
- **R62 (changed 2026-11-21):** WHILE the viewport is at least 1024 CSS px wide, THE SYSTEM SHALL show the white logo variant in the hero, to the right of the copy panel, in a two-column layout whose panel and logo column tracks split the width at about 1.4 : 1 (ratio measured on the grid column tracks: 1.3–1.5) with a gap of about 2.5rem (36–44 CSS px). The visible logo (R61) SHALL be as tall as the copy panel, within ±2 CSS px, unless it reaches its column width first, in which case it SHALL be as wide as its column and vertically centred against the panel; within a 2 CSS px tolerance it SHALL never be taller than the panel, wider than its column, distorted (R60), or outside the hero.
- **R63 (changed 2026-11-21):** WHILE the viewport is narrower than 1024 CSS px, THE SYSTEM SHALL show the blue logo variant in the hero, above the copy panel, left-aligned with the panel's left edge, and without distortion (R60), with the visible image (R61) 108–116 CSS px tall (about 112) below 640 CSS px, and 140–148 CSS px tall (about 144) from 640 to 1023 CSS px, and with a gap of 12–24 CSS px between the visible image (R61) and the copy panel (DECISIONS D-47, D-52). Exactly one hero logo SHALL be visible at any viewport width.
- **R64 (changed 2026-11-21):** THE SYSTEM SHALL treat both hero logos as decorative (empty text alternative, hidden from assistive technology), because the header already names the business. The logo SHALL enter together with the copy panel's existing hero entrance (R32) and add no new animation; WHILE `prefers-reduced-motion: reduce` is set it SHALL be static; WHILE JavaScript is disabled it SHALL be visible.
- **R65 (changed 2026-11-21):** THE SYSTEM SHALL build no page under `/es/logo-preview/`, `/en/logo-preview/`, or `/fr/logo-preview/`, list none in the sitemap, ship no file under `/logo-preview/`, give the hero a single logo treatment with no selectable alternatives, and reference the temporary preview assets nowhere. The temporary preview artifacts that SHALL be gone are the preview page, the `/logo-preview/` public assets, and the `docs/logo-preview/` screenshots. “Nowhere” covers the build output and the source tree (`src/`, `public/`, `tests/`, `docs/`); historical or educational mentions in `MEMORY.md`, `DECISIONS.md`, the specs, and the `docs/learning/` lessons are not references (DECISIONS D-32).
- **R66 (changed 2026-11-21):** THE SYSTEM SHALL show the blue logo variant in the header on every page in all three locales, replacing `/logo.jpg`, at 44 CSS px tall (as today) with its width taken from its aspect ratio, without distortion (R60), cropping, or rounded corners, and without changing the header height. It stays decorative: the visible business name next to it remains the home link's accessible name. The header SHALL cause no horizontal overflow at 320 CSS px; below 375 CSS px the business name may truncate as it can today; at 375 CSS px and wider it SHALL NOT truncate more than it does in the build of the committed `5edbb07`.
- **R67 (changed 2026-11-21):** THE SYSTEM SHALL provide two icons made from the blue logo variant, padded to a square without cropping or distortion of the placed cut-out rectangle (R60; DECISIONS D-54), each on an opaque white square background with no transparent pixels: a 32×32 PNG icon and a 180×180 apple-touch icon. Every page in all three locales SHALL reference both, and no page SHALL reference `/logo.jpg` as an icon.
- **R68 (changed 2026-11-21):** THE SYSTEM SHALL use, as the social share image on every page, only a file that exists in the build output. The plan decides, with its reasons, whether the share image stays `/logo.jpg` or switches to an asset made from the new logo. WHERE the plan switches it, THE SYSTEM SHALL make the share image from the 833×746 blue cut-out, before that cut-out is deleted, SHALL keep the mark (the placed cut-out rectangle) undistorted (R60; DECISIONS D-54), and SHALL NOT upscale the mark beyond its native size (833×746, the R61 cap); padding the mark on a larger canvas is allowed (DECISIONS D-31).
- **R69:** THE SYSTEM SHALL keep `public/logo.jpg` and `public/logo2.jpeg` in place in this change. WHEN the implementation is complete, its report SHALL list every remaining reference to `/logo.jpg`, or state that none remains, so the owner can decide whether to delete it.

### 6.11 Category pictogram row (added 2026-11-21)

- **R70 (changed 2026-11-21):** THE SYSTEM SHALL show a category pictogram row on the homepage in all three locales, as its own full-width band directly after the hero and before the credential rail, with exactly three items in this order: Electricidad, Iluminación, Climatización (the owner's order, which differs from the band order in R14; DECISIONS D-11). Each item SHALL be a pictogram plus a visible label whose text equals the matching category heading in that locale, in that order (es Electricidad / Iluminación / Climatización; en Electrical / Lighting / Climate control; fr Électricité / Éclairage / Climatisation).
- **R71:** THE SYSTEM SHALL present the row items only as the three homepage work groupings; the row SHALL NOT add, rename, or replace any of the five service categories (R44), and `/services/` and `services.items` stay unchanged.
- **R72 (changed 2026-11-21):** THE SYSTEM SHALL draw each pictogram as an original, simple, single-colour graphic made for this site, not taken from an icon library or third-party icon set; “simple” and “original” are checked by the owner's review (R58). All three SHALL use the same brand colour (white or safety yellow on brand blue, or colours matching the credential rail) with at least 3:1 contrast against the band background, and SHALL add no dependency, no external request, no `<script>` or `<style>` element, and no inline style attribute. Each pictogram SHALL be decorative (hidden from assistive technology); the label carries the meaning.
- **R73 (changed 2026-11-21):** THE SYSTEM SHALL render the row labels from the typed dictionaries, with at least 4.5:1 contrast, as a list of three items and not as headings (R48). At 320, 375, 390, 768, 1024, and 1280 CSS px in es, en, and fr, the row SHALL cause no horizontal overflow and no label SHALL be truncated, clipped, hidden, or broken mid-word (wrapping between words is allowed); at 200% zoom in a 1280 CSS px window it SHALL cause no horizontal scrolling and no clipped label. The plan decides whether the items stay three-across or stack on narrow phones.
- **R74 (changed 2026-11-21):** THE SYSTEM SHALL show the row in full without JavaScript and add no JavaScript for it. WHERE the row is animated, THE SYSTEM SHALL use the existing reveal language (R31), and WHILE `prefers-reduced-motion: reduce` is set it SHALL be static and visible. The row may use only the reveal markers already in use on the site, with no new reveal CSS and no new direction value (DECISIONS D-37); that is not new JavaScript (R52).
- **R75 (changed 2026-11-21):** The plan decides whether the items link to their categories. WHERE they are links, THE SYSTEM SHALL make each point to the start of its category section on the same page (not to the category heading; DECISIONS D-39, which replaces the target part of D-34), reachable with Tab and activated with Enter, with a visible focus indicator on the row's surface (R41, R49) and a target of at least 44×44 CSS px; after activation the top edge of the matching category section SHALL be inside the viewport and not covered by the sticky header, checked at 390×844 and 1280×800 CSS px; WHILE `prefers-reduced-motion: reduce` is set the jump SHALL not animate. WHERE they are not links, THE SYSTEM SHALL make them non-focusable, with no link or button role.

### 6.12 Credential and urgent-work copy (added 2026-11-21)

- **R76 (changed 2026-11-21):** WHERE the opening hours are shown (the footer on every page and the contact page), THE SYSTEM SHALL show under them the urgent-work note: es “Las urgencias sin cita previa pueden tener un recargo.”; en “Urgent work without an appointment may carry a surcharge.” (PENDING owner review); fr “Les urgences sans rendez-vous peuvent entraîner un supplément.” (PENDING owner review). The note SHALL mention no hours, days, or times and SHALL NOT state or imply work outside Monday–Friday 08:00–20:00, around the clock, or 24/7.
- **R77 (changed 2026-11-21):** THE SYSTEM SHALL use exactly this contact-page lead: es “Puede contactar por teléfono, WhatsApp o correo electrónico.”; en “You can contact us by phone, WhatsApp or email.” (PENDING owner review); fr “Vous pouvez nous contacter par téléphone, WhatsApp ou e-mail.” (PENDING owner review). It SHALL no longer tell visitors to call during opening hours for urgent work.
- **R78:** THE SYSTEM SHALL NOT contain “IBTB” in any user-facing copy, page metadata, or structured data in any locale, and SHALL show no registration or authorization number.

## 7. Acceptance criteria

1. (changed 2026-11-21) `specs/002-homepage/spec.md`, `plan.md`, and `tasks.md` exist, agree with each other, and record the 2026-11-21 change request.
2. The hero uses `hero.jpg` behind a translucent blue scrim and copy panel, with the Peñón visible at 375, 768, and 1280, and no distortion.
3. The hero is approximately half its previous height and contains the eyebrow, H1, lead, quote action, and services action; the three facts sit in a compact rail below.
4. The main body presents exactly three categories in order: Iluminación, Electricidad, Climatización, each with a dominant image stage and a short bullet list.
5. On desktop, each stage shows two images side by side; on mobile, one image; the layout alternates sides.
6. The Iluminación stage opens on `skyscraper1.jpg` at mobile width and on `skyscraper1.jpg` plus `skyscraper2.jpg` at desktop width.
7. Each stage auto-advances with a slow right-to-left vanish/appear handoff, moving by one visible page so consecutive two-up pages never repeat a photo; there are no visible control buttons or counter; touch swipe, keyboard paging, and click/Space pause still work.
8. The slideshow auto-advances only in view and on page visible, pauses on hover/focus, and is off by default under reduced motion, with immediate advances.
9. With JavaScript disabled, all category content is visible, the first image(s) remain, the track scrolls, and no controls appear.
10. The page has no horizontal overflow at 320, 375, 768, 1024, and 1280 CSS pixels in all three locales.
11. The five approved service categories remain on `/services/`; the homepage does not add a sixth service category.
12. All new copy exists in Spanish, English, and French; translation parity tests pass; no user-facing string is hardcoded.
13. The existing H1, localized metadata, canonical URLs, `hreflang`, sitemap, robots policy, and five-category rule remain correct.
14. The homepage passes axe with no serious or critical violations, works by keyboard, has visible focus, and keeps the green/yellow CTA contrast.
15. No backend, form, email, upload, analytics, cookie, CMS, new route, new service category, or new runtime dependency is introduced.
16. (changed 2026-11-21) `pnpm validate` and `pnpm test:e2e` pass; the production build succeeds; the results and any blocked checks are recorded in `tasks.md` for the earlier revisions and in `specs/002-homepage/VERIFICATION.md` for the 2026-11-21 change.
17. The owner has reviewed the hero crop, the category layouts, the opening slides, the slower reveals, and the slideshow motion, or the remaining visual review is explicitly marked PENDING.
18. (changed 2026-11-21) `MEMORY.md` reflects the revised homepage state, the real-photo provenance, and the remaining per-photo description gaps; the exact `AGENTS.md` before/after text for the RBET credential, the urgent-work rule, the logo, and the current state has been delivered to the owner, who applies it.
19. (added 2026-11-21) Exactly two transparent-background PNG logo display variants (blue, white) sit at permanent, clearly named paths, each with alpha 0 at the four corners and on every pixel of its outermost 1-pixel frame (the mark's edge not cleaned, trimmed, or recoloured; only changes caused by resizing and palette compression, up to 256 colours with alpha; any halo checked by the owner, R58), each keeps the 833:746 ratio (height = round(width × 746/833) ± 1 px, R60), each 2–2.5× its largest rendered size (IF 2× exceeds 833×746, THEN the file is exactly 833×746; never upscaled, R61) and smaller than its cut-out (151,058 and 150,503 bytes); the only other files derived from the new logo are the R67 icons, from the blue variant, and, if the plan chooses, one share image from the 833×746 blue cut-out with the mark at no more than its native size; the build has no `/logo-preview/` file and no logo-preview page in any locale or the sitemap.
20. (added 2026-11-21) At 1024 and 1280 CSS px the white logo sits right of the copy panel in a layout whose column tracks split at a ratio of 1.3–1.5 : 1 with a 36–44 CSS px gap (R62), as tall as the panel (±2 CSS px) or as wide as its column, with no overflow; at 390 and 768 CSS px the blue logo sits above the panel at 108–116 and 140–148 CSS px tall respectively (R63); all logo sizes are measured on the visible image, not the element box (R61); exactly one hero logo is visible, hidden from assistive technology, entering with the panel, static under reduced motion; at 1024 and 1280 CSS px in es, en, and fr the hero height with and without the logo image differs by at most 2 CSS px.
21. (added 2026-11-21) The header shows the undistorted (R60) blue logo with unchanged header height; every page in es/en/fr references a 32×32 PNG icon and a 180×180 apple-touch icon from the blue logo; the share image resolves to a file in the build output; `public/logo.jpg` is still present and its remaining references are reported.
22. (added 2026-11-21) The credential rail shows exactly “Instalador autorizado de baja tensión (RBET)” in es and the R13 proposals in en/fr; no built page in any locale contains “IBTB” or a registration number.
23. (added 2026-11-21) The pictogram row sits between the hero and the credential rail with three items in the R70 order (Electricidad, Iluminación, Climatización), labels equal to the category headings, original single-colour decorative pictograms, no icon dependency, no inline script or style, and no overflow or clipped/broken label at 320/375/390/768/1024/1280 CSS px in es/en/fr; WHERE the items are links, the keyboard, focus, 44×44 target, and destination checks pass.
24. (added 2026-11-21) The urgent note (footer and contact page) and the contact lead show the R76/R77 strings in all three locales; the note mentions no hours, and no page implies 24/7 or out-of-hours availability.
25. (added 2026-11-21) `pnpm validate` and `pnpm test:e2e` pass, including axe in es/en/fr, the updated hero/credential tests, and the new pictogram-row test; layout at 390/768/1024/1280, keyboard focus, and reduced motion are checked; the build output has no inline `<script>`/`<style>`; what ran and what did not is recorded in `specs/002-homepage/VERIFICATION.md`.
26. (added 2026-11-21) The owner has reviewed the logo sizing and placement, the header logo, the favicons, and the pictograms, or that review is explicitly marked PENDING.

## 8. Edge cases and failure handling

- **Landscape crop:** A short, wide hero crops the 1.5:1 photo vertically. Use `object-cover` with a responsive `object-position`; do not stretch the photo. Ask the owner to confirm the Peñón stays visible.
- **Mobile crop:** At 375px, a full-height hero crops the landscape sides. Use a stronger lower scrim and a focal position that keeps the crag; if the crop is unusable, prefer a slightly taller mobile hero over letterboxing.
- **Hero legibility:** The photo may contain bright sky or water. Keep the scrim and copy panel opaque enough for AA contrast; verify white text over the darkest and lightest plausible areas.
- **Mixed category image ratios:** The folders contain portrait and landscape photos. Use one aspect ratio per stage with `object-cover`; do not let one image change the row height. Tune `object-position` only after owner review.
- **Odd image count:** Climatización has 5 images. The desktop two-up stage ends on a lone fifth image at the start edge; the track adds trailing space so it can be reached without repeating the fourth image. The empty right half is expected until a sixth photo is supplied.
- **Few images:** Electricity has 4 images. The two-up stage shows two pairs; paging wraps cleanly at the ends.
- **Repeated photos:** On the two-up stage, each automatic or keyboard advance moves a full page of two images. A manual swipe can settle between pages; the next advance skips any page that would repeat a currently visible photo.
- **No images:** If a folder is empty, do not render an empty stage. Treat it as a build-time error or show a neutral message; do not invent photos.
- **Slideshow motion:** Auto-advance can distract or violate pause expectations. Keep the handoff slow and smooth, pause on hover/focus, stop off-screen, disable auto-advance under reduced motion, and keep click/tap plus Space/Enter as a pause mechanism even though no control is visible.
- **Fade handoff:** The track fades out before it jumps, so a short empty stage is possible. Keep the stage geometry stable, wait briefly for the next image to decode, and keep the total handoff near 1.1 seconds. Under reduced motion, skip the effect entirely.
- **JavaScript disabled:** The track is a native scroller. There are no controls to hide, and all slides remain in the document.
- **Horizontal overflow:** The track must be clipped by the stage. Verify document overflow stays zero at 320/375/768/1280 in all locales. The small fade drift must stay inside the category padding.
- **Long translations:** French and English labels may be longer than Spanish. Allow wrapping in the text column and stage label; do not clip text.
- **Hero performance:** `hero.jpg` is about 2 MB and 4898px wide. Load it eagerly with high priority; keep category images lazy. If performance is insufficient, propose resized/WebP variants as a follow-up rather than silently replacing the source.
- **Five-category rule:** Do not present Iluminación, Electricidad, or Climatización as a replacement for the five service categories. Keep the canonical list on `/services/` and link to it.
- **Existing tests:** The foundation E2E suite asserts the exact H1 text. Keep the H1 unchanged. Update the homepage tests for the new category structure.
- **Owner visual review unavailable:** Generate screenshots, but mark crop/layout approval as PENDING.
- **Logo breakpoint (added 2026-11-21):** at exactly 1024 CSS px the two-column layout with the white logo applies; at 1023 the blue logo sits above the panel; exactly one logo is visible either way.
- **Logo limited by column width (added 2026-11-21):** at 1024 CSS px the logo may be shorter than the panel; it then fills the column width, stays within the panel's height, and is never stretched or cropped.
- **Very tall panel (added 2026-11-21, changed 2026-11-21):** fr/en copy, and the narrower panel produced by the R62 1.4 : 1 grid, can make the panel taller at narrow desktop widths; that extra hero height is accepted (R10; DECISIONS D-29). The panel sets the hero height; the logo follows it, capped by its column, never sets or increases the hero height (±2 CSS px against the same layout with the logo image removed), and never leaves the hero.
- **Logo variant vs surface (added 2026-11-21, changed 2026-11-21):** the tested placement rule is only R62, R63, and R66: the white variant on the hero at ≥1024 CSS px, the blue variant above the panel below 1024 CSS px and in the header. The blue logo's navy is close to brand blue `#00208f`, so whether it stays distinguishable over the photo and the scrim below 1024 CSS px is a note for the owner's visual review (R58), not a testable constraint (DECISIONS D-15). The logos are decorative, so WCAG contrast does not apply.
- **Photo not loaded (added 2026-11-21):** before the hero photo loads, or if it fails to load, the blue logo below 1024 CSS px may sit on near-solid brand blue and be hard to see. This is acceptable: the logo is decorative and the header names the business (DECISIONS D-20).
- **White logo over bright photo areas (added 2026-11-21):** at ≥1024 CSS px the white logo may overlap bright sky or water in the photo; the owner reviews this visually (R58); there is no automated threshold (DECISIONS D-21).
- **Logo vs Peñón visibility (added 2026-11-21):** the Peñón must still stay visible at 375 and 768 CSS px (R12). IF the logo sizes (R63) clash with that, THEN the logo sizes win, the hero may grow within the R10 cap, and the crop goes to the owner's review (R58; DECISIONS D-19).
- **Mobile hero height (added 2026-11-21):** the logo may push the mobile hero past ~33rem; R10 caps the growth at the height of the logo's visible image plus the 12–24 CSS px gap between that visible image and the panel (R61, R63; DECISIONS D-47, D-52); measure at 375 and 390 CSS px and record it.
- **Reduced motion (added 2026-11-21):** the logo and the row are static; WHERE row items are links, the jump is instant.
- **JavaScript disabled (added 2026-11-21):** the logo and the row are visible; WHERE items are links, native in-page navigation works.
- **High zoom (added 2026-11-21):** at 200% zoom a 1280 CSS px window behaves like 640 CSS px; the below-1024 logo layout applies and nothing scrolls horizontally.
- **Long row labels (added 2026-11-21):** “Climatización”, “Climate control”, “Climatisation”, and “Électricité” may not fit three-across at 320 CSS px (~90 CSS px per item); the plan chooses stacking or sizing; labels are never truncated or broken mid-word.
- **Linked row and reveals (added 2026-11-21, changed 2026-11-21):** WHERE items are links, the destination section may still be pre-reveal on arrival; it must reveal, and its top edge must not sit under the sticky header (R75; DECISIONS D-39).
- **Small favicons (added 2026-11-21, changed 2026-11-21):** the wide mark loses detail at 32 px, and dark browser tabs or platforms that show apple-touch transparency on black would hide the navy mark; both icons therefore use an opaque white square background with no transparency (R67; DECISIONS D-23); the owner reviews both icons.
- **Share image (added 2026-11-21, changed 2026-11-21):** IF it stays `/logo.jpg`, THEN link previews keep the old logo; acceptable only when the plan records that decision. IF it switches, THEN it is made from the 833×746 blue cut-out before that cut-out is deleted, with the mark never upscaled beyond its native size; a larger canvas with padding is allowed (R68; DECISIONS D-31).
- **Pending translations (added 2026-11-21, changed 2026-11-21):** the en/fr proposals for the credential (R13), the urgent-work note (R76), and the contact lead (R77) ship until the owner reviews them; “ship” means present in the build and the commit, while deployment remains the owner's act after review (DECISIONS D-25). A later correction is a copy-only change.

## 9. Assumptions

- The `001` foundation is complete and the `feat/002-homepage` branch exists.
- The owner supplied `hero.jpg` (4898×3265) and the three category folders with real EA job photos.
- The owner intends the three categories as work/portfolio groupings; the five service categories remain canonical on `/services/`.
- The owner approved slide reveals, the green WhatsApp action, and the compact closing/footer in the previous revision.
- The existing H1 text and homepage metadata stay unchanged.
- No new fonts, icon packages, animation libraries, or client-side frameworks are needed.
- The owner handles Git history and deployment.
- The agent has no image-preview capability. Visual acceptance of crops and layouts is an owner review.
- (changed 2026-11-21) The five service categories, hours, service area, and business facts in `AGENTS.md` remain authoritative, except that on 2026-11-21 the owner approved two new facts: the credential “Instalador autorizado de baja tensión (RBET)” (replacing “IBTB basic category”) and “urgent work without an appointment may be available and may carry a surcharge” (still never 24/7). These supersede the matching `AGENTS.md` wording, which is PENDING the owner's own edit (DECISIONS D-2).
- (added 2026-11-21) Constitution v1.0 (owner-approved 2026-11-20) governs this change although `docs/constitution.md` is not yet written (DECISIONS D-3).
- (added 2026-11-21, changed 2026-11-21) The pictogram row follows the owner's order (Electricidad, Iluminación, Climatización), which differs from the band order in R14 (DECISIONS D-11).
- (added 2026-11-21) The pictogram-row labels are the existing localized category headings.
- (added 2026-11-21) The two background-free PNG cut-outs from the 2026-11-21 experiment are the approved logo artwork.
- (added 2026-11-21) The pictogram row is its own band, not part of the hero (DECISIONS D-6).
- (added 2026-11-21) Where the owner's logo sizes conflict with the earlier mobile hero-height target, the logo sizes win (R10).

## 10. PENDING decisions and inputs

- **Per-photo descriptions and alt text:** The owner should provide one line per category image or accept the neutral category descriptions. Until then, neutral localized alt text is used.
- **Visible photo captions:** Not added until the owner supplies verified descriptions. Do not invent locations, dates, or project names.
- **Bullet copy:** The category bullets are approved work-type descriptions; the owner may refine them later.
- **Visual approval:** Owner review of the hero crop, the alternating category layouts, the two-up desktop stage, the slower reveals, and the slideshow fade handoff.
- **Image optimization:** Resized/WebP variants are a possible follow-up if the 2 MB hero or category images fail a performance target.
- **Commit/deploy:** The owner commits and deploys; the agent does not.
- **en/fr wording (added 2026-11-21, changed 2026-11-21):** The en/fr proposals for the credential (R13), the urgent-work note (R76), and the contact lead (R77) await owner review; this is regulatory and commercial-terms wording, so no unreviewed machine translation.
- **Logo vectorization (added 2026-11-21):** Ask the client for the original vector file first; the PNG variants are used until then.
- **Old JPEG logo (added 2026-11-21):** Deleting `public/logo.jpg` once nothing references it is the owner's decision.
- **Logo source location (added 2026-11-21):** Whether `public/logo2.jpeg` stays in `public/` (and so ships in the build) is the owner's decision; it stays in place in this change (R69).
- **Logo and pictogram review (added 2026-11-21):** Owner visual review of the hero and header logo sizing, the favicons, and the pictograms.
- **AGENTS.md facts (added 2026-11-21):** The owner applies the RBET credential, urgent-work rule, and logo changes to `AGENTS.md` (DECISIONS D-2).
- **Out-of-hours urgent work (added 2026-11-21):** The owner confirms whether EA does urgent work outside Monday–Friday 08:00–20:00. Until then R46 and R76 stay conservative: no out-of-hours availability is stated or implied (DECISIONS D-10, D-33).

## 11. Definition of done

The homepage is complete when all acceptance criteria are satisfied, the landscape hero is short and legible with the Peñón visible, the three categories dominate the body with working two-up slideshows and the slow fade handoff, the no-visible-controls choice remains pausable and keyboard accessible, the reveals and reduced-motion/no-JavaScript paths work, the WhatsApp/call actions and compact closing/footer remain consistent, `pnpm validate` and `pnpm test:e2e` pass, the owner has reviewed the crops and motion, and `MEMORY.md` plus `AGENTS.md` record the actual state and remaining PENDING inputs. (changed 2026-11-21) For the 2026-11-21 change request, R60–R78 and acceptance criteria 19–26 are also met, and the `AGENTS.md` update is the owner's edit (R57).

## 12. Change log

- 2026-11-04 — Created (homepage redesign on the `001` foundation).
- 2026-11-05 — Revised: landscape hero over `hero.jpg`, credential rail, three work categories with slideshows; services panel and four-photo triptych removed.
- 2026-11-06 — Revised: slower reveals, right-to-left fade handoff, no visible slideshow controls or counter, page-sized advances, fixed Iluminación opening pair, odd Climatización tail. Implemented.
- 2026-11-21 — Change request (owner-approved; DECISIONS D-1–D-8): new logo (blue and white variants) in the hero, header, and favicons; credential changed to “Instalador autorizado de baja tensión (RBET)”; category pictogram row between the hero and the credential rail; urgent-work note and contact lead rewritten; temporary logo-preview artifacts removed. Changed: R1, R5, R7, R9, R10, R13, R43, R46, R47, R48, R55, R56, R57, R58; acceptance criteria 1 and 18; non-goals; §9; §11. Added: R60–R78, acceptance criteria 19–26, G9–G11, US9–US11, edge cases, assumptions, PENDING items. Status set back to draft.
  - Clarification round 1 answers applied (DECISIONS D-10–D-28). Changed: R10, R51, R55, R56, R58, R60–R67, R70, R72–R74, R76, R77; acceptance criteria 16, 19, 23, 25; the §3 non-goals on other pages and on SEO/sitemap; §8 edge cases (logo variant vs surface, small favicons, pending translations; added photo not loaded, white logo over bright areas, logo vs Peñón); the §9 row-order assumption; §10 en/fr wording and logo source location.
  - Clarification round 2 answers applied (DECISIONS D-29–D-37). Changed: R10 (≥1024 baseline is the same layout with the logo image removed; R62 ratio wins), R58 (halo review), R60 (cut-out aspect ratio, alpha bounding-box rule, share-image source), R61 (sizes on the visible image, across es/en/fr), R62, R63, R65 (`docs/learning/` exempt), R68 (share image from the blue cut-out), R74 (only existing reveal markers), R75 (targets the category heading; 390×844 and 1280×800 checks); acceptance criteria 19 and 20; §8 very tall panel and share image; §10 out-of-hours urgent work added.
  - Clarification round 3 answers applied (DECISIONS D-38–D-41). Changed: R55 (hero-height test with and without the logo image at 1024 and 1280 CSS px in es/en/fr), R60 (±1 px rounding tolerance for the cut-out ratio; outermost 1-pixel frame transparency rule replaces the alpha ≥ 64 bounding-box rule), R75 (targets the start of the category section; its top edge is checked); acceptance criteria 19 (frame transparency rule) and 20 (hero-height check); §8 linked row and reveals. Status stays draft.
  - Clarification round 4 answers applied (DECISIONS D-46–D-49). Changed: R10 (mobile growth cap uses the 12–24 CSS px logo-to-panel gap), R60 (resampling and palette compression allowed; the mark's edge is not cleaned, trimmed, or recoloured; definition of “without distortion”), R61 (the 833×746 source cap wins over the 2× minimum; never upscaled), R62, R63 (12–24 CSS px gap below 1024 CSS px), R66, R67, R68 (point to the R60 definition); acceptance criteria 19 (edge rule, ratio tolerance, source cap), 20 (R62/R63 ranges replace approximate values), and 21 (R60 definition). Status stays draft.
  - Clarification round 5 answers applied (DECISIONS D-51–D-54). Changed: R10 (growth cap uses the logo's visible-image height and the gap from that visible image), R60 (file ratio test is height = round(width × 746/833) ± 1 px; rendered test is ±1 CSS px of width × 746/833; in the icons and share image “the mark” is the placed cut-out rectangle, checked from the generation parameters), R61 (IF 2× exceeds 833×746, THEN the file is exactly 833×746; measurement clause covers the R10 height and the R63 gap), R63 (gap measured from the visible image), R67, R68 (the mark is the placed cut-out rectangle); acceptance criterion 19 (exact 833×746 cap); §8 mobile hero height. Status stays draft.
- 2026-11-21 — Spec approved 2026-11-21 (delegated approval, DECISIONS G-1). Status set to approved.
- 2026-11-21 — Tasks file renamed to `tasks.md` (owner, DECISIONS D-58); naming only.
- 2026-11-21 — Change request implemented and validated (VERIFICATION.md, DECISIONS G-4).
