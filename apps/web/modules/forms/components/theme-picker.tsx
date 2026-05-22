'use client';

import { trpc } from '@/lib/trpc';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ThemePickerProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const themePreviewStyles: Record<string, { bg: string; accent: string; label: string }> = {
  startup: { bg: 'from-sky-100 to-blue-200', accent: 'bg-blue-500', label: 'Clean & Blue' },
  anime: { bg: 'from-pink-100 to-rose-200', accent: 'bg-pink-400', label: 'Cherry Blossom' },
  gaming: { bg: 'from-green-900 to-emerald-800', accent: 'bg-green-400', label: 'Neon Gaming' },
  space: { bg: 'from-purple-900 to-indigo-900', accent: 'bg-purple-400', label: 'Deep Space' },
  retro: { bg: 'from-amber-900 to-yellow-800', accent: 'bg-amber-400', label: 'CRT Retro' },
};

export function ThemePicker({ selectedId, onSelect }: ThemePickerProps) {
  const { data: themes, isLoading } = trpc.theme.list.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-28 rounded-[calc(var(--radius)*0.8)]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {themes?.map((theme) => {
        const name = theme.name.toLowerCase();
        const preview = themePreviewStyles[name] ?? {
          bg: 'from-gray-100 to-gray-200',
          accent: 'bg-gray-400',
          label: theme.name,
        };
        const isSelected = selectedId === theme.id;

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => {
              onSelect(isSelected ? null : theme.id);
            }}
            className={cn(
              'group relative flex flex-col items-center justify-center gap-2 rounded-[calc(var(--radius)*0.8)] border-2 p-4 transition-all',
              isSelected
                ? 'border-primary bg-primary/5 shadow-(--shadow-primary-glow)'
                : 'border-border bg-card hover:border-primary/50',
            )}
          >
            {isSelected ? (
              <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            ) : null}
            <div className={cn('h-12 w-full rounded-lg bg-linear-to-br', preview.bg)}>
              <div className={cn('mx-auto mt-3 h-2 w-12 rounded-full', preview.accent)} />
            </div>
            <span className="font-body text-xs text-foreground">{preview.label}</span>
          </button>
        );
      })}
    </div>
  );
}
