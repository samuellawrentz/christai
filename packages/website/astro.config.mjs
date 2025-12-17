// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'static', // SSG
  integrations: [
    react(),
    mdx()
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
