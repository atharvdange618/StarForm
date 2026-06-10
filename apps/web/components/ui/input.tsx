import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full min-w-0 rounded-sm border border-border bg-input px-4 py-2.5',
        'h-11 text-[0.9375rem] font-body text-foreground',
        'transition-all duration-(--duration-normal)',
        'file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-[0.9375rem] file:font-medium file:text-foreground',
        'placeholder:text-muted-foreground/60',
        'hover:border-muted-foreground',
        'focus-visible:border-primary focus-visible:shadow-(--shadow-focus-ring) focus-visible:outline-none',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
        'aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_3px_oklch(0.6_0.17_22/0.2)]',
        'md:text-[0.9375rem]',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
