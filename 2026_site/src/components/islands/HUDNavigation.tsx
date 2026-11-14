import { useEffect, useRef, useState } from 'react';
import { useMotionOff } from '@/lib/useMotionOff';
import { setMotion } from '@/lib/motion';
import { navigate } from 'astro:transitions/client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m, type Variants } from 'framer-motion';
import { cn, withBase } from '@/lib/utils';

type NavLink = { code: string; label: string; href: string; tone: string };

/** CSS var holding a link's section colour (bright, AA on every band). */
const toneVar = (tone: string) => ({ '--nav-tone': `var(--tone-${tone}-hi)` }) as React.CSSProperties;

interface HUDNavigationProps {
  links: readonly NavLink[];
  callsign: string;
  name: string;
  timezone: string;
  /** Short git SHA injected at build time; shown as a build stamp. */
  build: string;
}

/* ---------- motion presets ------------------------------------------------ */
const drawer: Variants = {
  closed: { clipPath: 'inset(0 0 100% 0)' },
  open: {
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 0.45, ease: [0.7, 0, 0.2, 1], when: 'beforeChildren', staggerChildren: 0.06 },
  },
  exit: { clipPath: 'inset(100% 0 0 0)', transition: { duration: 0.3, ease: [0.7, 0, 0.2, 1] } },
};
const drawerItem: Variants = {
  closed: { opacity: 0, x: -32 },
  open: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] } },
};
const hudStrip: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const hudCell: Variants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/* ---------- hooks --------------------------------------------------------- */
function useClock(timeZone: string) {
  // Render a stable placeholder on the server, fill in after hydration → no mismatch.
  const [now, setNow] = useState<string>('--:--:--');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timeZone]);
  return now;
}

/**
 * Highlights the nav item whose section is in view (home page only).
 * Because the header is persisted across ClientRouter navigations, the
 * observer is rebuilt on every `astro:page-load` against the new DOM.
 */
