import type { ChangeType, ExperienceEntry } from '@/data/experience';
import { cn } from '@/lib/utils';
import { AbbrText } from '@/components/ui/AbbrText';

const TYPE_STYLE: Record<ChangeType, string> = {
  feat: 'text-signal',
  perf: 'text-accent',
  fix: 'text-fg',
  test: 'text-fg',
  refactor: 'text-muted',
  style: 'text-hazard',
  chore: 'text-muted',
  docs: 'text-muted',
};

const fmt = (ym: string) => (ym === 'HEAD' ? 'PRESENT' : ym.replace('-', '.'));

/**
 * Static markup — no client JS. Entries slide in with a CSS scroll-driven
 * animation (.log-in in global.css), so the HTML is always fully visible to
 * crawlers and no-JS readers, and the Reduce motion switch stops it via CSS.
 */
export default function ChangelogTimeline({ entries }: { entries: ExperienceEntry[] }) {
  return (
        <ol className="relative border-l border-line-strong">
          {entries.map((e) => (
            <li key={e.hash} className="log-in relative pb-10 pl-6 last:pb-0 sm:pl-10">
              {/* commit node */}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute -left-[7px] top-1 size-3.5 border-2 border-bg',
                  e.end === 'HEAD' ? 'bg-accent' : 'bg-line-strong',
                )}
              />

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {/* version / hash / HEAD tag are flavor — hidden from screen readers */}
                <span aria-hidden="true" className="bg-fg px-1.5 py-0.5 hud-label text-bg">{e.version}</span>
                <code aria-hidden="true" className="text-xs text-accent">{e.hash}</code>
                {e.end === 'HEAD' && (
                  <span aria-hidden="true" className="border border-signal px-1.5 py-0.5 hud-label text-[0.6rem] text-signal">HEAD → main</span>
                )}
                <span className="hud-label text-muted">
                  {e.start && (
                    <>
                      <time dateTime={e.start}>{fmt(e.start)}</time> —{' '}
                    </>
                  )}
                  {e.end === 'HEAD' ? 'PRESENT' : <time dateTime={e.end}>{fmt(e.end)}</time>}
                </span>
              </div>

              <h3 className="mt-3 text-2xl font-extrabold uppercase leading-none [font-stretch:115%] sm:text-3xl">
                <AbbrText text={e.role} />
              </h3>
              <p className="mt-1 hud-label text-muted">
                @ {e.org} <span aria-hidden="true">·</span> <AbbrText text={e.location} />
              </p>

              <ul className="mt-4 space-y-1.5 text-sm" aria-label={`Highlights at ${e.org}`}>
                {e.changes.map((c, j) => (
                  <li key={j} className="grid grid-cols-[9ch_1fr] gap-2">
                    <span aria-hidden="true" className={cn('font-semibold', TYPE_STYLE[c.type])}>
                      {c.type}
                      <span className="text-muted">:</span>
                    </span>
                    <span><AbbrText text={c.text} /></span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
  );
}
