export type ProjectImage = {
  /** Path relative to /public, WITHOUT the base — components apply withBase(). */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** How the capture is framed in the UI (first image of a project sets the label). */
  frame: 'telemetry' | 'schematic';
  /** Card crop. 'cover' (default) fills the frame anchored to the top — good for
   *  page screenshots; 'contain' letterboxes very wide/tall shots instead. */
  fit?: 'cover' | 'contain';
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
  /** One or more captures. Two or more play as a "channel-switch" slideshow. */
  images: ProjectImage[];
  /** Dense metadata tags rendered around the capture (keep to 4). */
  telemetry: { k: string; v: string }[];
  /** Shown in the SCOPE tab and on the case-study page. */
  scope: string[];
};

/* Real screenshots: /images/projects/<slug>-<n>.webp, listed in slideshow order. */
const shots = (
  slug: string,
  frame: ProjectImage['frame'],
  list: [alt: string, width: number, height: number, fit?: ProjectImage['fit']][],
): ProjectImage[] =>
  list.map(([alt, width, height, fit], i) => ({
    src: `/images/projects/${slug}-${i + 1}.webp`,
    alt,
    width,
    height,
    frame,
    fit,
  }));

export const projects: Project[] = [
  {
    slug: 'allstate',
    code: 'PRJ-0x01',
    title: 'Allstate',
    era: '2018–Now',
    status: 'ACTIVE',
    summary: "Enterprise front-end work for Allstate, including the Mesh library of reusable web components.",
    description:
      "A shared library of reusable web components built for Allstate's eProposal, Milewise, Roadside Services and Cross-Enterprise projects, implemented with UX designers against the company's human interface guidelines.",
    stack: ['Web Components', 'React', 'Angular', 'Unit Testing', 'WCAG'],
    images: shots('allstate', 'telemetry', [
      ['Roadside Services tow request with pickup and drop-off addresses, vehicle, payment and a live map', 1433, 831],
      ['Roadside Services mobile rescue tracker with ETA, rescue progress, assigned rescuer and map', 374, 765],
      ['Mesh vehicle card component: a 2019 Toyota Highlander marked as added', 991, 262, 'contain'],
      ['Mesh loading screen with a "Did you know?" Allstate fact and spinner', 887, 442],
      ['eProposal personalized auto and homeowners insurance summary page', 250, 640, 'contain'],
    ]),
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
    slug: 'capital-one-home-lending',
    code: 'PRJ-0x02',
    title: 'Capital One Home Lending',
    era: '2015–2018',
    status: 'SHIPPED',
    summary: "Angular front ends for Capital One's Home Loans website and home equity application.",
    description:
      "Developed and maintained Capital One's Home Loans website in Angular, integrated with the company's enterprise content management system, and built the home equity application on the same shared components — with a focus on download performance and WCAG accessibility throughout.",
    stack: ['Angular', 'JavaScript', 'Enterprise CMS', 'Unit Testing', 'WCAG'],
    images: shots('capital-one-home-lending', 'telemetry', [
      ["Capital One Home Loans homepage with a pre-qualify offer and today's mortgage rates", 1600, 1657],
      ['Pre-qualify landing page: pre-qualify in minutes with no impact to your credit score', 1600, 1558],
      ['Refinance flow step asking about the current loan', 1600, 1431],
      ['Pre-qualification form step about the home being purchased', 1542, 2000],
      ['Instant pre-qualification result page', 1474, 2000],
    ]),
    telemetry: [
      { k: 'CLIENT', v: 'Capital One' },
      { k: 'ROLE', v: 'Sr. UI Eng.' },
      { k: 'A11Y', v: 'WCAG' },
      { k: 'ERA', v: '2015–2018' },
    ],
    scope: [
      'Home Loans front end wired into the enterprise-level content management system.',
      'Home equity application built on reusable components shared across the platform.',
      'Improved download performance across the web properties.',
      'Unit-tested application flows with accessibility guidelines integrated throughout.',
    ],
  },
  {
    slug: 'bcbs-tennessee',
    code: 'PRJ-0x03',
    title: 'BlueCross BlueShield of Tennessee',
    era: '2012–2015',
    status: 'SHIPPED',
    summary: 'Client website build delivered at iCrossing.',
    description:
      'Website work for BlueCross BlueShield of Tennessee as an iCrossing UI engineer: project setup, front-end build, and enhancements that improved functionality and speed.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    images: shots('bcbs-tennessee', 'telemetry', [
      ['BlueCross BlueShield of Tennessee homepage hero: "Reality is life changes. Now what?"', 957, 533],
      ['Medicare landing page with About Medicare, Choose a Plan and For Members sections', 818, 534],
    ]),
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
    code: 'PRJ-0x04',
    title: 'Mitsubishi Motors Build and Price',
    era: '2012–2015',
    status: 'SHIPPED',
    summary: 'Vehicle configurator for building a Mitsubishi and seeing its price.',
    description:
      'An interactive build-and-price tool that walks shoppers through choosing a Mitsubishi model, trim and options with pricing updated along the way.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    images: shots('mitsubishi-build-price', 'schematic', [
      ['Build & Price page for the 2014 Lancer ES at the color selection step', 1396, 1376],
    ]),
    telemetry: [
      { k: 'CLIENT', v: 'Mitsubishi' },
      { k: 'AGENCY', v: 'iCrossing' },
      { k: 'TYPE', v: 'Configurator' },
      { k: 'ERA', v: '2012–2015' },
    ],
    scope: [
      'Step-by-step model, trim and option selection.',
      'Pricing that updates as the build changes.',
    ],
  },
  {
    slug: 'thyssenkrupp-elevator',
    code: 'PRJ-0x05',
    title: 'ThyssenKrupp Elevator',
    era: '2008–2012',
    status: 'ARCHIVED',
    summary: 'Website and HTML email work delivered at Hawkeye.',
    description:
      "Built web pages and HTML emails for ThyssenKrupp Elevator at Hawkeye, working with art directors and UI designers to carry their vision through to the final build.",
    stack: ['HTML', 'CSS', 'JavaScript', 'HTML Email'],
    images: shots('thyssenkrupp-elevator', 'telemetry', [
      ['ThyssenKrupp Dispatch Designer touch-screen configurator', 1284, 992],
    ]),
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
    code: 'PRJ-0x06',
    title: 'Hawkeye Agency Site',
    era: '2008–2012',
    status: 'ARCHIVED',
    summary: "Development of the agency's new website.",
    description: "Led development of Hawkeye's new agency website, translating the creative team's designs into the shipped site.",
    stack: ['HTML', 'CSS', 'JavaScript'],
    images: shots('hawkeye-agency', 'schematic', [
      ['Hawkeye homepage banner: "hi. we create extraordinary experiences that matter." beside team headshots', 1600, 440, 'contain'],
      ['Case-study list for Agilent and Alltel showing how Hawkeye helped each client', 1454, 886],
    ]),
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
