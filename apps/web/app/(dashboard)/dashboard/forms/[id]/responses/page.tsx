'use client';

import { use, useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, ChevronDown, ChevronRight, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm, useSubmissionsList } from '@/modules/forms/hooks/useForms';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { env } from '@/lib/env';

const PAGE_SIZE = 20;

export default function FormResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { getToken } = useAuth();

  const { data: form, isLoading: formLoading, isError: formError } = useForm(id);
  const {
    data: submissions,
    isLoading: submissionsLoading,
    isError: submissionsError,
  } = useSubmissionsList(id, page);

  const isLoading = formLoading || submissionsLoading;
  const isError = formError || submissionsError;

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const token = await getToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/forms/${id}/responses.csv`, {
        headers,
      });
      if (!response.ok) {
        throw new Error('Failed to download CSV');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `form-${form?.slug || 'form'}-responses.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('CSV downloaded successfully');
    } catch {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const fieldLabelMap = useMemo(() => {
    if (!form?.fields) return new Map<string, string>();
    const fields = form.fields as { id: string; label: string }[];
    return new Map(fields.map((f) => [f.id, f.label]));
  }, [form?.fields]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h1 className="font-display text-xl font-light text-foreground">
          Failed to load responses
        </h1>
        <p className="mt-2 font-body text-sm text-muted-foreground">
          Could not load form responses. The form may not exist.
        </p>
        <Link href="/dashboard">
          <Button className="mt-6">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-page-enter">
      <div className="mb-6 flex items-center justify-between animate-fade-up">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon-xs">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-heading text-base font-medium text-foreground">{form.title}</h1>
            <p className="font-body text-sm text-muted-foreground">Responses</p>
          </div>
        </div>

        {submissions && submissions.length > 0 && (
          <Button
            onClick={handleExportCsv}
            disabled={isExporting}
            variant="outline"
            className="gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export CSV
          </Button>
        )}
      </div>

      {!submissions || submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up stagger-2">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <FileIcon className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-display text-xl font-light text-foreground">No responses yet</h2>
          <p className="mt-2 max-w-xs font-body text-sm text-muted-foreground">
            Responses will appear here once people start submitting your form.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 space-y-2">
            {submissions.map((submission, index) => {
              const data = submission.data as Record<string, unknown> | null;
              const isExpanded = expandedId === submission.id;
              const entries = data
                ? Object.entries(data)
                    .filter(([key]) => !key.startsWith('_'))
                    .map(
                      ([key, value]) => [fieldLabelMap.get(key) ?? key, value] as [string, unknown],
                    )
                : [];
              const preview = entries
                .slice(0, 2)
                .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`)
                .join(' \u00B7 ');

              return (
                <div
                  key={submission.id}
                  className={`animate-fade-up stagger-${Math.min(index + 1, 5)}`}
                >
                  <Card size="sm">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : submission.id)}
                      className="w-full text-left"
                    >
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-foreground">
                              {submission.id.slice(0, 8).toUpperCase()}
                            </span>
                            <span className="font-body text-xs text-muted-foreground">
                              {new Date(submission.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {!isExpanded && preview && (
                            <p className="mt-1 truncate font-body text-sm text-muted-foreground">
                              {preview}
                            </p>
                          )}
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                      </CardHeader>
                    </button>
                    {isExpanded && (
                      <CardContent className="border-t border-border">
                        <div className="space-y-3">
                          {entries.map(([key, value]) => (
                            <div key={key} className="flex justify-between gap-4 font-body text-sm">
                              <span className="shrink-0 text-muted-foreground">{key}</span>
                              <span className="text-right text-foreground">
                                {Array.isArray(value) ? value.join(', ') : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-muted-foreground">
              Page {page} &middot; {submissions.length} results
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={submissions.length < PAGE_SIZE}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
