'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Compass,
  ExternalLink,
  MessageSquare,
  ClipboardList,
  User,
  Calendar,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePublicFormsList } from '@/modules/forms/hooks/useForms';
import Atmosphere from '@/components/atmosphere';
import type { PublicForm } from '@starform/trpc/server';

const colorVariants = ['cerulean', 'lavender', 'sage', 'gold', 'rose', 'coral'] as const;
type ColorVariant = (typeof colorVariants)[number];

function FormCardSkeleton() {
  return (
    <Card size="sm" className="flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="h-4 w-3/4 mt-2" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0">
        <div className="flex gap-3 mt-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="pt-4 border-t border-border/40 flex items-center justify-between">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3.5 w-16" />
        </div>
        <Skeleton className="h-8 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl bg-card/30 w-full col-span-full animate-fade-up stagger-1">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Compass className="h-7 w-7 text-primary animate-pulse" />
      </div>
      <h3 className="font-display text-xl font-light text-foreground">No public forms found</h3>
      <p className="mt-2 max-w-xs font-body text-sm text-muted-foreground">
        Try adjusting your search terms or create a public form of your own!
      </p>
    </div>
  );
}

export default function ExploreClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: forms, isPending, isError, error } = usePublicFormsList(debouncedSearch);

  const formattedForms = useMemo<PublicForm[]>(() => {
    if (!forms) return [];
    return forms;
  }, [forms]);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <Atmosphere />
      <div className="mx-auto max-w-5xl px-4 py-8 relative z-10 flex flex-col gap-8">
        <div className="flex flex-col gap-2 animate-fade-up stagger-1">
          <h1 className="font-display text-3xl md:text-4xl font-light text-foreground tracking-tight text-wrap">
            Explore public forms
          </h1>
          <p className="font-body text-sm md:text-base text-muted-foreground max-w-[62ch]">
            Browse and fill beautiful, custom-designed forms shared publicly by members of our
            community.
          </p>
        </div>

        <div className="relative flex items-center w-full max-w-md animate-fade-up stagger-2">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground/60" />
          <Input
            type="text"
            placeholder="Search public forms..."
            className="pl-10 w-full shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isPending ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <FormCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center w-full col-span-full">
            <h3 className="font-display text-xl font-light text-foreground">
              Failed to load public forms
            </h3>
            <p className="mt-2 font-body text-sm text-muted-foreground">{error?.message}</p>
          </div>
        ) : formattedForms.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {formattedForms.map((form, index) => {
              const badgeVariant: ColorVariant =
                colorVariants[index % colorVariants.length] ?? 'cerulean';
              const fieldCount = Array.isArray(form.fields as unknown[])
                ? (form.fields as unknown[]).length
                : 0;
              const formattedDate = new Date(form.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={form.id}
                  className={`animate-fade-up stagger-${Math.min((index % 5) + 1, 5)}`}
                >
                  <Card size="sm" className="flex flex-col group/form-card">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start gap-4">
                        <CardTitle className="line-clamp-1 font-heading text-base font-medium group-hover/form-card:text-primary transition-colors">
                          {form.title}
                        </CardTitle>
                        <Badge variant={badgeVariant} className="shrink-0 text-[10px]">
                          Public
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2 mt-1 text-xs min-h-10">
                        {form.description || 'No description provided.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 pt-0">
                      <div className="flex flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-sm">
                          <ClipboardList className="h-3.5 w-3.5" />
                          <span>
                            {fieldCount} {fieldCount === 1 ? 'question' : 'questions'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-sm">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>
                            {(form.submissionCount ?? 0) === 1
                              ? '1 response'
                              : `${form.submissionCount ?? 0} responses`}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body max-w-[150px] truncate">
                          <User className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate" title={form.creator?.name || 'Anonymous'}>
                            {form.creator?.name || 'Anonymous'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-body shrink-0">
                          <Calendar className="h-3 w-3" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>

                      <Link href={`/${form.id}/${form.slug}`} target="_blank" className="w-full">
                        <Button className="w-full gap-2 text-xs" variant="default" size="sm">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Fill Form
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
