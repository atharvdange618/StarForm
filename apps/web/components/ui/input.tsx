import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'w-full min-w-0 rounded-[var(--radius)] border border-border bg-[var(--input)] px-4 py-2.5 text-[0.9375rem] font-body text-foreground transition-all duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-[0.9375rem] file:font-medium file:text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:shadow-[var(--shadow-focus-ring)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:shadow-[var(--shadow-focus-ring)] aria-invalid:shadow-destructive/20 md:text-[0.9375rem]',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
