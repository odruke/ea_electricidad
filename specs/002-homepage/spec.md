# 002 — Homepage

- Status: Implemented — revised 2026-11-06; owner visual review and commit PENDING
- Date: 2026-11-04, revised 2026-11-05, revised 2026-11-06
- Branch: `feat/002-homepage`
- Target branch: owner-managed; no fixed integration branch requirement
- Depends on: `001-project-foundation` (committed)
- Enables: homepage content for later service, contact, and quote work

## 1. Purpose

Redesign the homepage of **EA electricidad y multiservicios** around the local landscape and the company’s real work photography. The page opens with a short, transparent hero over a view of the Peñón de Calpe, then presents work in three dominant categories — **Iluminación**, **Electricidad**, and **Climatización** — each with a slideshow of real jobs and a short list of work types.

The `001` foundation stays intact: Astro static output, typed Spanish/English/French dictionaries, localized routes, SEO, accessibility, the five approved service categories, and the approved business facts. This specification does not add a backend, form, email, upload, analytics, or CMS.

The design direction remains **“Cuadro”**: brand-blue fields, safety yellow markers, thin rules, flat surfaces, and small radii. The 2026-11-05 revision adds a landscape hero and three work categories, and removes the old services panel and four-photo triptych from the homepage.

## 2. Goals

- **G1 — Local identity:** Open with the new `hero.jpg` view of the Peñón de Calpe, placed behind a translucent copy panel.
- **G2 — Shorter hero:** Reduce the hero to roughly half its previous height without distorting the 4898×3265 photo; use responsive crops.
- **G3 — Three work categories:** Present Iluminación, Electricidad, and Climatización as the main body, each dominated by a single slideshow stage and a short bullet list.
- **G4 — Real work slideshows:** Read each category’s photos from its own folder (`/homepage/ilumination`, `/homepage/electricity`, `/homepage/climatization`) and rotate them with a slow right-to-left vanish/appear transition, without visible controls or a counter.
- **G5 — Two-up desktop stage:** Show two images at once on large screens and one on mobile.
- **G6 — Continuity:** Reuse the existing slide-reveal language, adapted to the alternating editorial bands; keep the compact closing/footer and green WhatsApp actions.
- **G7 — Quality floor:** Preserve responsive behavior, keyboard access, focus visibility, contrast, reduced-motion support, no-JavaScript access, localized metadata, and alternative text.
- **G8 — Honest content:** Use only confirmed business facts and real EA jobs. Keep per-photo descriptions PENDING; do not invent locations, dates, counts, or project details.

## 3. Non-goals

- New routes, pages, navigation items, or a sixth work category.
- Replacing the canonical five service categories on `/services/`; the homepage categories are work/portfolio groupings.
- Quote form, backend, API, email delivery, uploads, database, authentication, CMS, analytics, cookies, or consent tooling.
- Redesign of the services, contact, legal, or 404 pages. Only shared CTA styles remain from the previous revision.
- Replacing `public/logo.jpg` or adding new photography beyond the supplied folders.
- Inventing reviews, ratings, project counts, dates, locations, certificates, registration numbers, insurance details, or coverage.
- Per-photo captions, project names, or locations until the owner supplies them.
- Full-page scroll snapping, scroll hijacking, horizontal page scroll, or scroll-linked animation that blocks native scrolling.
- New fonts, icon packages, animation libraries, or client-side frameworks.
- Final legal or privacy copy; GDPR compliance claims.
- Changes to canonical URLs, `hreflang`, the sitemap, robots policy, or structured data.

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

## 6. Functional requirements

### 6.1 Design system

