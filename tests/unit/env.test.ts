import { describe, expect, it } from 'vitest';

import { parseEnv } from '@/config/env';

describe('environment validation', () => {
  it('accepts a valid staging configuration', () => {
    expect(parseEnv({ SITE_URL: 'https://203.0.113.10.sslip.io', SITE_ENV: 'staging' })).toEqual({
      SITE_URL: 'https://203.0.113.10.sslip.io',
      SITE_ENV: 'staging',
    });
  });

  it('defaults to staging when SITE_ENV is omitted', () => {
    expect(parseEnv({ SITE_URL: 'https://example.com' }).SITE_ENV).toBe('staging');
  });

  it('removes trailing slashes from the site URL', () => {
    expect(parseEnv({ SITE_URL: 'https://example.com///' }).SITE_URL).toBe('https://example.com');
  });

  it('rejects a missing or invalid site URL', () => {
    expect(() => parseEnv({})).toThrow(/SITE_URL/);
    expect(() => parseEnv({ SITE_URL: 'not-a-url' })).toThrow(/SITE_URL/);
  });

  it('rejects an unknown environment', () => {
    expect(() => parseEnv({ SITE_URL: 'https://example.com', SITE_ENV: 'preview' })).toThrow(
      /SITE_ENV/,
    );
  });
});
