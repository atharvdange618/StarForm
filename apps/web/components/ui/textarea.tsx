import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-24 w-full rounded-[var(--radius)] border border-border bg-[var(--input)] px-4 py-2.5 text-[0.9375rem] font-body text-foreground transition-all duration-200 outline-none placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:shadow-[var(--shadow-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:shadow-[var(--shadow-focus-ring)] aria-invalid:shadow-destructive/20 md:text-[0.9375rem]',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