- **R1:** Keep the “Cuadro” direction: brand-blue fields, cool panel surfaces, thin rules, small yellow structural markers, flat surfaces, and no decorative gradients beyond the hero scrim.
- **R2:** Keep the self-hosted Space Grotesk display face and Source Sans 3 body face. Do not add a font or icon package.
- **R3:** Use sentence-case labels. Do not add tracked-out all-caps eyebrows, monospace meta labels, or numbered category markers.
- **R4:** Use a left-aligned, 12-column layout with a maximum content width of approximately 1180px. Use small radii (2–4px) for panels and buttons, not pills.
- **R5:** Reserve safety yellow `#fad951` for the quote action, structural ticks, bullet markers, and the closing top rule. Reserve green `#25d366` for WhatsApp actions only.
- **R6:** Do not accent a single word or phrase inside the H1 and do not use decorative numbering.

### 6.2 Hero

- **R7:** The homepage order is: hero, credential rail, three work categories, compact closing band, footer.
- **R8:** The hero uses `public/homepage/hero.jpg` (4898×3265, approximately 1.5:1) as a full-bleed background image. The photo is placed behind a translucent brand-blue scrim and a translucent copy panel; the landscape remains visible around and behind the copy.
- **R9:** The hero contains the existing eyebrow, H1, lead, quote action, and services action. The three approved facts move to a thin credential rail immediately below the hero.
- **R10:** The hero is visibly shorter than the previous version: target about 26–28rem on desktop and about 31–33rem on mobile, approximately half the previous measured height. The photo uses `object-fit: cover` so its aspect ratio is never distorted.
- **R11:** The hero copy panel is left-aligned, translucent, and marked with a yellow edge. On mobile, the copy occupies the lower portion of the image with a stronger scrim; no text sits on an unreadable part of the photo.
- **R12:** The hero photo uses responsive `object-position` values so the Peñón and coastline stay visible at 375, 768, and 1280. The photo loads eagerly with high fetch priority, explicit dimensions, and localized alternative text.
- **R13:** The credential rail shows the three approved facts (20+ years, IBTB basic, civil liability insurance) in one compact row, using small yellow markers.

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
- **R43:** Add localized keys for the hero alt text, the three category titles, category leads, category bullets, category image alts, and the slideshow stage label. Remove keys that become unused, including the old `home.jobs.*`, `home.servicesHeading`, `home.servicesLead`, and the previous/next/pause/play/status slideshow labels.
- **R44:** Keep exactly the five approved service categories in `services.items`. The three homepage categories are separate work groupings and must not add a sixth service.
- **R45:** Keep the existing H1 text in all three locales. Keep the existing homepage title, description, canonical URL, and language alternates unchanged.
- **R46:** State hours only as Monday–Friday, 08:00–20:00. Urgent work stays within those hours and may carry a surcharge. Never advertise 24/7 availability. List only Calpe, Altea, Benidorm, Benissa, and Teulada as the confirmed service area.
- **R47:** Use only the approved business facts: independent low-voltage installer, 20+ years, IBTB basic, required authorization, and civil liability insurance. Do not add registration numbers, insurance details, certificates, reviews, ratings, project counts, or unconfirmed coverage.

### 6.8 SEO, accessibility, and performance

- **R48:** Keep one `h1` per page and a logical heading order. Each category has an `h2`; the credential rail facts and bullets are not headings.
- **R49:** Meet WCAG 2.2 AA for contrast and focus. Verify the hero text over the scrim, the green WhatsApp button, the yellow call action, the slideshow stage label and focus ring, muted text, and footer links.
- **R50:** Provide meaningful alternative text, keyboard access, visible focus, reduced-motion support, and no-JavaScript access. Run axe on each locale with no serious or critical violations.
- **R51:** Keep canonical URLs, `hreflang`, `x-default`, the sitemap, staging `noindex`, and robots behavior unchanged. Add no structured data.
- **R52:** Do not add runtime dependencies. Keep the JavaScript limited to the reveal behavior and the slideshow handoff, pause, and keyboard paging.
- **R53:** Do not collect, log, or transmit personal data. No analytics, cookies, or third-party requests are introduced.
- **R54:** Reference the images from `public/homepage` directly. Do not move, rename, or delete them. The trade-off is no Astro image optimization; mitigate with lazy loading, explicit dimensions, a short hero, and a future WebP/srcset follow-up if performance requires it.

