import type { Page } from '@playwright/test';

/**
 * Let the entrance transitions settle before auditing. Axe blends the colors of
 * an element that is partway through a fade and reports a false contrast
 * violation, so audit the stable state instead.
 */
export async function waitForMotion(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve(undefined))),
    );

    await Promise.race([
      Promise.all(
        document.getAnimations().map((animation) => animation.finished.catch(() => undefined)),
      ),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);
  });
}

/** Wait until every web font in use has loaded. */
export async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}
