import { describe, expect, it } from 'vitest';

import {
  getLocaleFromPath,
  isLocale,
  localizedPath,
  normalizeRoute,
  swapLocale,
} from '@/lib/routes';

describe('locale helpers', () => {
  it('recognises supported locales only', () => {
    expect(isLocale('es')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('fr')).toBe(true);
    expect(isLocale('de')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it('reads the locale from a pathname', () => {
    expect(getLocaleFromPath('/es/')).toBe('es');
    expect(getLocaleFromPath('/fr/services/')).toBe('fr');
    expect(getLocaleFromPath('/de/')).toBeNull();
    expect(getLocaleFromPath('/')).toBeNull();
  });

  it('normalises route paths', () => {
    expect(normalizeRoute('')).toBe('/');
    expect(normalizeRoute('/')).toBe('/');
    expect(normalizeRoute('services')).toBe('/services/');
    expect(normalizeRoute('/services/')).toBe('/services/');
  });

  it('builds localized paths with a trailing slash', () => {
    expect(localizedPath('es', '/')).toBe('/es/');
    expect(localizedPath('en', '/services/')).toBe('/en/services/');
    expect(localizedPath('fr', 'contact')).toBe('/fr/contact/');
  });

  it('preserves the current route when switching locale', () => {
    expect(swapLocale('/en/services/', 'fr')).toBe('/fr/services/');
    expect(swapLocale('/es/', 'en')).toBe('/en/');
    expect(swapLocale('/es/404/', 'fr')).toBe('/fr/404/');
    expect(swapLocale('/unknown/', 'es')).toBe('/es/unknown/');
  });
});