### 6.9 Quality and documentation

- **R55:** Extend the existing translation parity tests to cover the new keys and the removed keys. Add homepage end-to-end coverage for the hero, credential rail, three categories, the fade handoff and pause behavior, the absence of visible controls and counter, no-JavaScript access, reduced motion, and responsive overflow.
- **R56:** Run `pnpm validate` and `pnpm test:e2e`. Record exactly which checks ran and which did not.
- **R57:** Update `MEMORY.md` and the current-state block in `AGENTS.md` after implementation. Keep `MEMORY.md` at approximately 50 lines or fewer.
- **R58:** The owner performs the visual review of the hero crop, the category layouts, the two-up stage, and the slideshow motion. The agent cannot preview images with the current model and must not claim visual approval on the owner’s behalf.
- **R59:** The owner owns Git history and deployment. Agents may use `feat/002-homepage` but must not add, commit, push, rebase, or reset unless explicitly asked. No CI, registry, or GitHub automation is added.

## 7. Acceptance criteria

1. `specs/002-homepage/spec.md`, `plan.md`, and `task.md` exist, agree with each other, and record the 2026-11-06 revision.
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
16. `pnpm validate` and `pnpm test:e2e` pass; the production build succeeds; the results and any blocked checks are recorded in `task.md`.
17. The owner has reviewed the hero crop, the category layouts, the opening slides, the slower reveals, and the slideshow motion, or the remaining visual review is explicitly marked PENDING.
18. `MEMORY.md` and `AGENTS.md` reflect the revised homepage state, the real-photo provenance, and the remaining per-photo description gaps.

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

## 9. Assumptions

- The `001` foundation is complete and the `feat/002-homepage` branch exists.
- The owner supplied `hero.jpg` (4898×3265) and the three category folders with real EA job photos.
- The owner intends the three categories as work/portfolio groupings; the five service categories remain canonical on `/services/`.
- The owner approved slide reveals, the green WhatsApp action, and the compact closing/footer in the previous revision.
- The existing H1 text and homepage metadata stay unchanged.
- No new fonts, icon packages, animation libraries, or client-side frameworks are needed.
- The owner handles Git history and deployment.
- The agent has no image-preview capability. Visual acceptance of crops and layouts is an owner review.
- The five service categories, hours, service area, and business facts in `AGENTS.md` remain authoritative.

## 10. PENDING decisions and inputs

- **Per-photo descriptions and alt text:** The owner should provide one line per category image or accept the neutral category descriptions. Until then, neutral localized alt text is used.
- **Visible photo captions:** Not added until the owner supplies verified descriptions. Do not invent locations, dates, or project names.
- **Bullet copy:** The category bullets are approved work-type descriptions; the owner may refine them later.
- **Visual approval:** Owner review of the hero crop, the alternating category layouts, the two-up desktop stage, the slower reveals, and the slideshow fade handoff.
- **Image optimization:** Resized/WebP variants are a possible follow-up if the 2 MB hero or category images fail a performance target.
- **Commit/deploy:** The owner commits and deploys; the agent does not.

## 11. Definition of done

The homepage is complete when all acceptance criteria are satisfied, the landscape hero is short and legible with the Peñón visible, the three categories dominate the body with working two-up slideshows and the slow fade handoff, the no-visible-controls choice remains pausable and keyboard accessible, the reveals and reduced-motion/no-JavaScript paths work, the WhatsApp/call actions and compact closing/footer remain consistent, `pnpm validate` and `pnpm test:e2e` pass, the owner has reviewed the crops and motion, and `MEMORY.md` plus `AGENTS.md` record the actual state and remaining PENDING inputs.
