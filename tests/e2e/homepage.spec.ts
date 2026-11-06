import { expect, test, type Browser, type Page } from '@playwright/test';

const locales = ['es', 'en', 'fr'] as const;
const fallbackBaseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4321';

type Locale = (typeof locales)[number];

const copy: Record<
  Locale,
  {
    categories: readonly [string, string, string];
    slideshowTotal: readonly [number, number, number];
    removedTagline: string;
  }
> = {
  es: {
    categories: ['Iluminación', 'Electricidad', 'Climatización'],
    slideshowTotal: [6, 4, 5],
    removedTagline: 'Instalaciones eléctricas y multiservicios en Calpe.',
  },
  en: {
    categories: ['Lighting', 'Electrical', 'Climate control'],
    slideshowTotal: [6, 4, 5],
    removedTagline: 'Electrical installations and multi-service work in Calpe.',
  },
  fr: {
    categories: ['Éclairage', 'Électricité', 'Climatisation'],
    slideshowTotal: [6, 4, 5],
    removedTagline: 'Installations électriques et multiservices à Calpe.',
  },
};

const slideNames = ['ilumination', 'electricity', 'climatization'] as const;
const folders = ['ilumination', 'electricity', 'climatization'] as const;

const removedSlideshowUi = [
  '[data-slideshow-controls]',
  '[data-slideshow-prev]',
  '[data-slideshow-next]',
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
