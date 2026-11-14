// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Served from the custom domain johnnguyen.org (public/CNAME) via GitHub Pages,
 * so the site lives at the domain root and `base` is '/'. If you ever serve it
 * from a project path instead (johanwin.github.io/portfolio), set
 * BASE_PATH=/portfolio in the workflow — every internal URL in the codebase is
 * built through `withBase()` / import.meta.env.BASE_URL, so nothing else changes.
 */
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site: 'https://johnnguyen.org',
  base,
  output: 'static',
  trailingSlash: 'ignore',

  integrations: [react()],

  // Tailwind v4 runs as a Vite plugin; design tokens live in src/styles/global.css (@theme).
  vite: {
    plugins: [tailwindcss()],
  },

  // Prefetch on hover/focus pairs with <ClientRouter /> so page swaps feel instant.
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },

  build: {
    // Small stylesheets get inlined into <head>: one less render-blocking request on Pages.
    inlineStylesheets: 'auto',
    // GitHub Pages serves /projects/foo/index.html for /projects/foo
    format: 'directory',
  },

  compressHTML: true,

  // Old project URLs (renamed / merged Nov 2026) keep working.
  redirects: {
    '/projects/allstate-mesh': '/projects/allstate',
    '/projects/capital-one-home-loans': '/projects/capital-one-home-lending',
    '/projects/capital-one-home-equity': '/projects/capital-one-home-lending',
  },
});
