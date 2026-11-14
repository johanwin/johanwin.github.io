export type Skill = { name: string; level: 1 | 2 | 3 | 4 | 5 };
export type SkillGroup = { id: string; label: string; skills: Skill[] };

/**
 * level → signal meter (5 cells):
 *   1 basic · 2 elementary · 3 medium · 4 strong · 5 expert
 */
export const skillMatrix: SkillGroup[] = [
  {
    id: 'LANG',
    label: 'Languages',
    skills: [
      { name: 'TypeScript', level: 5 },
      { name: 'JavaScript', level: 5 },
      { name: 'SQL', level: 2 },
      { name: 'PHP', level: 1 },
    ],
  },
  {
    id: 'FRMK',
    label: 'Frameworks',
    skills: [
      { name: 'React', level: 5 },
      { name: 'Astro', level: 4 },
      { name: 'Node.js', level: 4 },
      { name: 'Tailwind CSS', level: 5 },
    ],
  },
  {
    id: 'INFR',
    label: 'Infrastructure',
    skills: [
      { name: 'AWS', level: 2 },
      { name: 'Docker', level: 3 },
      { name: 'MySQL', level: 2 },
      { name: 'Jenkins', level: 3 },
      { name: 'GitHub Actions', level: 3 },
    ],
  },
  {
    id: 'TOOL',
    label: 'Tooling',
    skills: [
      { name: 'Vite', level: 3 },
      { name: 'Playwright', level: 3 },
      { name: 'Figma', level: 4 },
      { name: 'Storybook', level: 3 },
      { name: 'Git', level: 4 },
    ],
  },
];
