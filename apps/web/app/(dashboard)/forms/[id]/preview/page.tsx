'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormBuilderStore } from '@/store/form-builder.store';
import { useForm } from '@/modules/forms/hooks/useForms';
import { InteractiveFieldRenderer } from '@/modules/forms/components/interactive-field-renderer';
import { isFieldVisible, buildSubmissionSchema } from '@/modules/forms/schema';
import { toast } from 'sonner';
import { WarpDriveEffect, MatrixRainEffect } from '@/modules/forms/components/theme-effects';
import { isDarkColor } from '@/lib/utils';

export default function PreviewFormPage() {
  const params = useParams();
  const id = params.id as string;
  const loadFromForm = useFormBuilderStore((s) => s.loadFromForm);
  const [isHydrated, setIsHydrated] = useState(false);

  const { data: form, isPending, isError } = useForm(id);

  useEffect(() => {
    if (!form || isHydrated) return;
    loadFromForm({
      title: form.title,
      description: form.description,
      slug: form.slug,
      fields: form.fields ?? [],
      themeId: form.themeId,
      visibility: form.visibility,
      config: form.config,
    });
    document.title = `Preview: ${form.title} | StarForm`;
    setIsHydrated(true);
  }, [form, loadFromForm, isHydrated]);

  const { title, description, fields } = useFormBuilderStore();
  const sortedFields = useMemo(() => [...fields].toSorted((a, b) => a.order - b.order), [fields]);

  const dynamicSchema = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => (sortedFields.length > 0 ? buildSubmissionSchema(sortedFields as any) : null),
    [sortedFields],
  );

  const formMethods = useHookForm<Record<string, unknown>>({
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

  const selectedTheme = useMemo(() => {
    return (form?.theme as any) || null;
  }, [form?.theme]);

  const isBuiltIn = useMemo(() => {
    if (!selectedTheme) return true;
    return ['startup', 'anime', 'gaming', 'space', 'retro'].includes(
      selectedTheme.name.toLowerCase(),
    );
  }, [selectedTheme]);

  const themeClass = useMemo(() => {
    if (!selectedTheme) return 'theme-startup';
    return isBuiltIn ? `theme-${selectedTheme.name.toLowerCase()}` : 'theme-startup';
  }, [selectedTheme, isBuiltIn]);

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

  const customThemeStyles = useMemo(() => {
    if (!selectedTheme || isBuiltIn) return {};
    const config = selectedTheme.config as
      | {
          colors?: { primary?: string; background?: string; secondary?: string; text?: string };
          fonts?: { heading?: string; body?: string };
        }
      | undefined;
    if (!config || !config.colors) return {};

    const primaryColor = config.colors.primary || '#3b82f6';
    const bgColor = config.colors.background || '#ffffff';

    const isDark = isDarkColor(bgColor);
    const cardColor = isDark ? `color-mix(in srgb, ${bgColor} 92%, white)` : '#ffffff';
    const borderCol = isDark
      ? `color-mix(in srgb, ${bgColor} 80%, white)`
      : `color-mix(in srgb, ${bgColor} 90%, black)`;
    const textCol = isDark ? '#f9fafb' : '#1f2937';
    const mutedTextCol = isDark ? '#9ca3af' : '#6b7280';

    const isPrimaryDark = isDarkColor(primaryColor);
    const primaryForeground = isPrimaryDark ? '#ffffff' : '#111827';

    const styles: Record<string, string> = {
      '--gf-blue': primaryColor,
      '--theme-primary': primaryColor,
      '--primary': primaryColor,
      '--primary-foreground': primaryForeground,
      '--theme-btn-bg': primaryColor,
      '--theme-btn-text': primaryForeground,

      '--gf-cream': bgColor,
      '--theme-background': bgColor,
      '--background': bgColor,

      '--gf-white': cardColor,
      '--theme-card-bg': cardColor,
      '--card': cardColor,

      '--gf-cream-dark': borderCol,
      '--theme-border': borderCol,
      '--border': borderCol,

      '--gf-text': textCol,
      '--theme-text': textCol,
      '--foreground': textCol,

      '--gf-muted': mutedTextCol,
      '--theme-muted-foreground': mutedTextCol,
      '--muted-foreground': mutedTextCol,

      '--gf-blue-pale': `color-mix(in srgb, ${primaryColor} 10%, transparent)`,
      '--theme-accent': `color-mix(in srgb, ${primaryColor} 10%, transparent)`,

      '--gf-divider': borderCol,
    };

    if (config.fonts?.body) {
      styles['--font-body'] = config.fonts.body;
      styles['--theme-font-body'] = config.fonts.body;
    }
    if (config.fonts?.heading) {
      styles['--font-heading'] = config.fonts.heading;
      styles['--theme-font-heading'] = config.fonts.heading;
    }

    return styles as React.CSSProperties;
  }, [selectedTheme, isBuiltIn]);

  if (isPending || !isHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-body text-sm">Loading preview...</span>
        </div>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-body text-muted-foreground">Form not found</p>
      </div>
    );
  }

  return (
    <div
      className={`${themeClass} relative flex min-h-screen justify-center px-4 py-12 animate-page-enter`}
      style={customThemeStyles}
    >
      {renderThemeEffects()}
      <div className="relative z-10 w-full max-w-3xl animate-fade-up">
        <div className="bg-card overflow-hidden rounded-2xl border border-border shadow-(--shadow-card-hover) p-8 space-y-6">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-light text-foreground">
              {title || 'Untitled Form'}
            </h1>
            {description ? (
              <p className="mt-3 font-body text-base text-muted-foreground">{description}</p>
            ) : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit(() => {
                toast.success('Validation passed! Simulation successful.');
              })();
            }}
            className="space-y-6"
          >
            {sortedFields.length === 0 ? (
              <p className="py-8 text-center font-body text-sm text-muted-foreground">
                No fields added yet
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
  );
}
