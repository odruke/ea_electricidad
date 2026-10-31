import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const loaded = loadEnv(mode, process.cwd(), '');
const site = process.env.SITE_URL || loaded.SITE_URL || 'http://localhost:4321';
const siteEnv = process.env.SITE_ENV || loaded.SITE_ENV || 'staging';

// Expose the build-time configuration to server-rendered Astro components.
process.env.SITE_URL = site;
process.env.SITE_ENV = siteEnv;

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'fr'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return path !== '/' && !path.endsWith('/404/') && !path.endsWith('/legal/');
      },
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es',
          en: 'en',
          fr: 'fr',
        },
      },
      serialize: (item) => {
        const path = new URL(item.url).pathname;
        const defaultUrl = new URL(path.replace(/^\/(es|en|fr)\//, '/es/'), item.url).href;

        return {
          ...item,
          links: [...(item.links ?? []), { lang: 'x-default', url: defaultUrl }],
        };
      },
    }),
  ],
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
  build: {
    inlineStylesheets: 'never',
  },
});
