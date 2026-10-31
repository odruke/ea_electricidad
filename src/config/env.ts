import { z } from 'zod';

const envSchema = z.object({
  SITE_URL: z
    .url('SITE_URL must be an absolute URL')
    .transform((value) => value.replace(/\/+$/, '')),
  SITE_ENV: z.enum(['staging', 'production']).default('staging'),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(input: Record<string, unknown>): Env {
  const result = envSchema.safeParse(input);

  if (!result.success) {
    const details = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    throw new Error(`Invalid environment configuration:\n${details.join('\n')}`);
  }

  return result.data;
}

export function getEnv(): Env {
  return parseEnv({
    SITE_URL: process.env.SITE_URL ?? import.meta.env.SITE_URL ?? 'http://localhost:4321',
    SITE_ENV: process.env.SITE_ENV ?? import.meta.env.SITE_ENV ?? 'staging',
  });
}
