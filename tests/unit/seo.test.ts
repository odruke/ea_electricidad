import { describe, expect, it } from 'vitest';

import { absoluteAssetUrl, alternateUrls, canonicalUrl } from '@/lib/seo';

const siteUrl = 'https://example.com';

describe('SEO URL helpers', () => {
  it('builds canonical URLs with locale prefix and trailing slash', () => {
    expect(canonicalUrl(siteUrl, 'es', '/')).toBe('https://example.com/es/');
    expect(canonicalUrl(siteUrl, 'en', '/services/')).toBe('https://example.com/en/services/');
  });

  it('ignores a trailing slash on the site URL', () => {
    expect(canonicalUrl('https://example.com/', 'fr', '/contact/')).toBe(
      'https://example.com/fr/contact/',
    );
  });

  it('returns every language alternate', () => {
    expect(alternateUrls(siteUrl, '/contact/').map((alternate) => alternate.locale)).toEqual([
      'es',
      'en',
      'fr',
    ]);
  });

  it('resolves absolute asset URLs', () => {
    expect(absoluteAssetUrl(siteUrl, '/logo.jpg')).toBe('https://example.com/logo.jpg');
  });
});
