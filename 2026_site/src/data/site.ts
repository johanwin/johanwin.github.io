/**
 * ─── SINGLE SOURCE OF TRUTH FOR PERSONAL CONTENT ───────────────────────────
 * Everything the site says about you lives in src/data/*. Edit these files;
 * components never hard-code copy.
 */

export const site = {
  name: 'John Nguyen',
  handle: 'johanwin',
  callsign: 'JW-01',
  title: 'Senior Software Engineer',
  subtitle: 'Frontend Systems / Interface Architecture',
  location: 'Dallas–Fort Worth, TX',
  timezone: 'America/Chicago',
  email: 'whatsup@johnnguyen.org',
  domain: 'johnnguyen.net',
  /** Profile photo for the About dossier. Leave src empty to show the placeholder slot. */
  portrait: { src: '/images/profile/portrait.webp', alt: 'Portrait of John Nguyen' },
  bio: 'Two decades turning design into fast, accessible interfaces — from agency sites and HTML email to enterprise component libraries at Capital One and Allstate.',
  availability: 'Open to select opportunities',
  description:
    'Portfolio of John Nguyen — senior software engineer in Dallas–Fort Worth building reusable, accessible UI for Allstate, Capital One and more.',
} as const;

export const nav = [
  // `tone` ties each link to its section band colour (see SECTION TONES in global.css).
  { code: '01', label: 'About', href: '/#about', tone: 'about' },
  { code: '02', label: 'Projects', href: '/#projects', tone: 'projects' },
  { code: '03', label: 'Log', href: '/#experience', tone: 'log' },
  { code: '04', label: 'Contact', href: '/#contact', tone: 'contact' },
] as const;

/** track: stable analytics click_name suffix (contact_<track>). */
export type SocialLink = { label: string; href: string; channel: string; track: string };

export const socials: SocialLink[] = [
  { label: 'GitHub', channel: 'CH-01', track: 'github', href: 'https://github.com/johanwin' },
  { label: 'LinkedIn', channel: 'CH-02', track: 'linkedin', href: 'https://www.linkedin.com/in/johannguyen/' },
  { label: 'Instagram', channel: 'CH-03', track: 'instagram', href: 'https://www.instagram.com/john_nguyen/' },
  { label: 'Résumé (PDF)', channel: 'CH-04', track: 'resume', href: '/resume.pdf' },
];
