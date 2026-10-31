import { describe, expect, it } from 'vitest';

import { buildRobots } from '@/lib/robots';

describe('robots.txt generation', () => {
  it('disallows all crawling in staging', () => {
    const robots = buildRobots({ SITE_URL: 'https://example.com', SITE_ENV: 'staging' });

    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Disallow: /');
    expect(robots).not.toContain('Sitemap:');
  });

  it('allows crawling and references the sitemap in production', () => {
    const robots = buildRobots({ SITE_URL: 'https://example.com', SITE_ENV: 'production' });

    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Sitemap: https://example.com/sitemap-index.xml');
    expect(robots).not.toContain('Disallow: /');
  });
});
