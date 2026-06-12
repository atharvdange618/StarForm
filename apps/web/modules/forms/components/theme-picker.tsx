'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

interface ThemePickerProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

interface ThemeItem {
  id: string;
  name: string;
  config: unknown;
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
  const { data: usage } = trpc.user.usage.useQuery();

  const [themeName, setThemeName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const utils = trpc.useUtils();
  const createThemeMutation = trpc.theme.create.useMutation({
    onSuccess: (newTheme) => {
      void utils.theme.list.invalidate();
      toast.success('Custom theme created successfully!');
      setIsDialogOpen(false);
      setThemeName('');
      setPrimaryColor('#3b82f6');
      setBgColor('#ffffff');
      if (newTheme) {
        onSelect(newTheme.id);
      }
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create theme');
    },
  });

  const handleCreateTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!themeName.trim()) return;

    createThemeMutation.mutate({
      name: themeName.trim(),
      config: {
        colors: {
          primary: primaryColor,
          background: bgColor,
          secondary: '#f3f4f6',
          text: '#1f2937',
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter',
        },
      },
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-28 rounded-md" />
        ))}
      </div>
    );
  }

  const hasCustomThemeAccess = usage?.customThemes ?? false;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {(themes as ThemeItem[] | undefined)?.map((theme) => {
        const name = theme.name.toLowerCase();
        const preview = themePreviewStyles[name];
        const isSelected = selectedId === theme.id;
        const themeConfig = theme.config as
          | {
              colors?: { primary?: string; background?: string };
            }
          | undefined;

        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => {
              onSelect(isSelected ? null : theme.id);
            }}
            className={cn(
              'group relative flex flex-col items-center justify-center gap-2 rounded-md border-2 p-4 transition-all min-h-29',
              isSelected
                ? 'border-primary bg-primary/5 shadow-(--shadow-primary)'
                : 'border-border bg-card hover:border-primary/50',
            )}
          >
            {isSelected ? (
              <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            ) : null}

            {preview ? (
              <>
                <div className={cn('h-12 w-full rounded-lg bg-linear-to-br', preview.bg)}>
                  <div className={cn('mx-auto mt-3 h-2 w-12 rounded-full', preview.accent)} />
                </div>
                <span className="font-body text-xs text-foreground">{preview.label}</span>
              </>
            ) : (
              <>
                <div
                  className="h-12 w-full rounded-lg flex items-center justify-center border border-border"
                  style={{ backgroundColor: themeConfig?.colors?.background || '#f9fafb' }}
                >
                  <div
                    className="h-2 w-12 rounded-full"
                    style={{ backgroundColor: themeConfig?.colors?.primary || '#3b82f6' }}
                  />
                </div>
                <span className="font-body text-xs text-foreground">{theme.name}</span>
              </>
            )}
          </button>
        );
      })}

      {hasCustomThemeAccess && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="group relative flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border p-4 bg-card hover:border-primary/50 transition-all min-h-29"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                <Plus className="h-5 w-5" />
              </div>
              <span className="font-body text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                Create Theme
              </span>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Custom Theme</DialogTitle>
              <DialogDescription>
                Customize colors to build a signature look for your forms.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTheme} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="theme-name">Theme Name</Label>
                <Input
                  id="theme-name"
                  placeholder="e.g. Lavender Glow"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-9 w-12 p-0.5 cursor-pointer"
                    />
                    <span className="font-mono text-xs uppercase">{primaryColor}</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-9 w-12 p-0.5 cursor-pointer"
                    />
                    <span className="font-mono text-xs uppercase">{bgColor}</span>
                  </div>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={createThemeMutation.isPending}>
                  {createThemeMutation.isPending ? 'Creating...' : 'Create Theme'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
