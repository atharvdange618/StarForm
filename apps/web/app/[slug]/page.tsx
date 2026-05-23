'use client';

import { use, useMemo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormBySlug } from '@/modules/forms/hooks/useForms';
import { useSubmitForm } from '@/modules/forms/hooks/useSubmitForm';
import { useAutoSave } from '@/modules/forms/hooks/useAutoSave';
import { InteractiveFieldRenderer } from '@/modules/forms/components/interactive-field-renderer';
import { buildSubmissionSchema, type SchematicField } from '@/modules/forms/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, Lock, AlertCircle } from 'lucide-react';

export default function FormFillerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: form, isLoading, error: fetchError } = useFormBySlug(slug);

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVerified, setPasswordVerified] = useState(false);

  const config = (form?.config as Record<string, unknown>) ?? {};
  const formPassword = config.password as string | undefined;
  const requiresPassword = Boolean(formPassword) && !passwordVerified;
  const hasEmailField = form?.fields?.some((f: { type: string }) => f.type === 'email') ?? false;

  const themeClass = useMemo(() => {
    const theme = form?.theme as { name: string } | undefined;
    if (!theme?.name) return 'theme-startup';
    return `theme-${theme.name.toLowerCase()}`;
  }, [form?.theme]);

  const renderThemeEffects = useCallback(() => {
    if (themeClass === 'theme-space') {
      return <div className="stars" />;
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
    return null;
  }, [themeClass]);

  const fields = useMemo(
    () => (form?.fields ? (form.fields as SchematicField[]) : []),
    [form?.fields],
  );

  const dynamicSchema = useMemo(
    () => (fields.length > 0 ? buildSubmissionSchema(fields) : null),
    [fields],
  );

  const { restoreDraft, clearDraft } = useAutoSave(
    slug,
    () =>
      ({
        // Values are read directly via form state
      }) as Record<string, unknown>,
  );

  const draft = useMemo(() => restoreDraft(), [restoreDraft]);

  const formMethods = useForm<Record<string, unknown>>({
    resolver: dynamicSchema ? zodResolver(dynamicSchema) : undefined,
    defaultValues: draft ?? {},
  });

  const { register, handleSubmit, control, formState, watch, reset } = formMethods;
  const { errors, isSubmitting } = formState;

  const submitMutation = useSubmitForm(slug);

  // Auto-save: capture form values on each change
  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedValues = watch();
  useAutoSave(slug, () => watchedValues);

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === formPassword) {
      setPasswordVerified(true);
      localStorage.setItem(`starform-access-${slug}`, 'true');
    } else {
      setPasswordError('Incorrect password');
    }
  }

  const onSubmit = (data: Record<string, unknown>) => {
    // Force number fields to be numbers
    for (const field of fields) {
      if (field.type === 'number' && data[field.id] !== undefined && data[field.id] !== '') {
        data[field.id] = Number(data[field.id]);
      }
      // MultiSelect: ensure array
      if (field.type === 'multiSelect' && !Array.isArray(data[field.id])) {
        data[field.id] = data[field.id] ? [data[field.id]] : [];
      }
    }

    submitMutation.mutate(
      { slug, data },
      {
        onSuccess: () => {
          reset();
          clearDraft();
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-lg space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (fetchError || !form) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h1 className="font-heading text-2xl font-semibold text-foreground">Form Not Found</h1>
          <p className="mt-2 font-body text-muted-foreground">
            This form doesn&apos;t exist or hasn&apos;t been published yet.
          </p>
        </div>
      </div>
    );
  }

  if (requiresPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <Lock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h1 className="font-heading text-2xl font-semibold text-foreground">{form.title}</h1>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              This form is password protected. Enter the password to continue.
            </p>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body text-sm" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="Enter form password"
                className="font-body"
              />
              {passwordError && (
                <p className="font-body text-xs text-destructive">{passwordError}</p>
              )}
            </div>
            <Button type="submit" className="btn-primary w-full">
              Continue
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-background px-4 py-12">
      <div
        className={`${themeClass} relative w-full max-w-lg overflow-hidden rounded-[calc(var(--radius)*1.2)] border border-border p-8 shadow-(--shadow-card)`}
      >
        {renderThemeEffects()}
        <div className="relative z-10 space-y-8">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-semibold text-foreground">{form.title}</h1>
            {form.description && (
              <p className="mt-2 font-body text-muted-foreground">{form.description}</p>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {fields
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <InteractiveFieldRenderer
                  key={field.id}
                  field={{
                    id: field.id,
                    type: field.type,
                    label: field.label,
                    required: field.required,
                    config: field.config as {
                      options?: string[];
                      maxLength?: number;
                      min?: number | string;
                      max?: number | string;
                      pattern?: string;
                      step?: number;
                    },
                    order: field.order,
                  }}
                  register={register}
                  control={control}
                  errors={errors}
                />
              ))}

            {hasEmailField && (
              <label className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-primary"
                  {...register('_sendEmailCopy')}
                />
                <span className="font-body text-sm text-foreground">
                  Email me a copy of my responses
                </span>
              </label>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || submitMutation.isPending}
              className="btn-primary w-full"
            >
              {submitMutation.isPending ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
