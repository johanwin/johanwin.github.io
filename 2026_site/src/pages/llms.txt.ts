import type { APIRoute } from 'astro';
import { site, socials } from '@/data/site';
import { projects } from '@/data/projects';
import { experience, careerStart } from '@/data/experience';
import { skillMatrix } from '@/data/skills';
import { yearIn } from '@/lib/time';

/**
 * /llms.txt — a plain-Markdown summary of the site for AI assistants and agents
 * (https://llmstxt.org/). Generated at build time from src/data/*, so it stays
 * in sync with the site. Lighthouse's Agentic Browsing category validates it.
 */
export const GET: APIRoute = ({ site: siteUrl }) => {
  const url = (path: string) => new URL(path, siteUrl).href;
  const years = yearIn() - careerStart;
  const range = (start?: string, end?: string) =>
    [start?.slice(0, 4), end === 'HEAD' ? 'Present' : end?.slice(0, 4)].filter(Boolean).join('–');

  const linkFor = (label: string) => socials.find((s) => s.label === label)?.href;
  const resume = url('/resume.pdf');

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.title} in ${site.location}, specializing in front-end systems, reusable web component libraries and accessible (WCAG) interfaces. ${years}+ years building for enterprise and agency clients including Allstate, Capital One and Mitsubishi Motors. Adaptable to change, with hands-on experience working with generative and agentic AI.`,
    '',
    `${site.name} is ${site.availability.toLowerCase()}. This site is his portfolio; each project has a case-study page with screenshots, scope and stack. Client work: source and production links aren't public.`,
    '',
    '## Contact',
    '',
    `- Email: ${site.email}`,
    `- [LinkedIn](${linkFor('LinkedIn')})`,
    `- [GitHub](${linkFor('GitHub')})`,
    `- [Résumé (PDF)](${resume}): one-page résumé, machine-readable`,
    '',
    '## Projects',
    '',
    ...projects.map((p) => {
      const when = p.era ? ` (${p.era}${p.current ? ', current' : ''})` : '';
      return `- [${p.title}](${url(`/projects/${p.slug}/`)})${when}: ${p.summary} Stack: ${p.stack.join(', ')}.`;
    }),
    '',
    '## Experience',
    '',
    ...experience
      .filter((e) => e.start)
      .map((e) => `- ${e.role}, ${e.org}, ${e.location} (${range(e.start, e.end)})`),
    ...experience
      .filter((e) => !e.start)
      .map((e) => `- Education: ${e.role}, ${e.org}, ${e.location} (${range(undefined, e.end)})`),
    '',
    '## Skills',
    '',
    ...skillMatrix.map((g) => `- ${g.label}: ${g.skills.map((s) => s.name).join(', ')}`),
    '',
    '## Optional',
    '',
    `- [Home page](${url('/')}): hero, about, projects, activity log and contact on one page`,
    `- [Sitemap](${url('/sitemap-index.xml')})`,
    '',
  ];

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
