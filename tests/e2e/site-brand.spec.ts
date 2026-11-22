import { expect, test, type Page } from '@playwright/test';
import { brandAssets, isUndistortedRender } from '../../src/config/brand';
import { site } from '../../src/config/site';
import { waitForFonts, waitForMotion } from '../support/motion';

const locales = ['es', 'en', 'fr'] as const;

type Locale = (typeof locales)[number];

const copy: Record<Locale, { hoursNote: string; lead: string }> = {
  es: {
    hoursNote: 'Las urgencias sin cita previa pueden tener un recargo.',
    lead: 'Puede contactar por teléfono, WhatsApp o correo electrónico.',
  },
  en: {
    hoursNote: 'Urgent work without an appointment may carry a surcharge.',
    lead: 'You can contact us by phone, WhatsApp or email.',
  },
  fr: {
    hoursNote: 'Les urgences sans rendez-vous peuvent entraîner un supplément.',
    lead: 'Vous pouvez nous contacter par téléphone, WhatsApp ou e-mail.',
  },
};

const pages = ['', 'services/', 'contact/', 'legal/', '404/'] as const;

test.describe('site copy (R76-R78)', () => {
  for (const locale of locales) {
    for (const path of pages) {
      test(`footer shows the exact urgent note on /${locale}/${path}`, async ({ page }) => {
        await page.goto(`/${locale}/${path}`);
        await waitForMotion(page);

        await expect(page.locator('footer p', { hasText: copy[locale].hoursNote })).toHaveText(
          copy[locale].hoursNote,
        );
      });
    }

    test(`contact page shows the exact lead and urgent note in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/contact/`);
      await waitForMotion(page);

      const main = page.locator('main');
      await expect(main.locator('p', { hasText: copy[locale].lead })).toHaveText(copy[locale].lead);
      await expect(main.locator('p', { hasText: copy[locale].hoursNote })).toHaveText(
        copy[locale].hoursNote,
      );
    });
  }
});

interface HeaderMeasure {
  src: string | null;
  alt: string | null;
  height: number;
  width: number;
  radius: string;
  headerHeight: number;
  linkName: string;
  columnGap: number;
  nameOverflow: number;
}

async function measureHeader(page: Page, locale: Locale): Promise<HeaderMeasure> {
  return page.evaluate((homeHref) => {
    const header = document.querySelector('header') as HTMLElement;
    const link = header.querySelector<HTMLAnchorElement>(`a[href="${homeHref}"]`) as HTMLElement;
    const image = link.querySelector('img') as HTMLImageElement;
    const name = link.querySelector('span') as HTMLElement;
    const rect = image.getBoundingClientRect();

    return {
      src: image.getAttribute('src'),
      alt: image.getAttribute('alt'),
      height: rect.height,
      width: rect.width,
      radius: getComputedStyle(image).borderRadius,
      headerHeight: header.getBoundingClientRect().height,
      linkName: (link.textContent ?? '').replace(/\s+/g, ' ').trim(),
      columnGap: Number.parseFloat(getComputedStyle(link).columnGap),
      nameOverflow: name.scrollWidth - name.clientWidth,
    };
  }, `/${locale}/`);
}

async function openPage(page: Page, locale: Locale, path: string, width = 1280): Promise<void> {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(`/${locale}/${path}`);
  await waitForFonts(page);
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll<HTMLImageElement>('header img'));
    await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
  });
  await waitForMotion(page);
}

