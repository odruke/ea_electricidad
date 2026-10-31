import type { Env } from '@/config/env';

export function buildRobots(env: Env): string {
  if (env.SITE_ENV === 'production') {
    const sitemap = new URL('sitemap-index.xml', `${env.SITE_URL.replace(/\/+$/, '')}/`).href;
    return `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
  }

  return 'User-agent: *\nDisallow: /\n';
}
