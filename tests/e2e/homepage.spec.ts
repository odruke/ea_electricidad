import { expect, test, type Browser, type Page } from '@playwright/test';
import { brandAssets, isUndistortedRender } from '../../src/config/brand';
import { waitForFonts, waitForMotion } from '../support/motion';
import { containRect, type Box } from '../support/visible-image';

const locales = ['es', 'en', 'fr'] as const;
const fallbackBaseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4321';

type Locale = (typeof locales)[number];

const copy: Record<
  Locale,
  {
    authorization: string;
    categories: readonly [string, string, string];
    slideshowTotal: readonly [number, number, number];
    removedTagline: string;
  }
> = {
  es: {
    authorization: 'Instalador autorizado de baja tensión (RBET)',
    categories: ['Iluminación', 'Electricidad', 'Climatización'],
    slideshowTotal: [6, 4, 5],
    removedTagline: 'Instalaciones eléctricas y multiservicios en Calpe.',
  },
  en: {
    authorization: 'Authorised low-voltage installer (RBET)',
    categories: ['Lighting', 'Electrical', 'Climate control'],
    slideshowTotal: [6, 4, 5],
    removedTagline: 'Electrical installations and multi-service work in Calpe.',
  },
  fr: {
    authorization: 'Installateur autorisé basse tension (RBET)',
    categories: ['Éclairage', 'Électricité', 'Climatisation'],
    slideshowTotal: [6, 4, 5],
    removedTagline: 'Installations électriques et multiservices à Calpe.',
  },
};

const slideNames = ['ilumination', 'electricity', 'climatization'] as const;
const folders = ['ilumination', 'electricity', 'climatization'] as const;

const removedSlideshowUi = [
  '[data-slideshow-controls]',
  '[data-slideshow-toggle]',
  '[data-slideshow-counter]',
  '[data-slideshow-status]',
  '.work-slideshow-bar',
] as const;

async function startClassRecording(page: Page, category = 'ilumination'): Promise<void> {
  await page.evaluate((name) => {
    const track = document.querySelector<HTMLElement>(
      `[data-testid="slideshow-${name}"] [data-slideshow-track]`,
    );

    if (!track) {
      throw new Error(`Missing slideshow track for ${name}`);
    }

    const recorded: Array<{ current: string; previous: string }> = [];
    Object.assign(window, { __slideshowClasses: recorded });

    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        recorded.push({ current: track.className, previous: mutation.oldValue ?? '' });
      }
    }).observe(track, { attributes: true, attributeFilter: ['class'], attributeOldValue: true });
  }, category);
}

async function recordedClasses(page: Page): Promise<Array<{ current: string; previous: string }>> {
  return page.evaluate(
    () =>
      (window as unknown as { __slideshowClasses?: Array<{ current: string; previous: string }> })
        .__slideshowClasses ?? [],
  );
}

async function trackScrollLeft(page: Page, category = 'ilumination'): Promise<number> {
  return page.evaluate((name) => {
    const track = document.querySelector<HTMLElement>(
      `[data-testid="slideshow-${name}"] [data-slideshow-track]`,
    );

    return track?.scrollLeft ?? -1;
  }, category);
}

async function openWithJavaScriptDisabled(browser: Browser, path: string) {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: fallbackBaseURL,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  await page.goto(path);
  return { context, page };
}

async function visibleSlideCount(page: Page, category = 'ilumination'): Promise<number> {
  return page.evaluate((name) => {
    const track = document.querySelector<HTMLElement>(
      `[data-testid="slideshow-${name}"] [data-slideshow-track]`,
    );

    if (!track) {
      return 0;
    }

    const slides = Array.from(track.querySelectorAll<HTMLElement>('[data-slideshow-slide]'));

    if (slides.length < 2) {
      return slides.length;
    }

    const step = slides[1].offsetLeft - slides[0].offsetLeft;
    return step > 0 ? Math.max(1, Math.round(track.clientWidth / step)) : 1;
  }, category);
}

async function visibleSlideSources(page: Page, category = 'ilumination'): Promise<string[]> {
  return page.evaluate((name) => {
    const track = document.querySelector<HTMLElement>(
      `[data-testid="slideshow-${name}"] [data-slideshow-track]`,
    );

    if (!track) {
      return [];
    }

    const slides = Array.from(track.querySelectorAll<HTMLElement>('[data-slideshow-slide]'));

    if (slides.length < 2) {
      return slides.map((slide) => slide.querySelector('img')?.getAttribute('src') ?? '');
    }

    const step = slides[1].offsetLeft - slides[0].offsetLeft;

    if (step <= 0) {
      return [];
    }

    const visible = Math.max(1, Math.round(track.clientWidth / step));
    const index = Math.min(Math.max(Math.round(track.scrollLeft / step), 0), slides.length - 1);

    return slides
      .slice(index, index + visible)
      .map((slide) => slide.querySelector('img')?.getAttribute('src') ?? '');
  }, category);
}

test.describe('homepage hero', () => {
  for (const locale of locales) {
    test(`renders the landscape hero and credential rail in ${locale}`, async ({ page }) => {
      const response = await page.goto(`/${locale}/`);

      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);

      const hero = page.locator('img[src="/homepage/hero.jpg"]');
      await expect(hero).toHaveAttribute('loading', 'eager');
      await expect(hero).toHaveAttribute('fetchpriority', 'high');
      await expect(hero).toHaveAttribute('width', '4898');
      await expect(hero).toHaveAttribute('height', '3265');
      expect((await hero.getAttribute('alt'))?.trim()).not.toBe('');

      await expect(page.locator('[data-testid="hero"] .hero-scrim')).toHaveCount(1);
      await expect(page.locator('[data-testid="credential-rail"] > li')).toHaveCount(3);

      for (const fact of await page.locator('[data-testid="credential-rail"] > li').all()) {
        expect((await fact.innerText()).trim()).not.toBe('');
      }

      await expect(page.locator('[data-testid="credential-rail"] > li').nth(1)).toHaveText(
        copy[locale].authorization,
      );
      await expect(page.locator('[data-testid="credential-rail"]')).not.toContainText('IBTB');
    });
  }

  test('keeps the hero noticeably shorter than a full-screen band at 1280', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/en/');

    const box = await page.locator('[data-testid="hero"]').boundingBox();
    expect(box).not.toBeNull();
    expect(box?.height ?? 0).toBeGreaterThan(400);
    expect(box?.height ?? 0).toBeLessThanOrEqual(540);
  });
});

