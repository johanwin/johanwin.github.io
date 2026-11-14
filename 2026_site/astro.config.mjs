// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

/**
 * Served from the custom domain johnnguyen.net (public/CNAME) via GitHub Pages,
 * so the site lives at the domain root and `base` is '/'. If you ever serve it
 * from a project path instead (johanwin.github.io/portfolio), set
 * BASE_PATH=/portfolio in the workflow — every internal URL in the codebase is
 * built through `withBase()` / import.meta.env.BASE_URL, so nothing else changes.
 */
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site: 'https://johnnguyen.net',
  base,
  output: 'static',
  trailingSlash: 'ignore',

  integrations: [
    react(),
    // sitemap-index.xml + sitemap-0.xml (linked from public/robots.txt).
    // Redirect stubs and the 404 page are left out.
    sitemap({ filter: (page) => !/\/404\/?$/.test(page) }),
  ],

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

  // Old URLs keep working. GitHub Pages can't send HTTP 301s, so Astro emits a
  // tiny page per path with an instant meta refresh + rel=canonical to the new
  // URL, which search engines treat as a permanent redirect.
  redirects: {
    // Previous production site (old sitemap)
    '/about': '/#about',
    '/contact': '/#contact',
    '/projects/capitalone': '/projects/capital-one-home-lending',
    '/projects/icrossing': '/projects/bcbs-tennessee',
    '/projects/hawkeye': '/projects/hawkeye-agency',
    // Renamed / merged projects (Nov 2026)
    '/projects/allstate-mesh': '/projects/allstate',
    '/projects/capital-one-home-loans': '/projects/capital-one-home-lending',
    '/projects/capital-one-home-equity': '/projects/capital-one-home-lending',
  },
});