/**
 * Abbreviations that matter for context, with their expansions.
 *
 * Rendered by <Abbr>/<AbbrText> (Astro) and <AbbrText> (React) as
 *   <abbr title="Expansion"><span aria-hidden="true">ABBR</span><span class="sr-only">Expansion</span></abbr>
 * — a hover tooltip for sighted users, and the full words for screen readers.
 * (`title` alone isn't reliably announced: VoiceOver ignores it and NVDA/JAWS
 * only read it when configured to.)
 *
 * Deliberately NOT listed: well-known tech acronyms (HTML, CSS, SQL, PHP, AWS,
 * ASP.NET…). Screen readers spell them out, which is how developers know them;
 * expanding every one would just add noise.
 */
export const ABBREVIATIONS: Record<string, string> = {
  // labels
  LOC: 'Location',
  YRS: 'Years',
  A11Y: 'Accessibility',
  A11y: 'Accessibility',
  Perf: 'Performance',
  // roles
  'Sr.': 'Senior',
  'Eng.': 'Engineer',
  SWE: 'Software Engineer',
  Dev: 'Developer',
  UI: 'User Interface',
  UX: 'User Experience',
  IT: 'Information Technology',
  // standards / systems
  WCAG: 'Web Content Accessibility Guidelines',
  HIG: 'Human Interface Guidelines',
  CMS: 'Content Management System',
  'CC BY': 'Creative Commons Attribution',
  // names / places
  BCBS: 'BlueCross BlueShield',
  TN: 'Tennessee',
  TX: 'Texas',
};

export type AbbrSegment = { text: string; title?: string };

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Longest first so "CC BY" wins over shorter overlaps. Case-sensitive on purpose
// ("IT" the acronym, never "it" the word). Boundaries: not inside a larger word.
const keys = Object.keys(ABBREVIATIONS).sort((a, b) => b.length - a.length);
const pattern = new RegExp(`(?<![A-Za-z0-9])(${keys.map(escape).join('|')})(?![A-Za-z0-9])`, 'g');

/** Split text into plain runs and known abbreviations. */
export function splitAbbr(text: string): AbbrSegment[] {
  const out: AbbrSegment[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ text: text.slice(last, i) });
    out.push({ text: m[0], title: ABBREVIATIONS[m[0]] });
    last = i + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}
