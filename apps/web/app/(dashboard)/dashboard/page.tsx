'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Eye,
  Edit,
  Copy,
  Archive,
  BarChart3,
  ExternalLink,
  MoreHorizontal,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFormsList, useArchiveForm, useCloneForm } from '@/modules/forms/hooks/useForms';
import { useUserUsage, useMe, useUpdatePlan } from '@/modules/users/hooks/useUsers';
import { toast } from 'sonner';
import type { Form } from '@starform/trpc/server';

const statusConfig = {
  draft: { label: 'Draft', variant: 'outline' as const, icon: Clock },
  published: { label: 'Published', variant: 'default' as const, icon: CheckCircle },
  archived: { label: 'Archived', variant: 'secondary' as const, icon: AlertCircle },
} as const;

function FormCardSkeleton() {
  return (
    <Card size="sm" className="flex flex-col gap-3">
      <CardHeader>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl bg-card/30">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <FileText className="h-7 w-7 text-primary" />
      </div>
      <h3 className="font-display text-xl font-light text-foreground">No forms yet</h3>
      <p className="mt-2 max-w-xs font-body text-sm text-muted-foreground">
        Create your first form and start collecting responses.
      </p>
      <Link href="/forms/new">
        <Button className="mt-6 gap-2">
          <Plus className="h-4 w-4" />
          Create Form
        </Button>
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: formsData, isPending: formsPending, isError, error } = useFormsList();
  const { data: usage, isPending: usagePending } = useUserUsage();
  const { data: profile, isPending: profilePending } = useMe();
  const updatePlanMutation = useUpdatePlan();

  const forms = formsData as Form[] | undefined;
  const archiveMutation = useArchiveForm();
  const cloneMutation = useCloneForm();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isPending = formsPending || usagePending || profilePending || updatePlanMutation.isPending;

  const publishedCount = useMemo(
    () => forms?.filter((f) => f.status === 'published').length ?? 0,
    [forms],
  );

  const totalSubmissions = useMemo(
    () => forms?.reduce((acc, f) => acc + (f.submissionCount ?? 0), 0) ?? 0,
    [forms],
  );

  const handleArchive = async (id: string) => {
    setActionLoading(id);
    try {
      await archiveMutation.mutateAsync({ id });
      toast.success('Form archived');
    } catch {
      // Handled globally
    } finally {
      setActionLoading(null);
    }
  };

  const handleClone = async (id: string) => {
    setActionLoading(id);
    try {
      await cloneMutation.mutateAsync({ id });
      toast.success('Form cloned');
    } catch {
      // Handled globally
    } finally {
      setActionLoading(null);
    }
  };

  const handlePlanChange = async (plan: 'free' | 'pro' | 'enterprise') => {
    try {
      await updatePlanMutation.mutateAsync({ plan });
      toast.success(`Plan updated to ${plan}`);
    } catch {
      // Handled globally
    }
  };

  if (isPending) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Skeleton className="h-7 w-40" />
            <Skeleton className="mt-2 h-4 w-60" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <FormCardSkeleton key={i} />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="mt-2 h-3 w-48" />
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <Skeleton className="h-1.5 w-full" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <Skeleton className="h-1.5 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
        </div>
        <h3 className="font-display text-xl font-light text-foreground">Failed to load forms</h3>
        <p className="mt-2 font-body text-sm text-muted-foreground">{error?.message}</p>
        <Button
          onClick={() => {
            router.refresh();
          }}
          className="mt-6"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-light text-foreground">Dashboard</h1>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            {publishedCount} published &middot; {totalSubmissions} total responses
          </p>
        </div>
        <Link href="/forms/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Form
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="animate-fade-up stagger-1">
              <Card size="sm">
                <CardHeader>
                  <CardTitle className="text-xs text-muted-foreground">Total Forms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-display text-2xl font-light text-foreground">
                    {forms?.length ?? 0}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="animate-fade-up stagger-2">
              <Card size="sm">
                <CardHeader>
                  <CardTitle className="text-xs text-muted-foreground">Published</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-display text-2xl font-light text-foreground">
                    {publishedCount}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="animate-fade-up stagger-3">
              <Card size="sm">
                <CardHeader>
                  <CardTitle className="text-xs text-muted-foreground">Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-display text-2xl font-light text-foreground">
                    {totalSubmissions}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {!forms || forms.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {forms.map((form, index) => {
                const status = statusConfig[form.status] ?? statusConfig.draft;
                const StatusIcon = status.icon;
                return (
                  <div
                    key={form.id}
                    className={`animate-fade-up stagger-${Math.min(index + 1, 5)}`}
                  >
                    <Card size="sm">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <CardTitle className="truncate font-heading text-sm font-medium">
                              {form.title}
                            </CardTitle>
                            <CardDescription className="mt-0.5 flex items-center gap-2">
                              <span className="font-mono text-xs">
                                /{form.id}/{form.slug}
                              </span>
                              <span className="text-muted-foreground">&middot;</span>
                              <Link
                                href={`/dashboard/forms/${form.id}/responses`}
                                className="text-xs hover:text-primary transition-colors underline decoration-dotted"
                              >
                                {form.submissionCount ?? 0} responses
                              </Link>
                            </CardDescription>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <Badge variant={status.variant} className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  disabled={actionLoading === form.id}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    router.push(`/forms/${form.id}/edit`);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {form.status === 'published' ? (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      window.open(`/${form.id}/${form.slug}`, '_blank');
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    Preview
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      router.push(`/forms/${form.id}/preview`);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                    Preview
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => {
                                    router.push(`/dashboard/forms/${form.id}/analytics`);
                                  }}
                                >
                                  <BarChart3 className="h-4 w-4" />
                                  Analytics
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    router.push(`/dashboard/forms/${form.id}/responses`);
                                  }}
                                >
                                  <FileText className="h-4 w-4" />
                                  Responses
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    void handleClone(form.id);
                                  }}
                                  disabled={actionLoading === form.id}
                                >
                                  <Copy className="h-4 w-4" />
                                  Clone
                                </DropdownMenuItem>
                                {form.status !== 'archived' ? (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      void handleArchive(form.id);
                                    }}
                                    variant="destructive"
                                    disabled={actionLoading === form.id}
                                  >
                                    <Archive className="h-4 w-4" />
                                    Archive
                                  </DropdownMenuItem>
                                ) : null}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6 animate-fade-up stagger-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Plan & Usage</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="cursor-pointer focus:outline-none">
                      <Badge
                        variant={
                          profile?.plan === 'pro'
                            ? 'default'
                            : profile?.plan === 'enterprise'
                              ? 'secondary'
                              : 'outline'
                        }
                        className="capitalize hover:bg-accent hover:text-accent-foreground transition-colors gap-1.5"
                      >
                        {profile?.plan ?? 'free'}
                        <span className="text-[9px] opacity-75">▼</span>
                      </Badge>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => void handlePlanChange('free')}
                      disabled={profile?.plan === 'free'}
                    >
                      Free Plan
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => void handlePlanChange('pro')}
                      disabled={profile?.plan === 'pro'}
                    >
                      Pro Plan
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => void handlePlanChange('enterprise')}
                      disabled={profile?.plan === 'enterprise'}
                    >
                      Enterprise Plan
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="text-xs mt-1.5 leading-relaxed">
                {profile?.plan === 'free'
                  ? 'Upgrade to Pro for unlimited forms and responses.'
                  : profile?.plan === 'pro'
                    ? 'You have access to Pro features.'
                    : 'Enterprise custom solutions.'}
              </CardDescription>
              <div className="mt-3 text-[10px] text-amber-500 font-medium bg-amber-500/10 border border-amber-500/20 rounded-md p-2 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>
                  Plan switching is enabled for <b className="font-bold">Demo Day</b> for previewing
                  features and will be removed later!.
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    Published Forms
                  </span>
                  <span className="font-medium text-foreground">
                    {usage?.forms.current} /{' '}
                    {usage?.forms.limit === -1 || usage?.forms.limit === Infinity
                      ? 'Unlimited'
                      : usage?.forms.limit}
                  </span>
                </div>
                {usage?.forms.limit !== -1 && usage?.forms.limit !== Infinity ? (
                  <Progress
                    value={((usage?.forms.current ?? 0) / (usage?.forms.limit ?? 1)) * 100}
                    className="h-1.5"
                  />
                ) : (
                  <Progress value={100} className="h-1.5 bg-primary/20" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    Monthly Submissions
                  </span>
                  <span className="font-medium text-foreground">
                    {usage?.submissions.current} /{' '}
                    {usage?.submissions.limit === -1 || usage?.submissions.limit === Infinity
                      ? 'Unlimited'
                      : usage?.submissions.limit?.toLocaleString()}
                  </span>
                </div>
                {usage?.submissions.limit !== -1 && usage?.submissions.limit !== Infinity ? (
                  <Progress
                    value={
                      ((usage?.submissions.current ?? 0) / (usage?.submissions.limit ?? 1)) * 100
                    }
                    className="h-1.5"
                  />
                ) : (
                  <Progress value={100} className="h-1.5 bg-primary/20" />
                )}
              </div>

              <div className="flex items-center justify-between border-t border-border/50 pt-4 text-xs">
                <span className="text-muted-foreground">Custom Themes</span>
                <Badge
                  variant={usage?.customThemes ? 'default' : 'outline'}
                  className="text-[10px]"
                >
                  {usage?.customThemes ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              {profile?.plan === 'free' && (
                <Button asChild size="sm" className="w-full mt-2 gap-1.5">
                  <Link href="/pricing">
                    <Zap className="h-3.5 w-3.5 fill-current" />
                    Upgrade to Pro
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
