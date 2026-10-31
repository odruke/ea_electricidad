import { locales, localizedPath, type Locale } from './routes';

export function canonicalUrl(siteUrl: string, locale: Locale, path: string): string {
  return new URL(localizedPath(locale, path), `${siteUrl.replace(/\/+$/, '')}/`).href;
}

export function alternateUrls(
  siteUrl: string,
  path: string,
): Array<{ locale: Locale; href: string }> {
  return locales.map((locale) => ({
    locale,
    href: canonicalUrl(siteUrl, locale, path),
  }));
}

export function absoluteAssetUrl(siteUrl: string, assetPath: string): string {
  return new URL(assetPath, `${siteUrl.replace(/\/+$/, '')}/`).href;
}