test.describe('header logo (R61, R66)', () => {
  for (const locale of locales) {
    for (const path of pages) {
      test(`shows the blue logo at 44 px on /${locale}/${path}`, async ({ page }) => {
        await openPage(page, locale, path);
        const header = await measureHeader(page, locale);

        expect(header.src).toBe(brandAssets.logoBlue.src);
        expect(header.alt).toBe('');
        expect(Math.abs(header.height - 44)).toBeLessThanOrEqual(0.5);
        expect(isUndistortedRender(header.width, header.height)).toBe(true);
        expect(Number.parseFloat(header.radius)).toBe(0);
        expect(header.headerHeight).toBe(65);
        expect(header.linkName).toBe(site.name);
        await expect(
          page.locator('header').getByRole('link', { name: site.name, exact: true }),
        ).toHaveAttribute('href', `/${locale}/`);
      });
    }
  }

  // Algorithm D-7: the logo and the gap never take more room than the 44 + 12 px of 5edbb07.
  for (const width of [320, 375, 390, 768, 1024, 1280]) {
    test(`leaves the name at least as much room as before at ${width}`, async ({
      page,
    }, testInfo) => {
      await openPage(page, 'es', '', width);
      const header = await measureHeader(page, 'es');

      expect(header.width + header.columnGap).toBeLessThanOrEqual(56);

      if (width === 375 || width === 390) {
        const line = `header name overflow at ${width}: ${header.nameOverflow} (logo=${header.width.toFixed(2)} gap=${header.columnGap})`;
        console.log(line);
        testInfo.annotations.push({ type: 'measurement', description: line });
      }
    });
  }

  for (const locale of locales) {
    for (const path of ['services/', 'contact/'] as const) {
      test(`has no horizontal overflow at 320 on /${locale}/${path}`, async ({ page }) => {
        await openPage(page, locale, path, 320);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );

        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  }
});

test.describe('brand files (R60, R67, R68)', () => {
  test('display variants are transparent on the corners and the 1 px frame', async ({ page }) => {
    await page.goto('/es/');

    for (const asset of [brandAssets.logoBlue, brandAssets.logoWhite]) {
      const result = await page.evaluate(async (src) => {
        const image = new Image();
        image.src = src;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.drawImage(image, 0, 0);
        const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
        const alpha = (x: number, y: number) => data[(y * width + x) * 4 + 3];
        const corners = [
          alpha(0, 0),
          alpha(width - 1, 0),
          alpha(0, height - 1),
          alpha(width - 1, height - 1),
        ];
        let opaqueFramePixels = 0;

        for (let x = 0; x < width; x += 1) {
          opaqueFramePixels += (alpha(x, 0) === 0 ? 0 : 1) + (alpha(x, height - 1) === 0 ? 0 : 1);
        }

        for (let y = 0; y < height; y += 1) {
          opaqueFramePixels += (alpha(0, y) === 0 ? 0 : 1) + (alpha(width - 1, y) === 0 ? 0 : 1);
        }

        return { width, height, corners, opaqueFramePixels };
      }, asset.src);

      expect(result.width).toBe(asset.width);
      expect(result.height).toBe(asset.height);
      expect(result.corners).toEqual([0, 0, 0, 0]);
      expect(result.opaqueFramePixels).toBe(0);
    }
  });

  test('both icons are fully opaque', async ({ page }) => {
    await page.goto('/es/');

    for (const asset of [brandAssets.icon32, brandAssets.appleTouchIcon]) {
      const result = await page.evaluate(async (src) => {
        const image = new Image();
        image.src = src;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.drawImage(image, 0, 0);
        const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
        let translucent = 0;

        for (let index = 3; index < data.length; index += 4) {
          if (data[index] !== 255) {
            translucent += 1;
          }
        }

        return { width: canvas.width, height: canvas.height, translucent };
      }, asset.src);

      expect(result.width).toBe(asset.width);
      expect(result.height).toBe(asset.height);
      expect(result.translucent).toBe(0);
    }
  });

  for (const asset of Object.values(brandAssets)) {
    test(`serves ${asset.src} as image/png`, async ({ request }) => {
      const response = await request.get(asset.src);

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('image/png');
    });
  }

  test('the head links the new icons and the share image', async ({ page }) => {
    await page.goto('/es/');

    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', brandAssets.icon32.src);
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('sizes', '32x32');
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
      'href',
      brandAssets.appleTouchIcon.src,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      new RegExp(`${brandAssets.share.src}$`),
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      new RegExp(`${brandAssets.share.src}$`),
    );
  });
});

// P-20: the preview path is built, so the literal never appears in a test file.
const previewPath = ['logo', 'preview'].join('-');

test.describe('removed preview artifacts (R65)', () => {
  for (const locale of locales) {
    test(`/${locale}/${previewPath}/ returns 404`, async ({ request }) => {
      const response = await request.get(`/${locale}/${previewPath}/`);

      expect(response.status()).toBe(404);
    });
  }
});

test.describe('same-origin requests (R72)', () => {
  for (const locale of locales) {
    test(`every homepage request stays on the same origin in ${locale}`, async ({
      page,
      baseURL,
    }) => {
      const origin = new URL(baseURL as string).origin;
      const foreign: string[] = [];

      page.on('request', (request) => {
        const url = new URL(request.url());

        if (url.protocol !== 'data:' && url.protocol !== 'blob:' && url.origin !== origin) {
          foreign.push(request.url());
        }
      });

      await page.goto(`/${locale}/`);
      await page.waitForLoadState('networkidle');
      await waitForMotion(page);

      expect(foreign).toEqual([]);
    });
  }
});