test.describe('homepage hero logo', () => {
  const widths = [320, 375, 390, 639, 640, 768, 1023, 1024, 1280, 1440] as const;

  for (const width of widths) {
    test(`shows exactly one hero logo at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/es/');
      await waitForFonts(page);
      await waitForMotion(page);

      const compact = page.locator('[data-testid="hero-logo-compact"] img');
      const wide = page.locator('[data-testid="hero-logo"] img');
      await expect(compact).toHaveCount(1);
      await expect(wide).toHaveCount(1);

      const visible = [(await compact.isVisible()) ? 1 : 0, (await wide.isVisible()) ? 1 : 0];
      expect(visible[0] + visible[1]).toBe(1);

      if (width < 1024) {
        await expect(compact).toBeVisible();
        await expect(compact).toHaveAttribute('src', '/brand/logo-blue.svg');
      } else {
        await expect(wide).toBeVisible();
        await expect(wide).toHaveAttribute('src', '/brand/logo-white.svg');
      }
    });
  }

  test('hides both hero logos from assistive technology', async ({ page }) => {
    await page.goto('/es/');

    for (const testId of ['hero-logo-compact', 'hero-logo']) {
      const wrapper = page.locator(`[data-testid="${testId}"]`);
      await expect(wrapper).toHaveAttribute('aria-hidden', 'true');
      await expect(wrapper.locator('img')).toHaveAttribute('alt', '');
      await expect(wrapper.locator('img')).toHaveAttribute('loading', 'eager');
    }
  });

  test('enters the logos with the same animation as the copy panel', async ({ page }) => {
    await page.goto('/es/');

    const names = await page.evaluate(() => {
      const name = (testId: string) => {
        const element = document.querySelector(`[data-testid="${testId}"]`);
        return element ? getComputedStyle(element).animationName : null;
      };

      return {
        panel: name('hero-panel'),
        compact: name('hero-logo-compact'),
        wide: name('hero-logo'),
      };
    });

    expect(names.panel).not.toBeNull();
    expect(names.panel).not.toBe('none');
    expect(names.compact).toBe(names.panel);
    expect(names.wide).toBe(names.panel);
  });

  test('does not animate the logos with reduced motion', async ({ browser }) => {
    const context = await browser.newContext({
      reducedMotion: 'reduce',
      baseURL: fallbackBaseURL,
    });
    const page = await context.newPage();
    await page.goto('/es/');

    for (const testId of ['hero-panel', 'hero-logo-compact', 'hero-logo']) {
      await expect(page.locator(`[data-testid="${testId}"]`)).toHaveCSS('animation-name', 'none');
    }

    await context.close();
  });

  test('places the credential rail after the hero, outside it', async ({ page }) => {
    await page.goto('/es/');

    const placement = await page.evaluate(() => {
      const hero = document.querySelector('[data-testid="hero"]');
      const rail = document.querySelector('[data-testid="credential-rail"]');

      if (!hero || !rail) {
        return null;
      }

      return {
        inside: hero.contains(rail),
        // The category pictogram row (T3007) sits between the hero and the rail.
        next: hero.nextElementSibling?.nextElementSibling?.contains(rail) ?? false,
        heroBottom: hero.getBoundingClientRect().bottom,
        railTop: rail.getBoundingClientRect().top,
      };
    });

    expect(placement).not.toBeNull();
    expect(placement?.inside).toBe(false);
    expect(placement?.next).toBe(true);
    expect(placement?.railTop ?? 0).toBeGreaterThanOrEqual((placement?.heroBottom ?? 0) - 1);
  });
});

interface HeroMeasure {
  hero: Box;
  panel: Box;
  grid: { template: string; columnGap: number };
  compact: Box | null;
  compactNatural: { width: number; height: number } | null;
  wide: Box | null;
  wideNatural: { width: number; height: number } | null;
}

async function openHero(page: Page, locale: Locale, width: number): Promise<void> {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`/${locale}/`);
  await waitForFonts(page);
  await page.evaluate(async () => {
    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>(
        '[data-testid="hero-logo-compact"] img, [data-testid="hero-logo"] img',
      ),
    );
    await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
  });
  await waitForMotion(page);
}

async function measureHero(page: Page): Promise<HeroMeasure> {
  return page.evaluate(() => {
    const box = (element: Element | null) => {
      if (!element) {
        return null;
      }

      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    };
    const image = (testId: string) => {
      const element = document.querySelector<HTMLImageElement>(`[data-testid="${testId}"] img`);

      if (!element || element.getBoundingClientRect().width === 0) {
        return { box: null, natural: null };
      }

      return {
        box: box(element),
        natural: { width: element.naturalWidth, height: element.naturalHeight },
      };
    };
    const grid = document.querySelector('[data-testid="hero-grid"]');
    const gridStyle = grid ? getComputedStyle(grid) : null;
    const compact = image('hero-logo-compact');
    const wide = image('hero-logo');

    return {
      hero: box(document.querySelector('[data-testid="hero"]')) as Box,
      panel: box(document.querySelector('[data-testid="hero-panel"]')) as Box,
      grid: {
        template: gridStyle?.gridTemplateColumns ?? '',
        columnGap: Number.parseFloat(gridStyle?.columnGap ?? '0'),
      },
      compact: compact.box,
      compactNatural: compact.natural,
      wide: wide.box,
      wideNatural: wide.natural,
    };
  });
}

function visibleOf(measure: HeroMeasure, which: 'compact' | 'wide'): Box {
  const box = measure[which];
  const natural = which === 'compact' ? measure.compactNatural : measure.wideNatural;

  if (!box || !natural) {
    throw new Error(`The ${which} hero logo is not rendered`);
  }

  expect(natural.width).toBeGreaterThan(0);

  return containRect(box, natural);
}

async function twoFrames(page: Page): Promise<void> {
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve(undefined))),
      ),
  );
}

test.describe('homepage hero geometry', () => {
  const compactHeights: ReadonlyArray<readonly [number, number, number]> = [
    [320, 108, 116],
    [375, 108, 116],
    [390, 108, 116],
    [639, 108, 116],
    [640, 140, 148],
    [768, 140, 148],
    [1023, 140, 148],
  ];

  for (const [width, min, max] of compactHeights) {
    test(`sizes the compact logo and places it above the panel at ${width}`, async ({ page }) => {
      await openHero(page, 'es', width);

      const measure = await measureHero(page);
      const visible = visibleOf(measure, 'compact');
      const gap = measure.panel.y - (visible.y + visible.height);

      expect(visible.height).toBeGreaterThanOrEqual(min);
      expect(visible.height).toBeLessThanOrEqual(max);
      expect(gap).toBeGreaterThanOrEqual(12);
      expect(gap).toBeLessThanOrEqual(24);
      expect(Math.abs(visible.x - measure.panel.x)).toBeLessThanOrEqual(1);
      expect(isUndistortedRender(visible.width, visible.height)).toBe(true);
    });
  }

  for (const width of [1024, 1280, 1440]) {
    test(`fits the white logo to the panel row at ${width}`, async ({ page }) => {
      await openHero(page, 'es', width);

      const measure = await measureHero(page);
      const visible = visibleOf(measure, 'wide');
      const column = measure.wide as Box;
      const tracks = measure.grid.template.split(' ').map((track) => Number.parseFloat(track));

      expect(tracks).toHaveLength(2);
      expect(tracks[0] / tracks[1]).toBeGreaterThanOrEqual(1.3);
      expect(tracks[0] / tracks[1]).toBeLessThanOrEqual(1.5);
      expect(measure.grid.columnGap).toBeGreaterThanOrEqual(36);
      expect(measure.grid.columnGap).toBeLessThanOrEqual(44);

      const panelCentre = measure.panel.y + measure.panel.height / 2;
      const visibleCentre = visible.y + visible.height / 2;
      const fillsHeight = Math.abs(visible.height - measure.panel.height) <= 2;
      const fillsWidth =
        Math.abs(visible.width - column.width) <= 2 && Math.abs(visibleCentre - panelCentre) <= 2;

      expect(fillsHeight || fillsWidth).toBe(true);
      expect(visible.height).toBeLessThanOrEqual(measure.panel.height + 2);
      expect(visible.width).toBeLessThanOrEqual(column.width + 2);
      expect(visible.x).toBeGreaterThanOrEqual(measure.hero.x - 2);
      expect(visible.x + visible.width).toBeLessThanOrEqual(
        measure.hero.x + measure.hero.width + 2,
      );
      expect(visible.y).toBeGreaterThanOrEqual(measure.hero.y - 2);
      expect(visible.y + visible.height).toBeLessThanOrEqual(
        measure.hero.y + measure.hero.height + 2,
      );
      expect(isUndistortedRender(visible.width, visible.height)).toBe(true);
    });
  }

  for (const locale of locales) {
    for (const width of [1024, 1280]) {
      test(`does not let the white logo change the hero height at ${width} in ${locale}`, async ({
        page,
      }) => {
        await openHero(page, locale, width);

        const before = (await measureHero(page)).hero.height;
        await page.evaluate(() => {
          document.querySelector('[data-testid="hero-logo"] img')?.remove();
        });
        await twoFrames(page);
        const after = (await measureHero(page)).hero.height;

        expect(Math.abs(before - after)).toBeLessThanOrEqual(2);
      });
    }
  }

  for (const width of [375, 390, 768]) {
    test(`caps the hero growth from the compact logo at ${width}`, async ({ page }, testInfo) => {
      await openHero(page, 'es', width);

      const withLogo = await measureHero(page);
      const visible = visibleOf(withLogo, 'compact');
      const gap = withLogo.panel.y - (visible.y + visible.height);

      await page.evaluate(() => {
        document.querySelector('[data-testid="hero-logo-compact"]')?.remove();
      });
      await twoFrames(page);
      const without = await measureHero(page);
      const growth = withLogo.hero.height - without.hero.height;

      const line = `hero growth at ${width}: with=${withLogo.hero.height} without=${without.hero.height} growth=${growth} logo=${visible.height} gap=${gap}`;
      console.log(line);
      testInfo.annotations.push({ type: 'measurement', description: line });

      expect(growth).toBeLessThanOrEqual(visible.height + gap + 1);
    });
  }

  for (const locale of locales) {
    test(`keeps the white and blue files at their display cap in ${locale}`, async ({
      page,
    }, testInfo) => {
      let widest = { width: 0, height: 0 };

      for (const width of [1024, 1280, 1440]) {
        await openHero(page, locale, width);
        const visible = visibleOf(await measureHero(page), 'wide');

        if (visible.width > widest.width) {
          widest = { width: visible.width, height: visible.height };
        }
      }

      const white = brandAssets.logoWhite;
      const whiteLine = `largest visible white logo in ${locale}: ${widest.width.toFixed(1)}x${widest.height.toFixed(1)}`;
      console.log(whiteLine);
      testInfo.annotations.push({ type: 'measurement', description: whiteLine });

      expect(2 * widest.width).toBeGreaterThan(white.width);
      expect(2 * widest.height).toBeGreaterThan(white.height);

      let blue = { width: 0, height: 0 };

      for (const width of [320, 375, 390, 639, 640, 768, 1023]) {
        await openHero(page, locale, width);
        const visible = visibleOf(await measureHero(page), 'compact');

        if (visible.width > blue.width) {
          blue = { width: visible.width, height: visible.height };
        }
      }

      // R61: the 44 px header logo is a visible blue logo too (T3008).
      await openHero(page, locale, 1280);
      const headerLogo = await page.evaluate(() => {
        const image = document.querySelector('header img') as HTMLImageElement;
        const rect = image.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      });
      expect(Math.abs(headerLogo.height - 44)).toBeLessThanOrEqual(0.5);

      if (headerLogo.width > blue.width) {
        blue = headerLogo;
      }

      const file = brandAssets.logoBlue;
      const blueLine = `largest visible blue hero logo in ${locale}: ${blue.width.toFixed(1)}x${blue.height.toFixed(1)}`;
      console.log(blueLine);
      testInfo.annotations.push({ type: 'measurement', description: blueLine });

      expect(file.width / blue.width).toBeGreaterThanOrEqual(2);
      expect(file.width / blue.width).toBeLessThanOrEqual(2.5);
      expect(file.height / blue.height).toBeGreaterThanOrEqual(2);
      expect(file.height / blue.height).toBeLessThanOrEqual(2.5);
    });
  }
});

test.describe('homepage work categories', () => {
  for (const locale of locales) {
    test(`renders three work categories with slideshows in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/`);

      const sections = page.locator('[data-testid="work-category"]');
      await expect(sections).toHaveCount(3);

      for (const [index, name] of slideNames.entries()) {
        const category = copy[locale].categories[index];
        const total = copy[locale].slideshowTotal[index];
        const section = sections.nth(index);

        await expect(section).toHaveAttribute('data-category', name);
        await expect(section.getByRole('heading', { level: 2, name: category })).toBeVisible();

        const slideshow = section.locator(`[data-testid="slideshow-${name}"]`);
        await expect(slideshow).toHaveCount(1);
        await expect(section.locator(`[data-testid="bullets-${name}"] > li`)).toHaveCount(4);

        const images = slideshow.locator('[data-slideshow-slide] img');
        await expect(images).toHaveCount(total);

        for (let slide = 0; slide < total; slide += 1) {
          const image = images.nth(slide);

          await expect(image).toHaveAttribute('loading', 'lazy');
          await expect(image).toHaveAttribute('decoding', 'async');
          expect((await image.getAttribute('alt'))?.trim()).not.toBe('');
          expect(await image.getAttribute('src')).toContain(`/homepage/${folders[index]}/`);
        }
      }
    });
  }

  test('shows two slides at 1280 and one at 375', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/en/');
    await expect.poll(() => visibleSlideCount(page)).toBe(2);

    await page.setViewportSize({ width: 375, height: 812 });
    await expect.poll(() => visibleSlideCount(page)).toBe(1);
  });
});

test.describe('homepage slideshow', () => {
  for (const locale of locales) {
    test(`shows no visible controls or counter in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/`);

      for (const name of slideNames) {
        const slideshow = page.locator(`[data-testid="slideshow-${name}"]`);
        await expect(slideshow).toHaveCount(1);

        for (const selector of removedSlideshowUi) {
          await expect(slideshow.locator(selector)).toHaveCount(0);
        }

        const track = slideshow.locator('[data-slideshow-track]');
        const label = await track.getAttribute('aria-label');
        expect(label?.trim()).not.toBe('');
        expect(label?.toLowerCase()).toContain('paus');
      }
    });
  }

  test('advances with a right-to-left fade handoff on the keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/en/');

    const slideshow = page.locator('[data-testid="slideshow-ilumination"]');
    await slideshow.scrollIntoViewIfNeeded();
    await startClassRecording(page);

    const before = await trackScrollLeft(page);
    const track = slideshow.locator('[data-slideshow-track]');
    await track.focus();
    await page.keyboard.press('ArrowRight');

    await expect.poll(() => trackScrollLeft(page), { timeout: 4000 }).toBeGreaterThan(before);

    await expect
      .poll(
        async () =>
          (await recordedClasses(page)).some((entry) => entry.current.includes('is-leaving')),
        {
          timeout: 4000,
        },
      )
      .toBe(true);
    await expect
      .poll(
        async () =>
          (await recordedClasses(page)).some((entry) => entry.previous.includes('is-entering')),
        { timeout: 4000 },
      )
      .toBe(true);
  });

  test('toggles pause without visible controls on click and Space', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/en/');

    const slideshow = page.locator('[data-testid="slideshow-ilumination"]');
    await slideshow.scrollIntoViewIfNeeded();

    const track = slideshow.locator('[data-slideshow-track]');

    await track.click({ position: { x: 12, y: 12 } });
    await expect(slideshow).toHaveAttribute('data-paused', 'true');

    await track.click({ position: { x: 12, y: 12 } });
    await expect(slideshow).toHaveAttribute('data-paused', 'false');

    await track.focus();
    await page.keyboard.press('Space');
    await expect(slideshow).toHaveAttribute('data-paused', 'true');

    await page.keyboard.press('Space');
    await expect(slideshow).toHaveAttribute('data-paused', 'false');
  });

  test('opens on skyscraper1 and skyscraper2 at desktop, skyscraper1 at mobile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/en/');

    const slideshow = page.locator('[data-testid="slideshow-ilumination"]');
    await slideshow.scrollIntoViewIfNeeded();

    await expect
      .poll(() => visibleSlideSources(page))
      .toEqual(['/homepage/ilumination/skyscraper1.jpg', '/homepage/ilumination/skyscraper2.jpg']);

    await page.setViewportSize({ width: 375, height: 812 });

    await expect
      .poll(() => visibleSlideSources(page))
      .toEqual(['/homepage/ilumination/skyscraper1.jpg']);
  });

  test('advances a full desktop page so consecutive pairs never repeat', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/en/');

    const slideshow = page.locator('[data-testid="slideshow-ilumination"]');
    await slideshow.scrollIntoViewIfNeeded();

    const track = slideshow.locator('[data-slideshow-track]');
    await track.focus();

    const firstPage = await visibleSlideSources(page);
    expect(firstPage).toHaveLength(2);

    const expectNextPage = async (previous: string[]) => {
      await expect
        .poll(
          async () => {
            const current = await visibleSlideSources(page);
            return current.length === 2 && current.every((src) => !previous.includes(src));
          },
          { timeout: 5000 },
        )
        .toBe(true);

      return visibleSlideSources(page);
    };

    await page.keyboard.press('ArrowRight');
    const secondPage = await expectNextPage(firstPage);
    expect(secondPage.some((src) => src.includes('skyscraper'))).toBe(false);

    await page.keyboard.press('ArrowRight');
    const thirdPage = await expectNextPage(secondPage);
    expect(thirdPage).toEqual([
      '/homepage/ilumination/skyscraper3.jpg',
      '/homepage/ilumination/skyscraper4.jpg',
    ]);
  });

  test('shows the lone final Climatización slide without repeating a photo', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/en/');

    const slideshow = page.locator('[data-testid="slideshow-climatization"]');
    await slideshow.scrollIntoViewIfNeeded();

    const track = slideshow.locator('[data-slideshow-track]');
    await track.focus();

    const firstPage = await visibleSlideSources(page, 'climatization');
    expect(firstPage).toHaveLength(2);

    await page.keyboard.press('ArrowRight');
    await expect
      .poll(
        async () => {
          const current = await visibleSlideSources(page, 'climatization');
          return current.length === 2 && current.every((src) => !firstPage.includes(src));
        },
        { timeout: 5000 },
      )
      .toBe(true);

    await page.keyboard.press('ArrowRight');
    await expect
      .poll(async () => (await visibleSlideSources(page, 'climatization')).length, {
        timeout: 5000,
      })
      .toBe(1);

    expect(await visibleSlideSources(page, 'climatization')).toEqual([
      '/homepage/climatization/IMG-20261101-WA0084.jpg',
    ]);

    const position = await page.evaluate(() => {
      const element = document.querySelector<HTMLElement>(
        '[data-testid="slideshow-climatization"] [data-slideshow-track]',
      );

      if (!element) {
        return -1;
      }

      const slides = Array.from(element.querySelectorAll<HTMLElement>('[data-slideshow-slide]'));
      const step = slides[1].offsetLeft - slides[0].offsetLeft;
      return element.scrollLeft / step;
    });

    // The lone final slide sits at the start edge, with a matching trailing gap.
    expect(position).toBeGreaterThan(3.85);
    expect(position).toBeLessThan(4.05);
  });
});

test.describe('homepage motion', () => {
  test('reveals content on scroll without hijacking the page', async ({ page }) => {
    await page.goto('/es/');

    const stage = page.locator('[data-testid="work-category"] [data-reveal="left"]').first();
    await stage.scrollIntoViewIfNeeded();
    await expect(stage).toHaveClass(/is-visible/);

    const transitionDuration = await stage.evaluate(
      (element) => getComputedStyle(element).transitionDuration,
    );
    expect(transitionDuration).toContain('1.5s');
    expect(transitionDuration).toContain('1.8s');

    await expect(stage).toHaveClass(/is-revealed/, { timeout: 3500 });

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);

    const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
    expect(bodyOverflow).not.toBe('hidden');
  });

  test('shows all content immediately with reduced motion and starts paused', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      reducedMotion: 'reduce',
      baseURL: fallbackBaseURL,
    });
    const page = await context.newPage();
    await page.goto('/es/');

    const hasJsClass = await page.evaluate(() => document.documentElement.classList.contains('js'));
    expect(hasJsClass).toBe(false);

    const stage = page.locator('[data-testid="work-category"] [data-reveal="left"]').first();
    const style = await stage.evaluate((element) => {
      const computed = getComputedStyle(element);
      return { opacity: computed.opacity, clipPath: computed.clipPath };
    });

    expect(style.opacity).toBe('1');
    expect(style.clipPath === 'none' || style.clipPath === 'inset(0px)').toBe(true);

    const slideshow = page.locator('[data-testid="slideshow-ilumination"]');
    await expect(slideshow).toHaveAttribute('data-paused', 'true');

    const track = slideshow.locator('[data-slideshow-track]');
    const transitionDuration = await track.evaluate(
      (element) => getComputedStyle(element).transitionDuration,
    );
    expect(transitionDuration.split(',').every((value) => value.trim() === '0s')).toBe(true);

    const before = await trackScrollLeft(page);
    await track.focus();
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => trackScrollLeft(page)).toBeGreaterThan(before);
    await expect(slideshow).toHaveAttribute('data-paused', 'true');

    await context.close();
  });
});

test.describe('homepage without JavaScript', () => {
  test('keeps the hero, categories, slides, and contact actions usable', async ({ browser }) => {
    const { context, page } = await openWithJavaScriptDisabled(browser, '/es/');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('[data-testid="hero-logo-compact"] img')).toBeVisible();
    await expect(page.locator('[data-testid="hero-logo"] img')).toBeHidden();
    await expect(page.locator('[data-testid="credential-rail"] > li')).toHaveCount(3);
    await expect(page.locator('[data-testid="work-category"]')).toHaveCount(3);
    await expect(page.locator('[data-testid="bullets-ilumination"] > li')).toHaveCount(4);
    await expect(page.locator('[data-testid="bullets-electricity"] > li')).toHaveCount(4);
    await expect(page.locator('[data-testid="bullets-climatization"] > li')).toHaveCount(4);
    await expect(
      page.locator('[data-testid="slideshow-ilumination"] [data-slideshow-slide] img'),
    ).toHaveCount(6);
    await expect(
      page.locator('[data-testid="slideshow-electricity"] [data-slideshow-slide] img'),
    ).toHaveCount(4);
    await expect(
      page.locator('[data-testid="slideshow-climatization"] [data-slideshow-slide] img'),
    ).toHaveCount(5);

    for (const selector of removedSlideshowUi) {
      await expect(page.locator(selector)).toHaveCount(0);
    }

    const scrollable = await page.evaluate(() => {
      const track = document.querySelector<HTMLElement>(
        '[data-testid="slideshow-ilumination"] [data-slideshow-track]',
      );
      return track ? track.scrollWidth > track.clientWidth : false;
    });
    expect(scrollable).toBe(true);

    await expect(page.locator('[data-testid="footer-columns"]')).toBeVisible();
    await expect(page.locator('a[data-variant="whatsapp"]')).toBeVisible();
    await expect(page.locator('a[href="tel:+34668563287"]').first()).toBeVisible();

    await context.close();
  });
});

test.describe('homepage footer and actions', () => {
  for (const locale of locales) {
    test(`renders the compact three-column footer in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/`);

      await expect(page.locator('[data-testid="footer-columns"] > div')).toHaveCount(3);
      await expect(page.locator('footer').getByRole('heading', { level: 2 })).toHaveCount(3);
      await expect(page.locator('footer')).not.toContainText(copy[locale].removedTagline);
      await expect(page.locator('footer a[href="tel:+34668563287"]')).toBeVisible();
      await expect(page.locator('footer a[href^="https://wa.me/34668563287?text="]')).toBeVisible();
    });
  }

  test('uses green WhatsApp actions and phone icons site-wide', async ({ page }) => {
    await page.goto('/en/');

    const homepageWhatsApp = page.locator('a[data-variant="whatsapp"]');
    await expect(homepageWhatsApp).toHaveCount(1);
    await expect(homepageWhatsApp.locator('svg')).toHaveCount(1);

    const homepageCall = page.locator('a[data-variant="accent"]:has(svg)');
    await expect(homepageCall).toHaveCount(1);
    await expect(homepageCall).toHaveAttribute('href', 'tel:+34668563287');

    for (const path of ['/en/services/', '/en/contact/']) {
      await page.goto(path);

      const whatsapp = page.locator('a[data-variant="whatsapp"]');
      await expect(whatsapp).toHaveCount(1);
      await expect(whatsapp.locator('svg')).toHaveCount(1);

      const call = page.locator('a[data-variant="accent"]');
      await expect(call).toHaveCount(1);
      await expect(call.locator('svg')).toHaveCount(1);
    }
  });
});

const rowKeys = ['electricity', 'ilumination', 'climatization'] as const;
const rowLabelIndex = { electricity: 1, ilumination: 0, climatization: 2 } as const;

function rowLabels(locale: Locale): string[] {
  return rowKeys.map((key) => copy[locale].categories[rowLabelIndex[key]]);
}

interface RowSnapshot {
  overflow: number;
  innerWidth: number;
  problems: string[];
  links: Array<{ left: number; top: number; width: number; height: number }>;
}

/** Algorithm D-5: label integrity plus the geometry of the three links. */
async function snapshotRow(page: Page): Promise<RowSnapshot> {
  return page.evaluate(() => {
    const problems: string[] = [];
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('[data-testid="category-row"] a'),
    );
    const innerWidth = window.innerWidth;

    for (const link of links) {
      const label = link.querySelector<HTMLElement>('span');
      const name = link.dataset.category ?? '?';

      if (!label) {
        problems.push(`${name}: no label`);
        continue;
      }

      const linkRect = link.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      const style = getComputedStyle(label);

      if (style.visibility === 'hidden' || style.display === 'none' || labelRect.width === 0) {
        problems.push(`${name}: label hidden`);
      }

      if (label.scrollWidth > label.clientWidth + 0.5) {
        problems.push(`${name}: label scrollWidth ${label.scrollWidth} > ${label.clientWidth}`);
      }

      if (
        labelRect.left < linkRect.left - 0.5 ||
        labelRect.right > linkRect.right + 0.5 ||
        labelRect.left < 0 ||
        labelRect.right > innerWidth + 0.5
      ) {
        problems.push(`${name}: label outside its link or the viewport`);
      }

      const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);

      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.textContent ?? '';

        for (const match of text.matchAll(/\S+/g)) {
          const range = document.createRange();
          range.setStart(node, match.index ?? 0);
          range.setEnd(node, (match.index ?? 0) + match[0].length);

          if (range.getClientRects().length !== 1) {
            problems.push(`${name}: word "${match[0]}" breaks mid-word`);
          }
        }
      }
    }

    return {
      overflow: document.documentElement.scrollWidth - innerWidth,
      innerWidth,
      problems,
      links: links.map((link) => {
        const rect = link.getBoundingClientRect();
        return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
      }),
    };
  });
}

interface ArrivalSnapshot {
  hash: string;
  sectionTop: number;
  headerBottom: number;
  innerHeight: number;
  scrollY: number;
}

async function readArrival(page: Page, key: string): Promise<ArrivalSnapshot> {
  return page.evaluate((name) => {
    const section = document.querySelector(`#work-section-${name}`);
    const header = document.querySelector('header');

    return {
      hash: window.location.hash,
      sectionTop: section?.getBoundingClientRect().top ?? Number.NaN,
      headerBottom: header?.getBoundingClientRect().bottom ?? Number.NaN,
      innerHeight: window.innerHeight,
      scrollY: window.scrollY,
    };
  }, key);
}

/** Poll until two reads 100 ms apart return the same scrollY (Algorithm D-6). */
async function settledScrollY(page: Page): Promise<number> {
  let previous = Number.NaN;

  for (let attempt = 0; attempt < 60; attempt += 1) {
    const current = await page.evaluate(() => window.scrollY);

    if (current === previous) {
      return current;
    }

    previous = current;
    await page.waitForTimeout(100);
  }

  throw new Error('scrollY never settled');
}

test.describe('homepage category pictogram row', () => {
  for (const locale of locales) {
    test(`places the row between the hero and the rail in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/`);

      const order = await page.evaluate(() => {
        const hero = document.querySelector('[data-testid="hero"]');
        const row = document.querySelector('[data-testid="category-row"]');
        const rail = document.querySelector('[data-testid="credential-rail"]');
        const first = document.querySelector('[data-testid="work-category"]');

        if (!hero || !row || !rail || !first) {
          return null;
        }

        const follows = (a: Element, b: Element) =>
          Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

        return {
          dom: follows(hero, row) && follows(row, rail) && follows(rail, first),
          heroNext: hero.nextElementSibling === row,
          rowNext: row.nextElementSibling?.contains(rail) ?? false,
          rowInsideHero: hero.contains(row),
          tops: [hero, row, rail, first].map((element) => element.getBoundingClientRect().top),
        };
      });

      expect(order).not.toBeNull();
      expect(order?.dom).toBe(true);
      expect(order?.heroNext).toBe(true);
      expect(order?.rowNext).toBe(true);
      expect(order?.rowInsideHero).toBe(false);

      const tops = order?.tops ?? [];
      expect(tops[0]).toBeLessThan(tops[1]);
      expect(tops[1]).toBeLessThan(tops[2]);
      expect(tops[2]).toBeLessThan(tops[3]);
    });

    test(`lists three links in the owner's order with the category titles in ${locale}`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/`);

      const links = page.locator('[data-testid="category-row"] a');
      await expect(links).toHaveCount(3);
      await expect(page.locator('[data-testid="category-row"] li')).toHaveCount(3);

      const labels = rowLabels(locale);

      for (const [index, key] of rowKeys.entries()) {
        const link = links.nth(index);
        await expect(link).toHaveAttribute('href', `#work-section-${key}`);
        await expect(link).toHaveAttribute('data-category', key);
        await expect(link.locator('span')).toHaveText(labels[index]);

        const heading = page.locator(`section[data-category="${key}"] h2`);
        await expect(heading).toHaveText(labels[index]);
      }
    });

    test(`keeps headings and reveal markers out of the row in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/`);

      const row = page.locator('[data-testid="category-row"]');
      await expect(row.locator('h1, h2, h3, h4, h5, h6, [role="heading"]')).toHaveCount(0);
      await expect(row.locator('[data-reveal]')).toHaveCount(0);
      await expect(row).not.toHaveAttribute('data-reveal', /.*/);

      // Each label text appears exactly once among the h2 headings (the category's own).
      const headingTexts = await page.getByRole('heading', { level: 2 }).allInnerTexts();
      const labels = rowLabels(locale);

      for (const label of labels) {
        expect(headingTexts.filter((text) => text.trim() === label)).toHaveLength(1);
      }
    });
  }

  test('draws three original decorative pictograms in the brand colours', async ({ page }) => {
    await page.goto('/es/');

    const result = await page.evaluate(() => {
      const row = document.querySelector<HTMLElement>('[data-testid="category-row"]');
      const svgs = Array.from(
        document.querySelectorAll<SVGElement>('[data-testid="category-row"] svg'),
      );

      return {
        band: row ? getComputedStyle(row).backgroundColor : null,
        svgs: svgs.map((svg) => {
          const computed = getComputedStyle(svg);

          return {
            key: svg.getAttribute('data-pictogram'),
            viewBox: svg.getAttribute('viewBox'),
            fill: svg.getAttribute('fill'),
            stroke: svg.getAttribute('stroke'),
            strokeWidth: svg.getAttribute('stroke-width'),
            linecap: svg.getAttribute('stroke-linecap'),
            linejoin: svg.getAttribute('stroke-linejoin'),
            ariaHidden: svg.getAttribute('aria-hidden'),
            focusable: svg.getAttribute('focusable'),
            hasStyle: svg.hasAttribute('style'),
            hasStyleOrScript: svg.querySelector('style, script') !== null,
            anyChildStyle: Array.from(svg.querySelectorAll('*')).some((node) =>
              node.hasAttribute('style'),
            ),
            classes: svg.getAttribute('class')?.split(/\s+/) ?? [],
            color: computed.color,
            strokeColor: computed.stroke,
            width: svg.getBoundingClientRect().width,
            height: svg.getBoundingClientRect().height,
            shapes: svg.querySelectorAll('path, circle, rect, line, polyline, polygon, ellipse')
              .length,
          };
        }),
      };
    });

    expect(result.band).toBe('rgb(0, 32, 143)');
    expect(result.svgs.map((svg) => svg.key)).toEqual([...rowKeys]);

    for (const svg of result.svgs) {
      expect(svg.viewBox).toBe('0 0 24 24');
      expect(svg.fill).toBe('none');
      expect(svg.stroke).toBe('currentColor');
      expect(svg.strokeWidth).toBe('2');
      expect(svg.linecap).toBe('round');
      expect(svg.linejoin).toBe('round');
      expect(svg.ariaHidden).toBe('true');
      expect(svg.focusable).toBe('false');
      expect(svg.hasStyle).toBe(false);
      expect(svg.hasStyleOrScript).toBe(false);
      expect(svg.anyChildStyle).toBe(false);
      expect(svg.classes).toEqual(
        expect.arrayContaining(['h-8', 'w-8', 'shrink-0', 'text-accent']),
      );
      expect(svg.color).toBe('rgb(250, 217, 81)');
      expect(svg.strokeColor).toBe('rgb(250, 217, 81)');
      expect(svg.width).toBe(32);
      expect(svg.height).toBe(32);
      expect(svg.shapes).toBeGreaterThan(1);
    }
  });

  const rowViewports = [
    { width: 320, height: 900 },
    { width: 360, height: 900 },
    { width: 375, height: 900 },
    { width: 390, height: 900 },
    { width: 768, height: 900 },
    { width: 1024, height: 900 },
    { width: 1280, height: 900 },
    // 200% zoom of a 1280×800 window.
    { width: 640, height: 400 },
  ] as const;

  for (const locale of locales) {
    for (const viewport of rowViewports) {
      test(`fits without overflow or clipped labels at ${viewport.width}×${viewport.height} in ${locale}`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.goto(`/${locale}/`);
        await waitForFonts(page);

        const snapshot = await snapshotRow(page);

        expect(snapshot.overflow).toBeLessThanOrEqual(0);
        expect(snapshot.problems).toEqual([]);
        expect(snapshot.links).toHaveLength(3);

        const [first, second, third] = snapshot.links;

        if (viewport.width < 360) {
          // One column: stacked, same left edge.
          expect(second.top).toBeGreaterThan(first.top + first.height - 1);
          expect(third.top).toBeGreaterThan(second.top + second.height - 1);
          expect(Math.abs(second.left - first.left)).toBeLessThanOrEqual(1);
          expect(Math.abs(third.left - first.left)).toBeLessThanOrEqual(1);
        } else {
          // Three across from 360.
          expect(Math.abs(second.top - first.top)).toBeLessThanOrEqual(1);
          expect(Math.abs(third.top - first.top)).toBeLessThanOrEqual(1);
          expect(second.left).toBeGreaterThan(first.left + first.width - 1);
          expect(third.left).toBeGreaterThan(second.left + second.width - 1);
        }

        for (const link of snapshot.links) {
          expect(link.height).toBeGreaterThanOrEqual(44);
        }
      });
    }
  }

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1280, height: 800 },
  ] as const) {
    test(`reaches the links by Tab and jumps to each section at ${viewport.width}×${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto('/es/');
      await waitForFonts(page);

      for (const key of rowKeys) {
        await page.goto('/es/');
        await waitForFonts(page);
        await page.locator('[data-testid="hero"] a[href="/es/services/"]').focus();

        // Tab order: the row links follow the hero's services action, in order.
        const order: string[] = [];

        for (let step = 0; step < 3; step += 1) {
          await page.keyboard.press('Tab');
          order.push(
            await page.evaluate(
              () => (document.activeElement as HTMLElement | null)?.dataset.category ?? 'none',
            ),
          );

          const focus = await page.evaluate(() => {
            const active = document.activeElement as HTMLElement;
            const style = getComputedStyle(active);
            const rect = active.getBoundingClientRect();

            return {
              outlineStyle: style.outlineStyle,
              outlineWidth: Number.parseFloat(style.outlineWidth),
              outlineColor: style.outlineColor,
              width: rect.width,
              height: rect.height,
            };
          });

          expect(focus.outlineStyle).toBe('solid');
          expect(focus.outlineWidth).toBeGreaterThanOrEqual(2);
          expect(focus.outlineColor).toBe('rgb(250, 217, 81)');
          expect(focus.width).toBeGreaterThanOrEqual(44);
          expect(focus.height).toBeGreaterThanOrEqual(44);

          if (order[step] === key) {
            break;
          }
        }

        expect(order).toEqual(rowKeys.slice(0, order.length));
        expect(order.at(-1)).toBe(key);

        await page.keyboard.press('Enter');
        await settledScrollY(page);

        const arrival = await readArrival(page, key);
        expect(arrival.hash).toBe(`#work-section-${key}`);
        expect(arrival.sectionTop).toBeGreaterThanOrEqual(arrival.headerBottom - 0.5);
        expect(arrival.sectionTop).toBeLessThan(arrival.innerHeight);

        const stage = page.locator(
          `section[data-category="${key}"] [data-reveal]:has([data-testid="slideshow-${key}"])`,
        );
        await expect(stage).toHaveClass(/is-visible/);
      }
    });

    test(`jumps instantly with reduced motion at ${viewport.width}×${viewport.height}`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        reducedMotion: 'reduce',
        baseURL: fallbackBaseURL,
        viewport,
      });
      const page = await context.newPage();

      for (const key of rowKeys) {
        await page.goto('/es/');
        await waitForFonts(page);
        await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');

        await page.locator(`[data-testid="category-row"] a[data-category="${key}"]`).focus();
        await page.keyboard.press('Enter');

        const oneFrameLater = await page.evaluate(
          () =>
            new Promise<number>((resolve) => requestAnimationFrame(() => resolve(window.scrollY))),
        );
        const settled = await settledScrollY(page);

        expect(oneFrameLater).toBeGreaterThan(0);
        expect(oneFrameLater).toBe(settled);

        const arrival = await readArrival(page, key);
        expect(arrival.hash).toBe(`#work-section-${key}`);
        expect(arrival.sectionTop).toBeGreaterThanOrEqual(arrival.headerBottom - 0.5);
        expect(arrival.sectionTop).toBeLessThan(arrival.innerHeight);
      }

      await context.close();
    });
  }

  test('shows the row without JavaScript and its links still reach the sections', async ({
    browser,
  }) => {
    const { context, page } = await openWithJavaScriptDisabled(browser, '/es/');

    await expect(page.locator('[data-testid="category-row"]')).toBeVisible();
    const links = page.locator('[data-testid="category-row"] a');
    await expect(links).toHaveCount(3);

    for (const [index, key] of rowKeys.entries()) {
      await expect(links.nth(index)).toBeVisible();
      await links.nth(index).click();
      await settledScrollY(page);

      const arrival = await readArrival(page, key);
      expect(arrival.hash).toBe(`#work-section-${key}`);
      expect(arrival.sectionTop).toBeGreaterThanOrEqual(arrival.headerBottom - 0.5);
      expect(arrival.sectionTop).toBeLessThan(arrival.innerHeight);

      await page.evaluate(() => window.scrollTo(0, 0));
    }

    await context.close();
  });
});
