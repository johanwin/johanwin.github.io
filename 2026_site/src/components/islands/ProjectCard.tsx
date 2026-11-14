import { useId, useState } from 'react';
import { useMotionOff } from '@/lib/useMotionOff';
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m, type Variants } from 'framer-motion';
import type { Project } from '@/data/projects';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, pad, withBase } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  index: number;
}

type View = 'capture' | 'arch';

const panel: Variants = {
  enter: { opacity: 0, clipPath: 'inset(0 0 0 100%)' },
  center: { opacity: 1, clipPath: 'inset(0 0 0 0%)', transition: { duration: 0.3, ease: [0.7, 0, 0.2, 1] } },
  exit: { opacity: 0, clipPath: 'inset(0 100% 0 0)', transition: { duration: 0.2 } },
};

const STATUS_VARIANT = {
  ACTIVE: 'signal',
  SHIPPED: 'accent',
  ARCHIVED: 'default',
} as const;

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const motionOff = useMotionOff();
  const [view, setView] = useState<View>('capture');
  const uid = useId();
  const { images } = project;
  const image = images[0]!;
  const frameLabel = image.frame === 'telemetry' ? 'Intercepted Telemetry Capture' : 'System Schematic';
  const detailHref = withBase(`/projects/${project.slug}`);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion={motionOff ? 'always' : 'user'}>
        {/*
          Entrance is a CSS scroll-driven animation (.card-in), not Framer's
          initial/whileInView: the server HTML stays fully visible for crawlers
          and no-JS readers instead of shipping as opacity:0.
        */}
        <m.article
          whileHover="hover"
          className="card-in group h-full"
          style={{ ['--card-i' as string]: index % 3 }}
          aria-labelledby={`${uid}-title`}
        >
          <Card className="h-full brackets [--bk-c:transparent] transition-[--bk-size] group-hover:[--bk-c:var(--accent)] group-hover:[--bk-size:28px] group-focus-within:[--bk-c:var(--accent)]">
            {/* ── HUD strip ───────────────────────────────── */}
            <div className="flex items-stretch border-b border-line-strong text-[0.6875rem]">
              <span aria-hidden="true" className="flex items-center bg-fg px-2 hud-label text-bg">{project.code}</span>
              {project.era && <span className="flex items-center px-2 hud-label text-muted">{project.era}</span>}
              <Badge variant={STATUS_VARIANT[project.status]} className="my-auto ml-auto mr-2">
                {project.status}
              </Badge>
            </div>

            {/* ── View toggle (tabs) ─────────────────────── */}
            <div role="tablist" aria-label={`${project.title} view`} className="relative z-10 grid grid-cols-2 border-b border-line bg-surface">
              {(
                [
                  ['capture', image.frame === 'telemetry' ? 'Capture' : 'Schematic'],
                  ['arch', 'Scope'],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${v}`}
                  aria-selected={view === v}
                  aria-controls={`${uid}-panel`}
                  tabIndex={view === v ? 0 : -1}
                  onClick={() => setView(v)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                      const next = v === 'capture' ? 'arch' : 'capture';
                      setView(next);
                      document.getElementById(`${uid}-tab-${next}`)?.focus();
                    }
                  }}
                  className={cn(
                    'min-h-10 px-3 hud-label transition-colors first:border-r first:border-line',
                    view === v ? 'bg-surface-2 text-accent' : 'text-muted hover:text-fg',
                  )}
                >
                  {view === v && <span aria-hidden="true">▸ </span>}
                  {label}
                </button>
              ))}
            </div>

            {/* ── Panel ──────────────────────────────────── */}
            <div
              id={`${uid}-panel`}
              role="tabpanel"
              aria-labelledby={`${uid}-tab-${view}`}
              className="relative z-10 aspect-[16/10] overflow-hidden border-b border-line bg-bg"
            >
              <AnimatePresence mode="wait" initial={false}>
                {view === 'capture' ? (
                  <m.div key="capture" variants={panel} initial="enter" animate="center" exit="exit" className="absolute inset-0">
                    {/*
                      The capture opens the dossier (same destination as the title).
                      It's a duplicate of the title link, so it's skipped by keyboard
                      and screen readers (tabIndex -1 + aria-hidden) to avoid a
                      redundant tab stop — the title link is the accessible one.
                    */}
                    <a
                      href={detailHref}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="group/cap absolute inset-0 block cursor-pointer"
                    >
                      <span className="lazy-media absolute! inset-0 overflow-hidden">
                        {/*
                          Hovering the capture flips through the project's screenshots
                          like changing an old TV channel. Later images load only when
                          the first switch needs them (data-src).
                        */}
                        <channel-show
                          trigger="hover"
                          className="size-full transition-transform duration-500 group-hover/cap:scale-[1.03]"
                        >
                          {images.map((im, i) => (
                            <img
                              key={im.src}
                              {...(i === 0 ? { src: withBase(im.src) } : { 'data-src': withBase(im.src) })}
                              alt=""
                              width={im.width}
                              height={im.height}
                              loading="lazy"
                              decoding="async"
                              data-fit={im.fit}
                              className="transition-opacity duration-500"
                            />
                          ))}
                          {images.length > 1 && <ChannelFx />}
                        </channel-show>
                      </span>
                      {/* CRT refresh: scanlines always, rolling band on hover */}
                      <span className="crt pointer-events-none absolute inset-0">
                        <span className="crt-roll crt-hover" />
                      </span>
                      {/* frame metadata overlay */}
                      <span className="absolute left-2 top-2 z-[4] bg-bg/85 px-1.5 py-1 hud-label text-[0.6rem] text-accent">
                        ● REC {frameLabel}{images.length > 1 && ` · ${images.length} CH`}
                      </span>
                      <span className="absolute bottom-2 right-2 z-[4] wipe absolute! bg-bg/85 px-1.5 py-1 hud-label text-[0.6rem] text-fg">
                        Open dossier →
                      </span>
                      <Crosshairs />
                    </a>
                  </m.div>
                ) : (
                  <m.div
                    key="arch"
                    variants={panel}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 overflow-auto p-4"
                  >
                    <p aria-hidden="true" className="hud-label mb-3 text-accent">// SCOPE</p>
                    <ol className="space-y-2 text-xs leading-relaxed">
                      {project.scope.map((line, i) => (
                        <li key={i} className="grid grid-cols-[2ch_1fr] gap-2">
                          <span aria-hidden="true" className="text-muted">{pad(i + 1)}</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-4 text-xs leading-relaxed text-muted">{project.description}</p>
                  </m.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Telemetry tags ─────────────────────────── */}
            <dl className="grid grid-cols-2 border-b border-line text-[0.6875rem] sm:grid-cols-4">
              {project.telemetry.map((t) => (
                <div key={t.k} className="border-r border-line px-3 py-2 last:border-r-0 [&:nth-child(2)]:max-sm:border-r-0">
                  <dt className="hud-label text-[0.58rem] text-muted">{t.k}</dt>
                  <dd className="mt-1 font-semibold tabular-nums">{t.v}</dd>
                </div>
              ))}
            </dl>

            <CardHeader>
              <CardTitle id={`${uid}-title`} style={{ viewTransitionName: `project-${project.slug}` }}>
                <a href={detailHref} className="after:absolute after:inset-0 after:content-[''] hover:text-accent focus-visible:outline-none">
                  {project.title}
                </a>
              </CardTitle>
              <CardDescription>{project.summary}</CardDescription>
            </CardHeader>

            <CardContent>
              <ul aria-label="Tech stack" className="flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <li key={s}>
                    <Badge>{s}</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>

            {/* Sits above the card's stretched title link (relative z-10). */}
            <CardFooter className="relative z-10">
              <BracketLink href={detailHref} label="Open dossier" sr={`${project.title} case study`} />
            </CardFooter>
          </Card>
        </m.article>
      </MotionConfig>
    </LazyMotion>
  );
}

/* ---------- sub-components ------------------------------------------------ */

function BracketLink({ href, label, sr }: { href: string; label: string; sr: string }) {
  return (
    <a
      href={href}
      className="wipe group/l flex min-h-11 flex-1 items-center justify-center gap-1 px-2 hud-label"
    >
      <span aria-hidden="true" className="text-accent transition-transform group-hover/l:-translate-x-0.5 group-hover/l:text-accent-fg">[</span>
      <span aria-hidden="true">{label}</span>
      <span aria-hidden="true" className="text-accent transition-transform group-hover/l:translate-x-0.5 group-hover/l:text-accent-fg">]</span>
      <span aria-hidden="true">→</span>
      <span className="sr-only">{sr}</span>
    </a>
  );
}

/* Effect layers for <channel-show>; mirrors FX_MARKUP in src/scripts/channel-show.ts. */
function ChannelFx() {
  return (
    <span className="ch-fx" aria-hidden="true">
      <img className="ch-ghost ch-ghost-r" alt="" />
      <img className="ch-ghost ch-ghost-c" alt="" />
      <span className="ch-noise" />
      <span className="ch-line" />
      <span className="ch-osd">CH 01</span>
    </span>
  );
}

function Crosshairs() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className="absolute left-1/2 top-1/2 h-6 w-px -translate-x-1/2 -translate-y-1/2 bg-accent/70" />
      <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 bg-accent/70" />
      <span className="absolute inset-3 brackets [--bk-size:10px] [--bk-w:1px] [--bk-c:var(--fg)] opacity-60" />
    </span>
  );
}
