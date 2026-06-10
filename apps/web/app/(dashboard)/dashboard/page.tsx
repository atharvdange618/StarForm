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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFormsList, useArchiveForm, useCloneForm } from '@/modules/forms/hooks/useForms';
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
    <div className="flex flex-col items-center justify-center py-16 text-center">
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
  const { data, isPending, isError, error } = useFormsList();
  const forms = data as Form[] | undefined;
  const archiveMutation = useArchiveForm();
  const cloneMutation = useCloneForm();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

  if (isPending) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Skeleton className="h-7 w-40" />
            <Skeleton className="mt-2 h-4 w-60" />
          </div>
        </div>
        <div className="mb-6 grid grid-cols-3 gap-4">
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

  if (!forms || forms.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <EmptyState />
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

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="animate-fade-up stagger-1">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground">Total Forms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl font-light text-foreground">{forms.length}</p>
            </CardContent>
          </Card>
        </div>
        <div className="animate-fade-up stagger-2">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl font-light text-foreground">{publishedCount}</p>
            </CardContent>
          </Card>
        </div>
        <div className="animate-fade-up stagger-3">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-xs text-muted-foreground">Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl font-light text-foreground">{totalSubmissions}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-3">
        {forms.map((form, index) => {
          const status = statusConfig[form.status] ?? statusConfig.draft;
          const StatusIcon = status.icon;
          return (
            <div key={form.id} className={`animate-fade-up stagger-${Math.min(index + 1, 5)}`}>
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
    </div>
  );
}
