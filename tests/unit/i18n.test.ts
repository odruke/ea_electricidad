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
      // Arrow navigation restored by the owner (2026-11-22): previous/next labels only.
      expect(dictionary.home.work.slideshow.previous).toBeTruthy();
      expect(dictionary.home.work.slideshow.next).toBeTruthy();
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

  const t3004 = {
    es: {
      authorization: 'Instalador autorizado de baja tensión (RBET)',
      hoursNote: 'Las urgencias sin cita previa pueden tener un recargo.',
      lead: 'Puede contactar por teléfono, WhatsApp o correo electrónico.',
    },
    en: {
      authorization: 'Authorised low-voltage installer (RBET)',
      hoursNote: 'Urgent work without an appointment may carry a surcharge.',
      lead: 'You can contact us by phone, WhatsApp or email.',
    },
    fr: {
      authorization: 'Installateur autorisé basse tension (RBET)',
      hoursNote: 'Les urgences sans rendez-vous peuvent entraîner un supplément.',
      lead: 'Vous pouvez nous contacter par téléphone, WhatsApp ou e-mail.',
    },
  } as const;

  for (const [locale, expected] of Object.entries(t3004)) {
    it(`${locale} uses the exact credential, urgent-note and contact-lead copy`, () => {
      const dictionary = dictionaries[locale as keyof typeof dictionaries];

      expect(dictionary.home.facts.authorization).toBe(expected.authorization);
      expect(dictionary.contact.hoursNote).toBe(expected.hoursNote);
      expect(dictionary.contact.lead).toBe(expected.lead);
    });
  }

  it('never mentions IBTB in any dictionary string', () => {
    for (const [locale, dictionary] of Object.entries(dictionaries)) {
      for (const [key, value] of flattenStrings(dictionary)) {
        expect(value, `${locale}.${key}`).not.toContain('IBTB');
      }
    }
  });

  it('keeps hoursNote free of digits and weekday words', () => {
    const weekdays =
      /lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo|monday|tuesday|wednesday|thursday|friday|saturday|sunday|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche/i;

    for (const [locale, dictionary] of Object.entries(dictionaries)) {
      expect(dictionary.contact.hoursNote, locale).not.toMatch(/\d/);
      expect(dictionary.contact.hoursNote, locale).not.toMatch(weekdays);
    }
  });
});
