import { useSyncExternalStore } from 'react';
import { MotionGlobalConfig } from 'framer-motion';
import { motionOff, onMotionChange } from './motion';

/*
 * Framer Motion's reducedMotion only drops transform/layout animation (fades
 * and clip-paths still run). When the site's motion is off, skip *all* Framer
 * animation globally. Set at module load — before any island mounts — so even
 * entrance animations on first paint are skipped, then kept in sync.
 */
if (typeof document !== 'undefined') {
  const sync = () => { MotionGlobalConfig.skipAnimations = motionOff(); };
  sync();
  onMotionChange(sync);
}

/** React view of the site motion preference (false during SSR/hydration, then live). */
export const useMotionOff = () => useSyncExternalStore(onMotionChange, motionOff, () => false);
