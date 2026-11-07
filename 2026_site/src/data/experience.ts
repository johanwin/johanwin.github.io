export type ChangeType = 'feat' | 'perf' | 'fix' | 'test' | 'refactor' | 'style' | 'chore' | 'docs';

export type ExperienceEntry = {
  /** Semver-style tag — newest gets the highest major. */
  version: string;
  hash: string;
  role: string;
  org: string;
  location: string;
  /** 'YYYY' or 'YYYY-MM'. Omit for single-date entries (e.g. a degree). */
  start?: string;
  end: string | 'HEAD';
  changes: { type: ChangeType; text: string }[];
};

export const experience: ExperienceEntry[] = [
  {
    version: 'v6.0.0',
    hash: 'a1157a7',
    role: 'Senior Software Engineer',
    org: 'Allstate',
    location: 'Irving, TX',
    start: '2018',
    end: 'HEAD',
    changes: [
      { type: 'docs', text: 'Own UI specs and prototypes across multiple product lines.' },
      { type: 'feat', text: 'Web components for eProposal, Milewise, Roadside & Cross-Enterprise.' },
      { type: 'feat', text: 'Multi-tier apps in React, Angular, ASP.NET and Java.' },
      { type: 'style', text: 'Partner with UX designers to implement the HIG.' },
    ],
  },
  {
    version: 'v5.0.0',
    hash: 'c41f0e3',
    role: 'Senior UI Engineer',
    org: 'Capital One',
    location: 'Plano, TX',
    start: '2015',
    end: '2018',
    changes: [
      { type: 'feat', text: 'Built and maintained the Home Loans site and apps in Angular.' },
      { type: 'refactor', text: 'Reusable web components shared across multiple projects.' },
      { type: 'perf', text: 'Improved download performance of the web properties.' },
      { type: 'feat', text: 'Integrated the front end with the enterprise CMS.' },
      { type: 'test', text: 'Unit-tested the pre-qualification application.' },
      { type: 'fix', text: 'Brought WCAG accessibility guidelines into the apps.' },
    ],
  },
  {
    version: 'v4.0.0',
    hash: '1c055ed',
    role: 'UI Engineer',
    org: 'iCrossing',
    location: 'Dallas, TX',
    start: '2012',
    end: '2015',
    changes: [
      { type: 'feat', text: 'Client sites for Hilton and BlueCross BlueShield of TN.' },
      { type: 'chore', text: 'Set up project workflow environments from scratch.' },
      { type: 'perf', text: 'Fixed bugs; shipped enhancements for function and speed.' },
      { type: 'feat', text: 'Delivered for several large clients in parallel.' },
    ],
  },
  {
    version: 'v3.0.0',
    hash: '4a3e7e1',
    role: 'Interactive Developer',
    org: 'Hawkeye',
    location: 'Dallas, TX',
    start: '2008',
    end: '2012',
    changes: [
      { type: 'feat', text: "Sites and HTML emails for ThyssenKrupp Elevator and Raising Cane's." },
      { type: 'feat', text: "Developed the agency's new website." },
      { type: 'style', text: 'Turned art directors’ visions into faithful builds.' },
      { type: 'perf', text: 'Rapid, quality turnaround on landing pages and emails.' },
    ],
  },
  {
    version: 'v2.0.0',
    hash: 'ca9b0e5',
    role: 'Web & Graphic Designer',
    org: 'The Canyon News',
    location: 'Canyon, TX',
    start: '2006',
    end: '2008',
    changes: [
      { type: 'feat', text: 'Led the website redesign and build; new web presence.' },
      { type: 'fix', text: 'Improved the usability of the website.' },
      { type: 'style', text: 'Designed print ads for the newspaper.' },
      { type: 'chore', text: 'Volunteer IT: workstations, servers and production gear.' },
    ],
  },
  {
    version: 'v1.0.0',
    hash: '0000001',
    role: "Bachelor's, Marketing",
    org: 'West Texas A&M University',
    location: 'Canyon, TX',
    end: '2006',
    changes: [{ type: 'docs', text: 'Initial commit.' }],
  },
];

/** Earliest year in the log — used for "years active" readouts. */
export const careerStart = Math.min(
  ...experience.filter((e) => e.start).map((e) => Number(e.start!.slice(0, 4))),
);
