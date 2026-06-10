'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { CheckCircle, Download, Link2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useFormBuilderStore } from '@/store/form-builder.store';
import { usePublishForm } from '@/modules/forms/hooks/useForms';
import { InteractiveFieldRenderer } from './interactive-field-renderer';
import { isFieldVisible, buildSubmissionSchema } from '@/modules/forms/schema';
import { toast } from 'sonner';
import { env } from '@/lib/env';
import { trpc } from '@/lib/trpc';
import { WarpDriveEffect, MatrixRainEffect } from './theme-effects';

interface FormPreviewStepProps {
  formId?: string;
  onPublished?: (form: { id: string; slug: string }) => void;
}

export function FormPreviewStep({ formId, onPublished }: FormPreviewStepProps) {
  const {
    title,
    description,
    fields,
    themeId,
    visibility,
    expiryDate,
    responseLimit,
    password,
    thankYouMessage,
    webhookUrl,
  } = useFormBuilderStore();
  const publishMutation = usePublishForm();
  const [published, setPublished] = useState<{ id: string; slug: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const sortedFields = useMemo(() => [...fields].toSorted((a, b) => a.order - b.order), [fields]);

  const dynamicSchema = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => (sortedFields.length > 0 ? buildSubmissionSchema(sortedFields as any) : null),
    [sortedFields],
  );

  const formMethods = useForm<Record<string, unknown>>({
    resolver: dynamicSchema ? zodResolver(dynamicSchema) : undefined,
    defaultValues: {},
  });

  const { register, handleSubmit, control, formState, watch, reset } = formMethods;
  const { errors } = formState;

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedValues = watch();

  useEffect(() => {
    reset({});
  }, [sortedFields, reset]);

  const { data: themes } = trpc.theme.list.useQuery();
  const themeClass = useMemo(() => {
    if (!themeId || !themes) return 'theme-startup';
    const theme = (themes as { id: string; name: string }[]).find((t) => t.id === themeId);
    return theme ? `theme-${theme.name.toLowerCase()}` : 'theme-startup';
  }, [themeId, themes]);

  const renderThemeEffects = useCallback(() => {
    if (themeClass === 'theme-space') {
      return <WarpDriveEffect />;
    }
    if (themeClass === 'theme-anime') {
      return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
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

  const handlePublish = async () => {
    if (!formId) return;

    try {
      const result = await publishMutation.mutateAsync({
        id: formId,
        config: {
          themeId: themeId ?? undefined,
          visibility,
          expiryDate: expiryDate ?? undefined,
          responseLimit: responseLimit ?? undefined,
          password: password || undefined,
          thankYouMessage: thankYouMessage ?? undefined,
        },
      });

      const slug = result.slug;
      setPublished({ id: result.id, slug });

      setQrCodeUrl(`${env.NEXT_PUBLIC_API_URL}/api/v1/forms/${result.id}/${slug}/qrcode`);

      toast.success('Form published!');
    } catch {
      // Handled globally
    }
  };

  const copyLink = useCallback(() => {
    if (!published) return;
    const url = `${globalThis.location.origin}/${published.id}/${published.slug}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  }, [published]);

  const downloadQr = useCallback(async () => {
    if (!qrCodeUrl) return;
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'starform-qr.png';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to download QR code');
    }
  }, [qrCodeUrl]);

  if (published) {
    const formUrl = `${globalThis.location.origin}/${published.id}/${published.slug}`;
    return (
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
        </div>

        <h2 className="font-display text-2xl font-light text-foreground">Form Published!</h2>
        <p className="mt-2 font-body text-muted-foreground">
          Your form is now live and ready to collect responses.
        </p>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2">
          <span className="max-w-65 truncate font-mono text-sm text-foreground">{formUrl}</span>
        </div>

        {qrCodeUrl ? (
          <div className="mx-auto mt-6 w-fit rounded-xl border border-border bg-card p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeUrl}
              alt="QR Code"
              width={250}
              height={250}
              className="mx-auto h-48 w-48"
            />
            <Button
              onClick={() => {
                void downloadQr();
              }}
              variant="ghost"
              className="mt-3 w-full gap-2"
            >
              <Download className="h-4 w-4" />
              Download QR Code
            </Button>
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={copyLink} variant={copied ? 'default' : 'outline'} className="gap-2">
            {copied ? <CheckCircle className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          {onPublished ? (
            <Button
              onClick={() => {
                onPublished({ id: published.id, slug: published.slug });
              }}
              className="gap-2"
            >
              Go to Dashboard
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-5 animate-fade-up">
      <div className="lg:col-span-3">
        <div
          className={`${themeClass} relative overflow-hidden rounded-xl border border-border p-8 shadow-(--shadow-card) transition-all duration-300`}
        >
          {renderThemeEffects()}
          <div className="card relative z-10 rounded-xl border border-border bg-card p-6 shadow-(--shadow-card)">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-light text-foreground">
                {title || 'Untitled Form'}
              </h2>
              {description ? (
                <p className="mt-2 font-body text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSubmit(() => {
                  toast.success('Validation passed! Simulation successful.');
                })();
              }}
              className="space-y-5"
            >
              {sortedFields.length === 0 ? (
                <p className="py-8 text-center font-body text-sm text-muted-foreground">
                  Add fields to your form to see a preview
                </p>
              ) : (
                sortedFields
                  .filter((field) =>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    isFieldVisible(field as any, watchedValues || {}, sortedFields as any),
                  )
                  .map((field) => (
                    <InteractiveFieldRenderer
                      key={field.id}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      field={field as any}
                      register={register}
                      control={control}
                      errors={errors}
                    />
                  ))
              )}

              {sortedFields.length > 0 ? (
                <div className="mt-6 flex justify-end">
                  <button type="submit" className="btn-primary w-full justify-center">
                    Submit (Simulation)
                  </button>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="sticky top-20 space-y-4 rounded-xl border border-border bg-card p-6 shadow-(--shadow-card)">
          <h3 className="font-heading text-base font-medium text-foreground">Publish Settings</h3>

          <div className="space-y-2 font-body text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Visibility</span>
              <span className="capitalize text-foreground">{visibility}</span>
            </div>
            {expiryDate ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires</span>
                <span className="text-foreground">{new Date(expiryDate).toLocaleDateString()}</span>
              </div>
            ) : null}
            {responseLimit ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Response Limit</span>
                <span className="text-foreground">{responseLimit}</span>
              </div>
            ) : null}
            {password ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Password</span>
                <span className="text-foreground">Enabled</span>
              </div>
            ) : null}
            {webhookUrl ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Webhook</span>
                <span className="text-foreground">Connected</span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fields</span>
              <span className="text-foreground">{fields.length}</span>
            </div>
          </div>

          <div className="h-px bg-border" />

          <Button
            onClick={() => {
              void handlePublish();
            }}
            className="w-full gap-2"
            disabled={!formId || fields.length === 0 || publishMutation.isPending}
          >
            {publishMutation.isPending ? 'Publishing...' : 'Publish Form'}
          </Button>

          {fields.length === 0 ? (
            <p className="text-center font-body text-xs text-destructive">
              Add at least one field to publish
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
