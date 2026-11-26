// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // GitHub Pages serves the site under /royal-bees-site; the real domain later serves it at /.
  site: process.env.SITE_URL ?? 'https://royalbeeseg.com',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/dev/') })],
});
