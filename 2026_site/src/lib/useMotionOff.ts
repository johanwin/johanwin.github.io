import { useSyncExternalStore } from 'react';
import { motionOff, onMotionChange } from './motion';

/**
 * React view of the site motion preference (false during SSR/hydration, then live).
 * All animation on the site is CSS, which the Reduce motion switch stops via
 * html[data-motion="off"]; components use this only for JS-driven behavior
 * such as smooth scrolling and the switch's own state.
 */
export const useMotionOff = () => useSyncExternalStore(onMotionChange, motionOff, () => false);
