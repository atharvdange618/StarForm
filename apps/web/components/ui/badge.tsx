import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'group/badge inline-flex h-auto w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-[var(--radius-full)] border border-transparent px-3.5 py-1 text-[0.8125rem] font-body font-medium tracking-[0.04em] whitespace-nowrap transition-colors duration-[var(--duration-fast)] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3.5!',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--badge-cerulean-bg)] text-[var(--badge-cerulean-fg)] [a]:hover:opacity-80',
        secondary: 'bg-[var(--badge-sage-bg)] text-[var(--badge-sage-fg)] [a]:hover:opacity-80',
        destructive: 'bg-[var(--badge-coral-bg)] text-[var(--badge-coral-fg)] [a]:hover:opacity-80',
        outline:
          'border-border text-foreground bg-transparent [a]:hover:bg-muted [a]:hover:text-muted-foreground',
        ghost:
          'hover:bg-[var(--badge-lavender-bg)] hover:text-[var(--badge-lavender-fg)] text-foreground bg-transparent',
        link: 'text-primary underline-offset-4 hover:underline',
        cerulean: 'bg-[var(--badge-cerulean-bg)] text-[var(--badge-cerulean-fg)]',
        lavender: 'bg-[var(--badge-lavender-bg)] text-[var(--badge-lavender-fg)]',
        sage: 'bg-[var(--badge-sage-bg)] text-[var(--badge-sage-fg)]',
        gold: 'bg-[var(--badge-gold-bg)] text-[var(--badge-gold-fg)]',
        rose: 'bg-[var(--badge-rose-bg)] text-[var(--badge-rose-fg)]',
        coral: 'bg-[var(--badge-coral-bg)] text-[var(--badge-coral-fg)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
