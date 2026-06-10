import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "cursor-pointer group/button inline-flex shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-transparent bg-clip-padding text-[0.9375rem] tracking-[0.04em] whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[var(--shadow-primary)] hover:shadow-[var(--shadow-primary-hover)] active:shadow-[var(--shadow-primary-active)] [a]:hover:bg-primary/80',
        subtle:
          'bg-accent/20 text-accent-foreground border border-border/50 hover:bg-accent/30 active:bg-accent/40 rounded-[var(--radius-md)]',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        ghost:
          'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 rounded-[var(--radius-lg)]',
        outline:
          'border-border bg-background text-foreground hover:bg-muted aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 rounded-[var(--radius-lg)]',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40 rounded-[var(--radius-lg)]',
        link: 'text-primary underline-offset-4 hover:underline rounded-none',
      },
      size: {
        default: 'h-10 px-6 py-2.5',
        sm: 'h-8 px-4 py-1.5 rounded-[var(--radius-sm)]',
        lg: 'h-11 px-8 py-3',
        xl: 'h-12 px-10 py-3.5',
        icon: 'size-9 rounded-[var(--radius-md)]',
        'icon-xs': "size-6 rounded-[var(--radius-xs)] [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8 rounded-[var(--radius-sm)]',
        'icon-lg': 'size-10 rounded-[var(--radius-md)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
