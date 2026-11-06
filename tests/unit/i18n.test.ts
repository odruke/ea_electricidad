import { describe, expect, it } from 'vitest';

import { dictionaries, en, es, fr } from '@/i18n';

function flattenStrings(input: unknown, prefix = ''): Map<string, string> {
  const result = new Map<string, string>();

  if (typeof input === 'string') {
    result.set(prefix, input);
    return result;
  }

  if (input !== null && typeof input === 'object') {
    for (const [key, value] of Object.entries(input)) {
      const path = prefix ? `${prefix}.${key}` : key;
      for (const [nestedKey, nestedValue] of flattenStrings(value, path)) {
        result.set(nestedKey, nestedValue);
      }
    }
  }

  return result;
}

describe('translation dictionaries', () => {
  const source = flattenStrings(es);
  const sourceKeys = [...source.keys()].sort();

  it('exposes exactly three locales', () => {
    expect(Object.keys(dictionaries).sort()).toEqual(['en', 'es', 'fr']);
  });

  for (const [locale, dictionary] of Object.entries(dictionaries)) {
    it(`${locale} has the same keys as Spanish`, () => {
      expect([...flattenStrings(dictionary).keys()].sort()).toEqual(sourceKeys);
    });

    it(`${locale} has no empty strings`, () => {
      for (const [key, value] of flattenStrings(dictionary)) {
        expect(value.trim(), `${locale}.${key} must not be empty`).not.toBe('');
      }
    });
  }

  it('keeps English and French dictionaries typed against Spanish', () => {
    expect(en).toBeTypeOf('object');
    expect(fr).toBeTypeOf('object');
  });

  it('keeps exactly five service categories and three work categories with four bullets each', () => {
    expect(Object.keys(es.services.items)).toHaveLength(5);

    const categories = Object.entries(es.home.work.categories);
    expect(categories.map(([key]) => key)).toEqual(['ilumination', 'electricity', 'climatization']);

    for (const [, category] of categories) {
      expect(category.bullets).toHaveLength(4);
    }
  });

  it('keeps the slideshow copy templates intact', () => {
    for (const dictionary of Object.values(dictionaries)) {
      expect(dictionary.home.work.slideshow.stageLabel).toContain('{category}');
      expect(dictionary.home.work.slideshow).not.toHaveProperty('status');
      expect(dictionary.home.work.slideshow).not.toHaveProperty('previous');
      expect(dictionary.home.work.slideshow).not.toHaveProperty('next');
      expect(dictionary.home.work.slideshow).not.toHaveProperty('pause');
      expect(dictionary.home.work.slideshow).not.toHaveProperty('play');

      for (const category of Object.values(dictionary.home.work.categories)) {
        expect(category.imageAlt).toContain('{current}');
        expect(category.imageAlt).toContain('{total}');
      }
    }
  });

  it('does not advertise 24/7 availability', () => {
    for (const dictionary of Object.values(dictionaries)) {
      for (const value of flattenStrings(dictionary).values()) {
        expect(value.toLowerCase()).not.toMatch(/24\s*\/\s*7|24\s*h|veinticuatro horas/);
      }
    }
  });
});
