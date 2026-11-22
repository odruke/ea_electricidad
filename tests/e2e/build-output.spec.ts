import { expect, test } from '@playwright/test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

// Build-output audit (R51, R56, R65, R67, R68, R72, R78). It reads the files in
// dist/ directly, so run `astro build` first. The preview path is matched with
// a pattern, never written out, so the source-tree grep stays clean (P-20).
const dist = resolve(import.meta.dirname, '../../dist');
const previewPattern = /logo[-_]preview/;
const locales = ['es', 'en', 'fr'] as const;

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    return entry.isDirectory() ? [path, ...walk(path)] : [path];
  });
}

const entries = walk(dist);
const htmlFiles = entries.filter((path) => path.endsWith('.html'));
// Astro writes a bare meta-refresh stub for the root redirect; it has no head to audit.
const isRedirectStub = (html: string) => /<meta http-equiv="refresh"/i.test(html);
const pages = htmlFiles.map((path) => ({
  name: relative(dist, path),
  html: readFileSync(path, 'utf8'),
}));
const documents = pages.filter((page) => !isRedirectStub(page.html));

function matches(html: string, pattern: RegExp): string[] {
  return html.match(pattern) ?? [];
}

test.describe('build output (dist/)', () => {
  test('dist/ holds every localized page', () => {
    expect(pages.length).toBeGreaterThanOrEqual(15);
    expect(documents.length).toBe(pages.length - 1);
  });

  test('has no inline script, style element or style attribute in any page', () => {
    for (const { name, html } of pages) {
      expect(matches(html, /<script(?![^>]*\ssrc=)[^>]*>/gi), `${name} inline script`).toEqual([]);
      expect(matches(html, /<style[\s>]/gi), `${name} style element`).toEqual([]);
      expect(matches(html, /\sstyle\s*=/gi), `${name} style attribute`).toEqual([]);
    }
  });

  test('has no IBTB, JSON-LD or preview path in any page', () => {
    for (const { name, html } of pages) {
      expect(html, `${name} IBTB`).not.toContain('IBTB');
      expect(html, `${name} JSON-LD`).not.toContain('application/ld+json');
      expect(html, `${name} preview path`).not.toMatch(previewPattern);
    }
  });

  test('has no file or directory matching the preview path in dist/', () => {
    const offenders = entries
      .map((path) => relative(dist, path))
      .filter((path) => previewPattern.test(path));

    expect(offenders).toEqual([]);
  });

  test('every page links the new icons and never /logo.jpg as an icon', () => {
    for (const { name, html } of documents) {
      const links = matches(html, /<link\b[^>]*>/gi);
      const icons = links.filter((link) => /\brel="icon"/i.test(link));
      const touchIcons = links.filter((link) => /\brel="apple-touch-icon"/i.test(link));

      expect(icons, `${name} rel=icon`).toHaveLength(1);
      expect(icons[0], `${name} rel=icon href`).toContain('href="/brand/icon-32.png"');
      expect(icons[0], `${name} rel=icon sizes`).toContain('sizes="32x32"');
      expect(touchIcons, `${name} apple-touch-icon`).toHaveLength(1);
      expect(touchIcons[0], `${name} apple-touch-icon href`).toContain(
        'href="/brand/apple-touch-icon.png"',
      );

      const logoIcons = links.filter(
        (link) => /\brel="[^"]*icon[^"]*"/i.test(link) && link.includes('/logo.jpg'),
      );

      expect(logoIcons, `${name} icon to /logo.jpg`).toEqual([]);
    }
  });

  test('the og:image and twitter:image files exist in dist/', () => {
    for (const { name, html } of documents) {
      const images = [
        ...matches(html, /<meta\b[^>]*\bproperty="og:image"[^>]*>/gi),
        ...matches(html, /<meta\b[^>]*\bname="twitter:image"[^>]*>/gi),
      ];

      expect(images, `${name} share image tags`).toHaveLength(2);

      for (const tag of images) {
        const content = /\bcontent="([^"]+)"/i.exec(tag)?.[1] ?? '';
        const path = new URL(content).pathname;

        expect(path, `${name} ${content}`).toMatch(/^\/brand\/[^/]+\.png$/);
        expect(existsSync(join(dist, path)), `${name} ${path} exists`).toBe(true);
      }
    }
  });

  test('the sitemap lists exactly es, en and fr on /, /services/ and /contact/', () => {
    const xml = readFileSync(join(dist, 'sitemap-0.xml'), 'utf8');
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => new URL(match[1]).pathname,
    );
    const expected = locales.flatMap((locale) =>
      ['/', '/services/', '/contact/'].map((path) => `/${locale}${path}`),
    );

    expect([...urls].sort()).toEqual([...expected].sort());
  });
});
