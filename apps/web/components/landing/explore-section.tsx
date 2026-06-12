'use client';

import Link from 'next/link';
import { Compass, ExternalLink, ClipboardList, MessageSquare, User, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePublicFormsList } from '@/modules/forms/hooks/useForms';

interface DisplayForm {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  createdAt: Date | string;
  fields?: unknown[] | unknown;
  submissionCount?: number;
  creator?: { name: string | null } | null;
  isPlaceholder: boolean;
}

const badgeVariants = ['cerulean', 'lavender', 'sage', 'gold', 'rose', 'coral'] as const;

export function ExploreSection() {
  const { data: publicForms, isPending } = usePublicFormsList();

  const featuredForms = publicForms ? publicForms.slice(0, 3) : [];

  const displayForms: DisplayForm[] =
    featuredForms.length > 0
      ? featuredForms.map((f) => ({ ...f, isPlaceholder: false as const }))
      : [
          {
            id: 'template-1',
            title: 'Tech & Tooling Preferences',
            description: 'A survey to collect developer tool preferences and industry trends.',
            slug: 'tech-survey',
            createdAt: new Date(),
            fields: Array.from({ length: 6 }),
            submissionCount: 312,
            creator: { name: 'Demo Creator' },
            isPlaceholder: true,
          },
          {
            id: 'template-2',
            title: 'Customer Experience Survey',
            description:
              'Collect detailed feedback about customer satisfaction and service quality.',
            slug: 'customer-feedback',
            createdAt: new Date(),
            fields: Array.from({ length: 4 }),
            submissionCount: 84,
            creator: { name: 'StarForm Team' },
            isPlaceholder: true,
          },
          {
            id: 'template-3',
            title: 'Event RSVP & Meal Options',
            description: 'A simple RSVP form with meal selection options and guest details.',
            slug: 'rsvp-form',
            createdAt: new Date(),
            fields: Array.from({ length: 5 }),
            submissionCount: 45,
            creator: { name: 'Community Host' },
            isPlaceholder: true,
          },
        ];

  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-8 lg:px-14 pt-8 pb-8 flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-up stagger-1">
          <div className="flex flex-col gap-4">
            <span className="eyebrow inline-block">Public Showcase</span>
            <h2 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-light leading-none tracking-tight text-foreground">
              Explore shared creations
            </h2>
            <p className="font-body text-sm md:text-base text-muted-foreground max-w-[62ch]">
              Discover forms designed and published by members of our community. Fill them out to
              see them in action.
            </p>
          </div>
          <Link href="/explore" className="shrink-0">
            <Button
              variant="outline"
              className="gap-2 rounded-full border-border hover:bg-primary/10 hover:text-foreground"
            >
              <Compass className="h-4 w-4" />
              Explore All Forms
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {isPending
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <Card
                    size="sm"
                    className="flex flex-col bg-card/60 border border-border/40 h-[260px]"
                  >
                    <CardHeader className="pb-2">
                      <div className="h-5 w-2/3 bg-muted rounded mb-2" />
                      <div className="h-4 w-5/6 bg-muted rounded" />
                    </CardHeader>
                    <CardContent className="h-20 bg-muted/20 m-6 rounded" />
                  </Card>
                </div>
              ))
            : displayForms.map((form: DisplayForm, index: number) => {
                const badgeVariant = badgeVariants[index % badgeVariants.length];
                const fieldCount = Array.isArray(form.fields) ? form.fields.length : 0;
                const formattedDate = new Date(form.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <div
                    key={form.id}
                    className={`animate-fade-up stagger-${Math.min(index + 2, 5)} flex`}
                  >
                    <Card
                      size="sm"
                      className="flex flex-col flex-1 bg-card/60 backdrop-blur-sm group/form-card border border-border/40 hover:border-primary/40"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start gap-4">
                          <CardTitle className="line-clamp-1 font-heading text-base font-medium group-hover/form-card:text-primary transition-colors">
                            {form.title}
                          </CardTitle>
                          <Badge variant={badgeVariant} className="shrink-0 text-[10px]">
                            {form.isPlaceholder ? 'Template' : 'Public'}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2 mt-1 text-xs">
                          {form.description || 'No description provided.'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4 pt-0 flex-1">
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
                              {form.submissionCount ?? 0}{' '}
                              {form.submissionCount === 1 ? 'response' : 'responses'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-auto flex flex-col gap-3">
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

                          <Link
                            href={form.isPlaceholder ? '/explore' : `/${form.id}/${form.slug}`}
                            target={form.isPlaceholder ? undefined : '_blank'}
                            className="w-full"
                          >
                            <Button className="w-full gap-2 text-xs" variant="default" size="sm">
                              <ExternalLink className="h-3.5 w-3.5" />
                              {form.isPlaceholder ? 'Explore templates' : 'Fill Form'}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto mt-20 px-8 lg:px-14">
        <div className="brushstroke" />
      </div>
    </section>
  );
}
