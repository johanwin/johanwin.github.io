/**
 * <channel-show> — a slideshow that changes images like flipping an old TV
 * channel: the picture jitters and collapses to a bright line, static fills
 * the screen, then the next image expands back with RGB-split glitch slices,
 * and a green "CH 02" on-screen display flashes in the corner.
 *
 * Markup (works without JS — the first image simply shows):
 *   <channel-show trigger="hover|auto" interval="5000" id="…">
 *     <img src="…" alt="…">               first image, loaded normally
 *     <img data-src="…" alt="…">          later images load only when needed
 *   </channel-show>
 *
 * trigger="hover"  plays while the closest link (or the element) is hovered —
 *                  used on project cards so seven cards don't all flicker at once.
 * trigger="auto"   plays on its own while on screen; pauses on hover/focus.
 *                  Pair it with buttons carrying aria-controls="<id>" and
 *                  data-channel="prev|next|toggle" (WCAG 2.2.2 pause control).
 *
 * Reduced motion (OS setting or the nav "Motion" toggle): no autoplay and no
 * glitch — buttons swap instantly.
 */

const OUT_MS = 170; // old picture collapses
const IN_MS = 380; // new picture tunes in
import { motionOff, onMotionChange } from '@/lib/motion';

// OS reduce-motion or the nav "Motion" toggle (src/lib/motion.ts).
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches || motionOff();
const pad = (n: number) => String(n).padStart(2, '0');

/** Effect layers; keep in sync with <ChannelFx/> in ProjectCard.tsx. */
export const FX_MARKUP =
  '<img class="ch-ghost ch-ghost-r" alt=""><img class="ch-ghost ch-ghost-c" alt=""><span class="ch-noise"></span><span class="ch-line"></span><span class="ch-osd">CH 01</span>';

class ChannelShow extends HTMLElement {
  private imgs: HTMLImageElement[] = [];
  private index = 0;
  private timer = 0;
  private busy = false;
  private visible = false;
  private paused = false; // user pressed pause
  private held = false; // hover / focus hold (auto mode)
  private hovering = false; // hover play (hover mode)
  private io?: IntersectionObserver;
  private osd?: HTMLElement;
  private ghosts: HTMLImageElement[] = [];
  private cleanup: (() => void)[] = [];

