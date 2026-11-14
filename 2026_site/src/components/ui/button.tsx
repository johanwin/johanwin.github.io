import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-[0.16em] transition-colors disabled:pointer-events-none disabled:opacity-50 min-h-11',
  {
    variants: {
      variant: {
        default: 'bg-accent text-accent-fg hover:bg-fg hover:text-bg',
        outline: 'border border-line-strong text-fg hover:border-accent hover:text-accent',
        ghost: 'text-fg hover:bg-surface-2',
        hazard: 'bg-hazard text-hazard-fg hover:bg-fg hover:text-bg',
      },
      size: {
        default: 'px-4 py-2',
        sm: 'px-3 py-1.5 min-h-9',
        lg: 'px-6 py-3 text-sm',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
