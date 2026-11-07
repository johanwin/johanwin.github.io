export type Skill = { name: string; level: 1 | 2 | 3 | 4 | 5; years?: number };
export type SkillGroup = { id: string; label: string; skills: Skill[] };

/** level: 1 = familiar … 5 = expert. Rendered as a 5-cell signal meter. */
export const skillMatrix: SkillGroup[] = [
  {
    id: 'LANG',
    label: 'Languages',
    skills: [
      { name: 'TypeScript', level: 5, years: 6 },
      { name: 'JavaScript', level: 5, years: 8 },
      { name: 'Python', level: 4, years: 5 },
      { name: 'SQL', level: 3, years: 4 },
      { name: 'Go', level: 2, years: 1 },
    ],
  },
  {
    id: 'FRMK',
    label: 'Frameworks',
    skills: [
      { name: 'React', level: 5, years: 6 },
      { name: 'Astro', level: 4, years: 2 },
      { name: 'Next.js', level: 4, years: 4 },
      { name: 'Node / Express', level: 4, years: 5 },
      { name: 'Tailwind CSS', level: 5, years: 4 },
    ],
  },
  {
    id: 'INFR',
    label: 'Infrastructure',
    skills: [
      { name: 'AWS', level: 3, years: 3 },
      { name: 'Docker', level: 4, years: 4 },
      { name: 'PostgreSQL', level: 4, years: 4 },
      { name: 'GitHub Actions', level: 4, years: 4 },
      { name: 'Cloudflare', level: 3, years: 2 },
    ],
  },
  {
    id: 'TOOL',
    label: 'Tooling',
    skills: [
      { name: 'Vite', level: 4, years: 3 },
      { name: 'Vitest / Playwright', level: 4, years: 3 },
      { name: 'Figma', level: 3, years: 4 },
      { name: 'Storybook', level: 4, years: 3 },
      { name: 'Git', level: 5, years: 8 },
    ],
  },
];
