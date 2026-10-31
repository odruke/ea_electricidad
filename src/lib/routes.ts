export const locales = ['es', 'en', 'fr'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
};

export function isLocale(value: string | null | undefined): value is Locale {
  return typeof value === 'string' && locales.includes(value as Locale);
}

export function assertLocale(value: string | null | undefined): Locale {
  if (!isLocale(value)) {
    throw new Error(`Unsupported locale: ${String(value)}`);
  }

  return value;
}

export function getLocaleFromPath(pathname: string): Locale | null {
  const [first] = pathname.split('/').filter(Boolean);
  return isLocale(first) ? first : null;
}

export function normalizeRoute(path: string): string {
  const trimmed = path.replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '/';
}

export function localizedPath(locale: Locale, path: string): string {
  return `/${locale}${normalizeRoute(path)}`;
}

export function swapLocale(pathname: string, target: Locale): string {
  const current = getLocaleFromPath(pathname);

  if (!current) {
    return localizedPath(target, pathname);
  }

  const rest = pathname.replace(new RegExp(`^/${current}`), '');
  return localizedPath(target, rest || '/');
}

export function localeStaticPaths(): Array<{ params: { locale: Locale } }> {
  return locales.map((locale) => ({ params: { locale } }));
}
