import * as React from 'react';

import { cn } from '@/lib/utils';

function Card({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<'div'> & { size?: 'default' | 'sm' | 'hero' }) {
  const sizeClasses = {
    default: 'rounded-[var(--radius-xl)] py-8 gap-6',
    sm: 'rounded-[var(--radius-lg)] py-6 gap-4',
    hero: 'rounded-[var(--radius-3xl)] py-10 gap-8',
  };

  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        'group/card flex flex-col overflow-hidden bg-card border border-border text-[0.9375rem] font-body text-card-foreground',
        'shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) hover:translate-y-[-2px]',
        'transition-all duration-(--duration-normal)',
        'has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-2 px-8',
        'group-data-[size=sm]/card:px-6 group-data-[size=hero]/card:px-10',
        'has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4',
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'font-display text-xl font-medium tracking-tight text-balance group-data-[size=sm]/card:text-lg group-data-[size=hero]/card:text-2xl',
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm/relaxed text-muted-foreground font-body', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        'px-8 group-data-[size=sm]/card:px-6 group-data-[size=hero]/card:px-10',
        className,
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'flex items-center border-t p-8 group-data-[size=sm]/card:p-6 group-data-[size=hero]/card:p-10',
        className,
      )}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
