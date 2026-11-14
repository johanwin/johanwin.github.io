import type { DetailedHTMLProps, HTMLAttributes } from 'react';

/* JSX typing for the <channel-show> custom element (src/scripts/channel-show.ts). */
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'channel-show': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        trigger?: 'hover' | 'auto';
        interval?: string | number;
        'data-fit'?: string;
      };
    }
  }
}
