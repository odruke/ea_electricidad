import type { APIRoute } from 'astro';

import { getEnv } from '@/config/env';
import { buildRobots } from '@/lib/robots';

export const prerender = true;

export const GET: APIRoute = () => {
  const env = getEnv();

  return new Response(buildRobots(env), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
