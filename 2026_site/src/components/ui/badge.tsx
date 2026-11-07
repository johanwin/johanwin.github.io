import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 border px-1.5 py-1 font-mono text-[0.6875rem] font-semibold uppercase leading-none tracking-[0.12em] whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'border-line-strong bg-transparent text-fg',
        accent: 'border-accent bg-accent text-accent-fg',
        hazard: 'border-hazard bg-hazard text-hazard-fg',
        outline: 'border-accent text-accent',
        signal: 'border-signal text-signal',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
