/**
 * Site-wide motion preference.
 *
 * Single source of truth: `<html data-motion="off">`, set before first paint by
 * the inline script in BaseLayout from (in order) the visitor's saved choice in
 * localStorage, else their OS "reduce motion" setting. The nav toggle calls
 * `setMotion()`; everything that animates in JS reads `motionOff()` and listens
 * for MOTION_EVENT. CSS keys off the attribute (see global.css).
 */
export const MOTION_EVENT = 'motionchange';

export const motionOff = (): boolean =>
  typeof document !== 'undefined' && document.documentElement.dataset.motion === 'off';

export const setMotion = (off: boolean) => {
  (window as { __setMotion?: (off: boolean) => void }).__setMotion?.(off);
};

export const onMotionChange = (fn: () => void) => {
  document.addEventListener(MOTION_EVENT, fn);
  return () => document.removeEventListener(MOTION_EVENT, fn);
};
