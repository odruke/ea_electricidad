import type { Locale } from '@/lib/routes';

import { en } from './messages/en';
import { es, type Dictionary } from './messages/es';
import { fr } from './messages/fr';

export type { Dictionary };

export const dictionaries: Record<Locale, Dictionary> = {
  es,
  en,
  fr,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export { en, es, fr };
