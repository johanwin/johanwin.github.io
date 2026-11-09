import { LazyMotion, MotionConfig, domAnimation, m, type Variants } from 'framer-motion';
import type { ChangeType, ExperienceEntry } from '@/data/experience';
import { cn } from '@/lib/utils';

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

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const entry: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1], staggerChildren: 0.05, delayChildren: 0.15 } },
};
const line: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
};

const fmt = (ym: string) => (ym === 'HEAD' ? 'PRESENT' : ym.replace('-', '.'));

export default function ChangelogTimeline({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <m.ol
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="relative border-l border-line-strong"
        >
          {entries.map((e, i) => (
            <m.li key={e.hash} variants={entry} className="relative pb-10 pl-6 last:pb-0 sm:pl-10">
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
                {e.role}
              </h3>
              <p className="mt-1 hud-label text-muted">
                @ {e.org} <span aria-hidden="true">·</span> {e.location}
              </p>

              <ul className="mt-4 space-y-1.5 text-sm" aria-label={`Highlights at ${e.org}`}>
                {e.changes.map((c, j) => (
                  <m.li key={j} variants={line} className="grid grid-cols-[9ch_1fr] gap-2">
                    <span aria-hidden="true" className={cn('font-semibold', TYPE_STYLE[c.type])}>
                      {c.type}
                      <span className="text-muted">:</span>
                    </span>
                    <span>{c.text}</span>
                  </m.li>
                ))}
              </ul>
            </m.li>
          ))}
        </m.ol>
      </MotionConfig>
    </LazyMotion>
  );
}
