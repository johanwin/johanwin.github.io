export type ProjectImage = {
  /** Path relative to /public, WITHOUT the base — components apply withBase(). */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** How the single asset is framed in the UI. */
  frame: 'telemetry' | 'schematic';
};

export type Project = {
  slug: string;
  code: string;
  title: string;
  /** Display era, e.g. '2015–2018'. Omit if unknown. */
  era?: string;
  status: 'ACTIVE' | 'SHIPPED' | 'ARCHIVED';
  summary: string;
  description: string;
  stack: string[];
  image: ProjectImage;
  /** Dense metadata tags rendered around the capture (keep to 4). */
  telemetry: { k: string; v: string }[];
  /** Shown in the SCOPE tab and on the case-study page. */
  scope: string[];
};

/*
 * Captures in /public/images/projects/ are generated placeholders —
 * drop real screenshots in with the same filenames (keep width/height in sync).
 */
const img = (slug: string, title: string, frame: ProjectImage['frame']): ProjectImage => ({
  src: `/images/projects/${slug}.svg`,
  alt: `Placeholder capture for ${title}.`,
  width: 1200,
  height: 750,
  frame,
});

export const projects: Project[] = [
  {
    slug: 'allstate-mesh',
    code: 'PRJ-0x01',
    title: 'Allstate Mesh Component Library',
    era: '2018–Now',
    status: 'ACTIVE',
    summary: "Reusable web components shared across Allstate's enterprise products.",
    description:
      "A shared library of reusable web components built for Allstate's eProposal, Milewise, Roadside Services and Cross-Enterprise projects, implemented with UX designers against the company's human interface guidelines.",
    stack: ['Web Components', 'React', 'Angular'],
    image: img('allstate-mesh', 'Allstate Mesh Component Library', 'schematic'),
    telemetry: [
      { k: 'CLIENT', v: 'Allstate' },
      { k: 'ROLE', v: 'Sr. SWE' },
      { k: 'CONSUMERS', v: '4 product lines' },
      { k: 'ERA', v: '2018–Now' },
    ],
    scope: [
      'Components consumed by eProposal, Milewise, Roadside Services and Cross-Enterprise.',
      'Built to the HIG in close collaboration with UX designers.',
      'UI specifications and prototypes for new product concepts.',
    ],
  },
  {
    slug: 'capital-one-home-loans',
    code: 'PRJ-0x02',
    title: 'Capital One Home Loans Website',
    era: '2015–2018',
    status: 'SHIPPED',
    summary: "Angular front end for Capital One's Home Loans web properties.",
    description:
      "Developed and maintained the Home Loans website in Angular, integrated with the company's enterprise content management system, with a focus on download performance and WCAG accessibility.",
    stack: ['Angular', 'JavaScript', 'Enterprise CMS', 'WCAG'],
    image: img('capital-one-home-loans', 'Capital One Home Loans Website', 'telemetry'),
    telemetry: [
      { k: 'CLIENT', v: 'Capital One' },
      { k: 'ROLE', v: 'Sr. UI Eng.' },
      { k: 'A11Y', v: 'WCAG' },
      { k: 'ERA', v: '2015–2018' },
    ],
    scope: [
      'Front end wired into the enterprise-level content management system.',
      'Improved download performance across the web properties.',
      'Reusable web components shared with sibling projects.',
    ],
  },
  {
    slug: 'capital-one-home-equity',
    code: 'PRJ-0x03',
    title: 'Capital One Home Equity Application',
    era: '2015–2018',
    status: 'SHIPPED',
    summary: 'Angular application flow for Capital One home equity lending.',
    description:
      'An Angular application within the Home Loans platform, built from shared components and held to WCAG accessibility guidelines.',
    stack: ['Angular', 'JavaScript', 'Unit Testing', 'WCAG'],
    image: img('capital-one-home-equity', 'Capital One Home Equity Application', 'schematic'),
    telemetry: [
      { k: 'CLIENT', v: 'Capital One' },
      { k: 'TYPE', v: 'Application' },
      { k: 'A11Y', v: 'WCAG' },
      { k: 'ERA', v: '2015–2018' },
    ],
    scope: [
      'Built on the reusable components shared with the Home Loans site.',
      'Unit-tested application flows.',
      'Accessibility guidelines integrated throughout.',
    ],
  },
  {
    slug: 'bcbs-tennessee',
    code: 'PRJ-0x04',
    title: 'BlueCross BlueShield of Tennessee',
    era: '2012–2015',
    status: 'SHIPPED',
    summary: 'Client website build delivered at iCrossing.',
    description:
      'Website work for BlueCross BlueShield of Tennessee as an iCrossing UI engineer: project setup, front-end build, and enhancements that improved functionality and speed.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    image: img('bcbs-tennessee', 'BlueCross BlueShield of Tennessee', 'telemetry'),
    telemetry: [
      { k: 'CLIENT', v: 'BCBS of TN' },
      { k: 'AGENCY', v: 'iCrossing' },
      { k: 'ROLE', v: 'UI Eng.' },
      { k: 'ERA', v: '2012–2015' },
    ],
    scope: [
      'Workflow environment set up from the beginning of the project.',
      'Bug fixes and enhancements that improved functionality and speed.',
    ],
  },
  {
    slug: 'mitsubishi-build-price',
    code: 'PRJ-0x05',
    title: 'Mitsubishi Motors Build and Price',
    // TODO: add era + agency once confirmed
    status: 'SHIPPED',
    summary: 'Vehicle configurator for building a Mitsubishi and seeing its price.',
    description:
      'An interactive build-and-price tool that walks shoppers through choosing a Mitsubishi model, trim and options with pricing updated along the way.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    image: img('mitsubishi-build-price', 'Mitsubishi Motors Build and Price', 'schematic'),
    telemetry: [
      { k: 'CLIENT', v: 'Mitsubishi' },
      { k: 'TYPE', v: 'Configurator' },
      { k: 'SECTOR', v: 'Automotive' },
      { k: 'STATUS', v: 'Shipped' },
    ],
    scope: [
      'Step-by-step model, trim and option selection.',
      'Pricing that updates as the build changes.',
    ],
  },
  {
    slug: 'thyssenkrupp-elevator',
    code: 'PRJ-0x06',
    title: 'ThyssenKrupp Elevator',
    era: '2008–2012',
    status: 'ARCHIVED',
    summary: 'Website and HTML email work delivered at Hawkeye.',
    description:
      "Built web pages and HTML emails for ThyssenKrupp Elevator at Hawkeye, working with art directors and UI designers to carry their vision through to the final build.",
    stack: ['HTML', 'CSS', 'JavaScript', 'HTML Email'],
    image: img('thyssenkrupp-elevator', 'ThyssenKrupp Elevator', 'telemetry'),
    telemetry: [
      { k: 'CLIENT', v: 'ThyssenKrupp' },
      { k: 'AGENCY', v: 'Hawkeye' },
      { k: 'ROLE', v: 'Interactive Dev' },
      { k: 'ERA', v: '2008–2012' },
    ],
    scope: [
      'Websites, landing pages and HTML emails at a rapid, quality pace.',
      'Close collaboration with art directors and UI designers.',
    ],
  },
  {
    slug: 'hawkeye-agency',
    code: 'PRJ-0x07',
    title: 'Hawkeye Agency Site',
    era: '2008–2012',
    status: 'ARCHIVED',
    summary: "Development of the agency's new website.",
    description: "Led development of Hawkeye's new agency website, translating the creative team's designs into the shipped site.",
    stack: ['HTML', 'CSS', 'JavaScript'],
    image: img('hawkeye-agency', 'Hawkeye Agency Site', 'schematic'),
    telemetry: [
      { k: 'CLIENT', v: 'Hawkeye' },
      { k: 'TYPE', v: 'Agency site' },
      { k: 'ROLE', v: 'Interactive Dev' },
      { k: 'ERA', v: '2008–2012' },
    ],
    scope: [
      "Implemented the agency's new website end to end.",
      'Design fidelity reviewed with art directors.',
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