  connectedCallback() {
    this.imgs = [...this.querySelectorAll<HTMLImageElement>(':scope > img')];
    if (this.imgs.length < 2 || this.dataset.ready) return;
    this.dataset.ready = '';

    this.imgs.forEach((img, i) => this.setActive(img, i === 0));

    // Effect layers (decorative). Rendered in the markup when the host is a
    // React island (so hydration sees the same DOM); created here otherwise.
    let fx = this.querySelector<HTMLElement>(':scope > .ch-fx');
    if (!fx) {
      fx = document.createElement('span');
      fx.className = 'ch-fx';
      fx.setAttribute('aria-hidden', 'true');
      fx.innerHTML = FX_MARKUP;
      this.append(fx);
    }
    this.ghosts = [...fx.querySelectorAll<HTMLImageElement>('.ch-ghost')];
    this.osd = fx.querySelector('.ch-osd')!;
    // OSD starts as "CH 01" in the markup — never write text here before React
    // hydrates, or the text mismatch makes React throw the card away and rebuild it.

    // Live "Motion" toggle: stop/restart autoplay and keep the pause button honest.
    this.cleanup.push(onMotionChange(() => {
      this.schedule();
      if (this.mode === 'auto') {
        this.dispatchEvent(new CustomEvent('channelpause', { bubbles: true, detail: { paused: this.paused || reduceMotion(), user: false } }));
      }
    }));

    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      this.schedule();
    });
    this.io.observe(this);

    if (this.mode === 'hover') {
      const host = this.closest<HTMLElement>('a, [data-channel-host]') ?? this;
      const on = () => { this.hovering = true; this.schedule(450); };
      const off = () => { this.hovering = false; this.schedule(); };
      host.addEventListener('pointerenter', on);
      host.addEventListener('pointerleave', off);
      this.cleanup.push(() => { host.removeEventListener('pointerenter', on); host.removeEventListener('pointerleave', off); });
    } else {
      // Auto mode: hovering or focusing the show holds it (WCAG 2.2.2).
      const hold = () => { this.held = true; this.schedule(); };
      const release = () => { this.held = false; this.schedule(); };
      const root = this.closest<HTMLElement>('[data-channel-host]') ?? this;
      root.addEventListener('pointerenter', hold);
      root.addEventListener('pointerleave', release);
      root.addEventListener('focusin', hold);
      root.addEventListener('focusout', release);
      this.cleanup.push(() => {
        root.removeEventListener('pointerenter', hold);
        root.removeEventListener('pointerleave', release);
        root.removeEventListener('focusin', hold);
        root.removeEventListener('focusout', release);
      });
      this.bindControls();
      this.bindSwipe();
    }
  }

  disconnectedCallback() {
    clearTimeout(this.timer);
    this.io?.disconnect();
    this.cleanup.forEach((fn) => fn());
    this.cleanup = [];
  }

  /* Read from attributes via differently-named getters: React 19 assigns props to
     custom elements as *properties* when a same-named property exists, and a
     getter-only `trigger` / `interval` would make that assignment throw. */
  private get mode() { return this.getAttribute('trigger') === 'hover' ? 'hover' : 'auto'; }
  private get delayMs() { return Number(this.getAttribute('interval')) || (this.mode === 'hover' ? 2200 : 5000); }

  private get playing() {
    if (!this.visible || reduceMotion()) return false;
    return this.mode === 'hover' ? this.hovering : !this.paused && !this.held;
  }

  private schedule(delay = this.delayMs) {
    clearTimeout(this.timer);
    if (this.playing) this.timer = window.setTimeout(() => this.go(this.index + 1), delay);
  }

  private setActive(img: HTMLImageElement, on: boolean) {
    img.toggleAttribute('data-active', on);
    // Only the visible image is exposed to assistive tech.
    if (on) img.removeAttribute('aria-hidden');
    else img.setAttribute('aria-hidden', 'true');
  }

  /** Load a deferred image (data-src) and wait for it to decode. */
  private async ready(img: HTMLImageElement) {
    if (img.dataset.src && !img.getAttribute('src')) img.src = img.dataset.src;
    // Cap the wait: a slow or stalled decode must never freeze the slideshow.
    try { await Promise.race([img.decode(), wait(1500)]); } catch { /* broken image: still switch */ }
  }

  /** announce = user-initiated (buttons/swipe); via says which, for analytics. */
  async go(target: number, announce = false, via?: 'button' | 'swipe') {
    if (this.busy) return;
    const n = this.imgs.length;
    const next = ((target % n) + n) % n;
    if (next === this.index) return;
    this.busy = true;
    clearTimeout(this.timer);

    const from = this.imgs[this.index];
    const to = this.imgs[next];
    await this.ready(to);
    // Warm up the one after, so the following switch is instant.
    const after = this.imgs[(next + 1) % n];
    if (after.dataset.src && !after.getAttribute('src')) after.src = after.dataset.src;

    const label = `CH ${pad(next + 1)}`;
    const swap = () => {
      this.setActive(from, false);
      this.setActive(to, true);
      this.index = next;
      if (this.osd) this.osd.textContent = label;
      // Bubbles so the analytics listener (Analytics.astro) can see it; `announce`
      // = user pressed a button, `mode` = hover (card preview) or auto (project page).
      this.dispatchEvent(new CustomEvent('channelchange', { bubbles: true, detail: { index: next, total: n, alt: to.alt, announce, via, mode: this.mode } }));
    };

    if (reduceMotion()) {
      swap();
    } else {
      this.ghosts.forEach((g) => { g.src = to.currentSrc || to.src; g.style.objectFit = getComputedStyle(to).objectFit; g.style.objectPosition = getComputedStyle(to).objectPosition; });
      this.classList.add('ch-out', 'ch-osd-on');
      await wait(OUT_MS);
      swap();
      this.classList.replace('ch-out', 'ch-in');
      await wait(IN_MS);
      this.classList.remove('ch-in');
      window.setTimeout(() => this.classList.remove('ch-osd-on'), 900);
    }

    this.busy = false;
    this.schedule();
  }

  /* ── Swipe (auto mode only; hover-mode cards are links, a swipe would fight the tap).
     Swipe left → next, right → previous. touch-action: pan-y (global.css) keeps
     vertical page scrolling native; the browser cancels the pointer when it
     takes over a scroll, so only clearly horizontal swipes switch channels. ── */
  private bindSwipe() {
    let x0 = 0, y0 = 0, t0 = 0, id: number | null = null;
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || !e.isPrimary) return;
      id = e.pointerId; x0 = e.clientX; y0 = e.clientY; t0 = performance.now();
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = null;
      const dx = e.clientX - x0, dy = e.clientY - y0;
      const fast = performance.now() - t0 < 800;
      if (fast && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        this.go(this.index + (dx < 0 ? 1 : -1), true, 'swipe');
      }
    };
    const cancel = () => { id = null; };
    this.addEventListener('pointerdown', down);
    this.addEventListener('pointerup', up);
    this.addEventListener('pointercancel', cancel);
    this.cleanup.push(() => {
      this.removeEventListener('pointerdown', down);
      this.removeEventListener('pointerup', up);
      this.removeEventListener('pointercancel', cancel);
    });
  }

  /* ── Buttons for auto mode: data-channel="prev|next|toggle" + aria-controls ── */
  private bindControls() {
    if (!this.id) return;
    const buttons = document.querySelectorAll<HTMLButtonElement>(`[aria-controls="${this.id}"][data-channel]`);
    buttons.forEach((btn) => {
      const action = btn.dataset.channel;
      const onClick = () => {
        if (action === 'next') this.go(this.index + 1, true, 'button');
        else if (action === 'prev') this.go(this.index - 1, true, 'button');
        else if (action === 'toggle') {
          this.paused = !this.paused;
          btn.setAttribute('aria-pressed', String(this.paused));
          this.dispatchEvent(new CustomEvent('channelpause', { bubbles: true, detail: { paused: this.paused, user: true } }));
          this.schedule();
        }
      };
      btn.addEventListener('click', onClick);
      this.cleanup.push(() => btn.removeEventListener('click', onClick));
    });
    // Reduced motion: never autoplays, so present the toggle as already paused.
    if (reduceMotion()) {
      this.paused = true;
      buttons.forEach((b) => b.dataset.channel === 'toggle' && b.setAttribute('aria-pressed', 'true'));
      this.dispatchEvent(new CustomEvent('channelpause', { bubbles: true, detail: { paused: true, user: false } }));
    }
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

if (!customElements.get('channel-show')) customElements.define('channel-show', ChannelShow);