function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join('|');
  useEffect(() => {
    let io: IntersectionObserver | undefined;
    const setup = () => {
      io?.disconnect();
      setActive(null);
      const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
      if (!els.length) return;
      io = new IntersectionObserver(
        (entries) => {
          const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (hit) setActive(hit.target.id);
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
      );
      els.forEach((el) => io!.observe(el));
    };
    setup();
    document.addEventListener('astro:page-load', setup);
    return () => {
      io?.disconnect();
      document.removeEventListener('astro:page-load', setup);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
}

/* ---------- component ----------------------------------------------------- */
/** Start the logo twirl unless one is already running. */
const twirlLogo = (e: { currentTarget: HTMLElement }) => {
  const img = e.currentTarget.querySelector('img');
  if (img && !img.classList.contains('logo-twirl')) img.classList.add('logo-twirl');
};

export default function HUDNavigation({ links, callsign, name, timezone, build }: HUDNavigationProps) {
  const motionOff = useMotionOff();
  const [open, setOpen] = useState(false);
  const clock = useClock(timezone);
  const active = useScrollSpy(links.map((l) => l.href.split('#')[1] ?? ''));

  // Close the drawer when Astro swaps pages via the ClientRouter.
  useEffect(() => {
    const close = () => setOpen(false);
    document.addEventListener('astro:before-swap', close);
    return () => document.removeEventListener('astro:before-swap', close);
  }, []);

  const tzShort = timezone.split('/').pop()?.replace('_', ' ').toUpperCase();

  /*
   * Mobile drawer links: the open dialog locks page scroll, so a native hash
   * jump made while it's open lands in the wrong place. Instead, remember the
   * target, close the drawer, and scroll once its exit animation has finished
   * AND the dialog has unmounted (scroll lock released). Radix normally returns
   * focus to the menu button on unmount, which would cancel a smooth scroll in
   * flight — onCloseAutoFocus skips that when we're navigating; focus moves to
   * the target section instead.
   */
  const pending = useRef<string | null>(null);
  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // new-tab clicks behave normally
    e.preventDefault();
    pending.current = href;
    setOpen(false);
  };
  const afterExit = () => {
    // two frames: let React unmount the dialog and react-remove-scroll unlock the page
    requestAnimationFrame(() => requestAnimationFrame(flushPending));
  };
  const flushPending = () => {
    const href = pending.current;
    pending.current = null;
    if (!href) return;
    const url = new URL(href, location.href);
    if (url.pathname !== location.pathname) return void navigate(url.pathname + url.hash);
    const target = url.hash ? document.getElementById(url.hash.slice(1)) : null;
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches && !motionOff;
    history.pushState(null, '', url.hash || url.pathname);
    if (target) {
      target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      // Move focus to the section for keyboard / screen-reader users.
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    } else {
      window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    }
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion={motionOff ? 'always' : 'user'}>
        <div className="mx-auto flex h-14 max-w-7xl items-stretch border-x border-line-strong bg-bg/85 backdrop-blur-md md:h-16">
          {/* ── Unit ID ─────────────────────────────── */}
          <a
            href={withBase('/')}
            className="group flex items-center gap-3 border-r border-line-strong px-3 sm:px-4"
            aria-label={`${name} — home`}
            onPointerEnter={twirlLogo}
            onFocus={twirlLogo}
          >
            {/* Twirls on hover/focus: the class is added once and removed when the
                animation ends, so a spin always finishes upright (no snap-back). */}
            <img
              src={withBase('/logo.svg')}
              alt=""
              aria-hidden="true"
              width={28}
              height={28}
              className="size-7 shrink-0"
              onAnimationEnd={(e) => e.currentTarget.classList.remove('logo-twirl')}
            />
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="hud-label text-fg group-hover:text-accent">{name}</span>
              <span aria-hidden="true" className="hud-label text-[0.6rem] text-muted">UNIT {callsign}</span>
            </span>
          </a>

          {/* ── Live status readouts ───────────────── */}
          <m.ul
            variants={hudStrip}
            initial="hidden"
            animate="show"
            aria-hidden="true"
            className="hidden items-stretch lg:flex"
          >
            <m.li variants={hudCell} className="flex items-center gap-2 border-r border-line px-4">
              <span aria-hidden="true" className="size-2 bg-signal animate-blink" />
              <span className="hud-label text-signal">SYS NOMINAL</span>
            </m.li>
            <m.li variants={hudCell} className="flex flex-col justify-center border-r border-line px-4">
              <span className="hud-label text-[0.6rem] text-muted">{tzShort}</span>
              <time className="hud-label tabular-nums text-fg" aria-live="off">{clock}</time>
            </m.li>
            <m.li variants={hudCell} className="flex flex-col justify-center border-r border-line px-4">
              <span className="hud-label text-[0.6rem] text-muted">BUILD</span>
              <span className="hud-label text-fg">{build}</span>
            </m.li>
          </m.ul>

          {/* ── Desktop nav ─────────────────────────── */}
          <nav aria-label="Primary" className="ml-auto hidden md:flex">
            <ul className="flex items-stretch">
              {links.map((l) => {
                const id = l.href.split('#')[1];
                const isActive = active === id;
                return (
                  <li key={l.href} className="flex border-l border-line-strong" style={toneVar(l.tone)}>
                    <a
                      href={withBase(l.href)}
                      aria-current={isActive ? 'location' : undefined}
                      className={cn(
                        'relative flex items-center gap-2 px-4 hud-label transition-colors hover:bg-surface-2 hover:text-[var(--nav-tone)]',
                        isActive && 'text-[var(--nav-tone)]',
                      )}
                    >
                      <span aria-hidden="true" className={cn('size-1.5 bg-[var(--nav-tone)] transition-opacity', isActive ? 'opacity-100' : 'opacity-40')} />
                      <span aria-hidden="true" className="text-muted">{l.code}</span>
                      {l.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[var(--nav-tone)] transition-transform duration-300',
                          isActive ? 'scale-x-100' : 'scale-x-0',
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ── Reduce-motion switch (a11y setting, not a nav section) ──
               role="switch" + aria-checked: on = animations stopped site-wide
               (src/lib/motion.ts). Knob position comes from CSS on
               <html data-motion>, so it's right before React hydrates. */}
          <button
            type="button"
            role="switch"
            aria-checked={motionOff}
            title={motionOff ? 'Animations are off — click to turn them back on' : 'Stop animations on this site'}
            onClick={() => setMotion(!motionOff)}
            className="motion-switch ml-auto flex items-center gap-2 px-3 text-[0.65rem] tracking-wider text-muted hover:text-fg md:ml-2"
          >
            <span aria-hidden="true" className="motion-switch-track">
              <span className="motion-switch-knob" />
            </span>
            <span className="sr-only lg:not-sr-only">Reduce motion</span>
          </button>

          {/* ── Mobile drawer ───────────────────────── */}
          <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Trigger
              className="flex min-w-14 items-center justify-center border-l border-line-strong px-3 md:hidden"
              aria-label="Open navigation menu"
            >
              <span aria-hidden="true" className="flex w-6 flex-col gap-1.5">
                <span className="h-0.5 w-full bg-fg" />
                <span className="h-0.5 w-4 bg-accent" />
                <span className="h-0.5 w-full bg-fg" />
              </span>
            </DialogPrimitive.Trigger>

            <AnimatePresence onExitComplete={afterExit}>
              {open && (
                <DialogPrimitive.Portal forceMount>
                  <DialogPrimitive.Content
                    forceMount
                    asChild
                    aria-describedby={undefined}
                    onCloseAutoFocus={(e) => {
                      if (pending.current) e.preventDefault();
                    }}
                  >
                    <m.div
                      variants={drawer}
                      initial="closed"
                      animate="open"
                      exit="exit"
                      className="fixed inset-0 z-[70] flex flex-col bg-bg scanlines"
                    >
                      <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>

                      <div className="flex h-14 items-stretch border-b border-line-strong">
                        <span aria-hidden="true" className="flex items-center px-4 hud-label text-accent">// NAV.OVERRIDE</span>
                        <DialogPrimitive.Close className="ml-auto flex min-w-14 items-center justify-center border-l border-line-strong px-4 hud-label hover:text-accent">
                          <span aria-hidden="true">[ X ]</span>
                          <span className="sr-only">Close menu</span>
                        </DialogPrimitive.Close>
                      </div>

                      <div aria-hidden="true" className="h-3 hazard-stripes" />

                      <nav aria-label="Mobile" className="flex-1 overflow-y-auto">
                        <ul>
                          <m.li variants={drawerItem} className="border-b border-line">
                            <a href={withBase('/')} onClick={(e) => go(e, withBase('/'))} className="flex items-baseline gap-4 px-5 py-6 hover:bg-surface-2 hover:text-accent">
                              <span aria-hidden="true" className="hud-label text-muted">00</span>
                              <span className="display-wide text-[clamp(2.25rem,11vw,3.5rem)]">Home</span>
                            </a>
                          </m.li>
                          {links.map((l) => {
                            const isActive = active === l.href.split('#')[1];
                            return (
                              <m.li key={l.href} variants={drawerItem} className="border-b border-line" style={toneVar(l.tone)}>
                                <a
                                  href={withBase(l.href)}
                                  onClick={(e) => go(e, withBase(l.href))}
                                  aria-current={isActive ? 'location' : undefined}
                                  className={cn(
                                    'relative flex items-baseline gap-4 px-5 py-6 transition-colors hover:bg-surface-2 hover:text-[var(--nav-tone)]',
                                    isActive && 'text-[var(--nav-tone)]',
                                  )}
                                >
                                  {/* section colour bar: full height when active */}
                                  <span
                                    aria-hidden="true"
                                    className={cn(
                                      'absolute inset-y-0 left-0 w-1.5 bg-[var(--nav-tone)] transition-transform',
                                      isActive ? 'scale-y-100' : 'scale-y-[0.35]',
                                    )}
                                  />
                                  <span aria-hidden="true" className="hud-label text-muted">{l.code}</span>
                                  <span className="display-wide text-[clamp(2.25rem,11vw,3.5rem)]">{l.label}</span>
                                </a>
                              </m.li>
                            );
                          })}
                        </ul>
                      </nav>

                      <m.div variants={drawerItem} className="grid grid-cols-2 border-t border-line-strong">
                        <div className="border-r border-line p-4">
                          <p className="hud-label text-[0.6rem] text-muted">{tzShort}</p>
                          <p className="hud-label tabular-nums mt-1">{clock}</p>
                        </div>
                        <div className="p-4">
                          <p className="hud-label text-[0.6rem] text-muted">STATUS</p>
                          <p className="hud-label mt-1 text-signal">NOMINAL</p>
                        </div>
                      </m.div>
                    </m.div>
                  </DialogPrimitive.Content>
                </DialogPrimitive.Portal>
              )}
            </AnimatePresence>
          </DialogPrimitive.Root>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
