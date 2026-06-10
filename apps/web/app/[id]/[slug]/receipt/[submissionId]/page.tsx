'use client';

import { use, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFormBySlug } from '@/modules/forms/hooks/useForms';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { WarpDriveEffect, MatrixRainEffect } from '@/modules/forms/components/theme-effects';

export default function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string; slug: string; submissionId: string }>;
}) {
  const { id, slug, submissionId } = use(params);
  const router = useRouter();
  const { data: form } = useFormBySlug(id);
  const {
    data: submission,
    isLoading,
    error,
  } = trpc.submission.getById.useQuery({ id: submissionId }, { enabled: !!submissionId });

  useEffect(() => {
    if (form) {
      if (form.slug !== slug) {
        router.replace(`/${form.id}/${form.slug}/receipt/${submissionId}`);
      }
      document.title = `Submission Receipt - ${form.title} | StarForm`;
    }
  }, [form, slug, submissionId, router]);

  const themeClass = useMemo(() => {
    const theme = form?.theme as { name: string } | undefined;
    if (!theme?.name) return 'theme-startup';
    return `theme-${theme.name.toLowerCase()}`;
  }, [form?.theme]);

  const renderThemeEffects = useCallback(() => {
    if (themeClass === 'theme-space') {
      return <WarpDriveEffect />;
    }
    if (themeClass === 'theme-anime') {
      return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="sakura-petal"
              style={{
                left: `${15 + i * 16}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${8 + i * 2}s`,
              }}
            />
          ))}
        </div>
      );
    }
    if (themeClass === 'theme-gaming') {
      return <MatrixRainEffect />;
    }
    return null;
  }, [themeClass]);

  const formFields = form?.fields;
  const fieldLabelMap = useMemo(() => {
    if (!formFields) return new Map<string, string>();
    const fields = formFields as { id: string; label: string }[];
    return new Map(fields.map((f) => [f.id, f.label]));
  }, [formFields]);

  const submissionData = submission?.data;
  const dataEntries = useMemo(() => {
    if (!submissionData) return [];
    try {
      const data = submissionData as Record<string, unknown>;
      return Object.entries(data)
        .filter(([key]) => !key.startsWith('_'))
        .map(([key, value]) => [fieldLabelMap.get(key) ?? key, value] as [string, unknown]);
    } catch {
      return [];
    }
  }, [submissionData, fieldLabelMap]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-lg space-y-4">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-6 w-64 mx-auto" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h1 className="font-heading text-2xl font-semibold text-foreground">Receipt Not Found</h1>
          <p className="mt-2 font-body text-muted-foreground">
            We couldn&apos;t find this submission receipt.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => router.push(`/${id}/${form?.slug || slug}`)}
          >
            Back to form
          </Button>
        </div>
      </div>
    );
  }

  const formTitle = form?.title || 'Form';
  const submittedAt = new Date(submission.createdAt).toLocaleString();
  const config = (form?.config as Record<string, unknown>) ?? {};
  const thankYouMessage = (config.thankYouMessage as string) || 'Thank you for your response!';

  return (
    <div
      className={`${themeClass} relative flex min-h-screen items-center justify-center px-4 py-12 animate-page-enter`}
    >
      {renderThemeEffects()}
      <div className="theme-form-container relative z-10 w-full max-w-lg space-y-6 text-center">
        <div className="space-y-2">
          <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
          <h1 className="font-heading text-2xl font-semibold text-foreground">{thankYouMessage}</h1>
          <p className="font-body text-muted-foreground">
            Your response to &ldquo;{formTitle}&rdquo; has been recorded.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-base">Submission Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-left">
            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">Reference</span>
              <span className="font-medium font-mono text-foreground">
                {submission.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">Submitted</span>
              <span className="text-foreground">{submittedAt}</span>
            </div>
            {dataEntries.length > 0 && (
              <div className="border-t border-border pt-3">
                <p className="mb-2 font-body text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Your Responses
                </p>
                <div className="space-y-2">
                  {dataEntries.map(([key, value]) => (
                    <div key={key} className="flex justify-between font-body text-sm">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="max-w-48 truncate text-foreground">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={() => router.push(`/${id}/${form?.slug || slug}`)}
            className="btn-ghost"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Submit Another
          </Button>
        </div>
      </div>
    </div>
  );
}
