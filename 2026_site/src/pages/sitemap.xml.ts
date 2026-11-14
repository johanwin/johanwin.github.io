import type { APIRoute } from 'astro';

/**
 * /sitemap.xml — kept because the previous production site published its
 * sitemap at this path (and search engines may still have it on file).
 * It's a sitemap index pointing at the file @astrojs/sitemap generates, so
 * there's a single source of truth for the page list.
 */
export const GET: APIRoute = ({ site }) => {
  const loc = new URL(`${import.meta.env.BASE_URL.replace(/\/?$/, '/')}sitemap-0.xml`, site);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${loc.href}</loc></sitemap>
</sitemapindex>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
