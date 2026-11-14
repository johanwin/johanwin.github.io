import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** shadcn/ui class combiner. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Prefix an internal path with the configured base (import.meta.env.BASE_URL).
 * Works whether base is '/' (user site) or '/repo/' (project site), and whether
 * BASE_URL arrives with or without a trailing slash.
 *
 *   withBase('/projects/orbit') → '/projects/orbit'      (base '/')
 *   withBase('/projects/orbit') → '/repo/projects/orbit' (base '/repo')
 *   withBase('#contact')        → '/#contact'
 */
export function withBase(path = '/', base: string = import.meta.env.BASE_URL): string {
  if (/^(https?:|mailto:|tel:)/.test(path)) return path;
  const b = base.endsWith('/') ? base : `${base}/`;
  const p = path.replace(/^\//, '');
  return `${b}${p}`;
}

/** Zero-padded index for HUD labels: pad(3) → '03'. */
export const pad = (n: number, width = 2) => String(n).padStart(width, '0');
