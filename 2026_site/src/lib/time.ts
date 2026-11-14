import { site } from '@/data/site';

/**
 * Current calendar year in the site's home time zone (America/Chicago), not the
 * build machine's. GitHub's runners are on UTC, so at 6pm Chicago time on Dec 31
 * a plain `new Date().getFullYear()` would already report next year.
 */
export const yearIn = (timeZone: string = site.timezone, date: Date = new Date()): number =>
  Number(new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric' }).format(date));
