import { Fragment } from 'react';
import { splitAbbr } from '@/lib/abbr';

/**
 * React twin of AbbrText.astro: wraps known abbreviations (src/lib/abbr.ts) as
 * <abbr title> with a screen-reader expansion. Usage: <AbbrText text="Sr. SWE" />
 */
export function AbbrText({ text }: { text: string }) {
  return (
    <>
      {splitAbbr(text).map((s, i) =>
        s.title ? (
          <abbr key={i} title={s.title} className="cursor-help no-underline">
            <span aria-hidden="true">{s.text}</span>
            <span className="sr-only">{s.title}</span>
          </abbr>
        ) : (
          <Fragment key={i}>{s.text}</Fragment>
        ),
      )}
    </>
  );
}
