// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import cloudflare from '@astrojs/cloudflare';
import { LANGUAGES } from './src/i18n/config.i18n';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['astro:transitions']
    },
    ssr: {
      noExternal: ['astro:transitions']
    }
  },

  site: 'https://cancundrink.com',

  adapter: cloudflare(),
  i18n: {
    defaultLocale: 'es',
    locales: Object.keys(LANGUAGES),
    routing: {
      prefixDefaultLocale: true,
      fallbackType: 'redirect',
      redirectToDefaultLocale: true,
    }
  },
    integrations: [sitemap({
    i18n: {
      defaultLocale: 'es',
      locales: {
        en: 'en',
        es: 'es'
      },
    },
    
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date(),
    customPages: [
      'https://cancundrink.com/',
      'https://cancundrink.com/en/'
    ]
  })]
});