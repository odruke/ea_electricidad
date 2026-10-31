import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Browser } from '@playwright/test';

const locales = ['es', 'en', 'fr'] as const;
const fallbackBaseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4321';

const headings: Record<(typeof locales)[number], string> = {
  es: 'Instalaciones eléctricas seguras y bien ejecutadas',
  en: 'Electrical installations done safely and properly',
  fr: 'Des installations électriques sûres et bien réalisées',
};

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

test.describe('routing and localization', () => {
  test('redirects the root to the Spanish home', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/es\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });

  for (const locale of locales) {
    test(`serves the ${locale} home with the right language`, async ({ page }) => {
      const response = await page.goto(`/${locale}/`);

      expect(response?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(headings[locale]);
    });
  }

  test('preserves the page when switching language', async ({ page }) => {
    await page.goto('/en/services/');
    await page.getByRole('link', { name: 'Français' }).click();

    await expect(page).toHaveURL(/\/fr\/services\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  });

  test('keeps localized 404 pages localized', async ({ page }) => {
    const spanish = await page.goto('/es/404/');
    expect(spanish?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Página no encontrada');

    await page.goto('/fr/404/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Page introuvable');
  });

  test('returns a 404 for unknown locales', async ({ page }) => {
    const response = await page.goto('/de/');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Página no encontrada');
  });
});

test.describe('navigation and contact', () => {
  test('links the header CTA to the localized contact page', async ({ page }) => {
    await page.goto('/es/');
    await page.locator('header').getByRole('link', { name: 'Solicitar presupuesto' }).click();

    await expect(page).toHaveURL(/\/es\/contact\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Hablemos de su instalación',
    );
  });

  test('exposes the approved contact targets', async ({ page }) => {
    await page.goto('/es/contact/');

    await expect(page.locator('a[href="tel:+34668563287"]').first()).toBeVisible();
    await expect(
      page.locator('a[href="mailto:info@ea-electricidadymultiservicios.com"]').first(),
    ).toBeVisible();

    const whatsapp = page.locator('a[href^="https://wa.me/34668563287?text="]').first();
    await expect(whatsapp).toBeVisible();
    await expect(whatsapp).toHaveAttribute('href', /^https:\/\/wa\.me\/34668563287\?text=/);
  });

  test('opens and closes the mobile navigation with the keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/es/');

    const details = page.locator('details[data-mobile-nav]');
    await details.locator('summary').click();
    await expect(details.getByRole('link', { name: 'Servicios' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(details).not.toHaveAttribute('open', '');
  });
});

test.describe('indexing and accessibility', () => {
  test('marks staging pages as noindex', async ({ page }) => {
    for (const locale of locales) {
      await page.goto(`/${locale}/`);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex, nofollow',
      );
    }

    await page.goto('/es/legal/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
  });

  test('serves a disallow-all robots file in staging', async ({ request }) => {
    const response = await request.get('/robots.txt');

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('Disallow: /');
  });

  for (const locale of locales) {
    test(`has no serious axe violations in ${locale}`, async ({ page }) => {
      for (const path of ['/', '/contact/', '/404/']) {
        await page.goto(`/${locale}${path}`);
        const results = await new AxeBuilder({ page }).analyze();
        const serious = results.violations
          .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
          .map((violation) => `${violation.id}: ${violation.help}`);

        expect(serious, `serious accessibility issues on ${locale}${path}`).toEqual([]);
      }
    });
  }
});

test.describe('responsive layout', () => {
  for (const width of [320, 375, 768, 1280]) {
    test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });

      for (const locale of locales) {
        await page.goto(`/${locale}/`);
        const overflow = await page.evaluate(() => {
          const element = document.documentElement;
          return element.scrollWidth - element.clientWidth;
        });

        expect(overflow, `horizontal overflow in ${locale} at ${width}px`).toBeLessThanOrEqual(1);
      }
    });
  }
});

test.describe('no JavaScript', () => {
  test('keeps navigation, language switching and contact links usable', async ({ browser }) => {
    const { context, page } = await openWithJavaScriptDisabled(browser, '/es/services/');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const details = page.locator('details[data-mobile-nav]');
    await details.locator('summary').click();
    await details.getByRole('link', { name: 'Français' }).click();

    await expect(page).toHaveURL(/\/fr\/services\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.locator('a[href="tel:+34668563287"]').first()).toBeVisible();

    await page.locator('details[data-mobile-nav] summary').click();
    await expect(
      page.locator('details[data-mobile-nav]').getByRole('link', { name: 'Contact' }),
    ).toBeVisible();

    await context.close();
  });
});
