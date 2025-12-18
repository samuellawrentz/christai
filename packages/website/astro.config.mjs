// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://christianai.world',
  output: 'static', // SSG
  integrations: [
    react(),
    mdx(),
    sitemap()
  ],
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    css: {
      postcss: './postcss.config.mjs'
    }
  }
});
