'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormBuilderStore } from '@/store/form-builder.store';
import { useForm } from '@/modules/forms/hooks/useForms';
import { InteractiveFieldRenderer } from '@/modules/forms/components/interactive-field-renderer';
import { isFieldVisible, buildSubmissionSchema } from '@/modules/forms/schema';
import { toast } from 'sonner';

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
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-[calc(var(--radius)*1.2)] border border-border bg-card p-8 shadow-(--shadow-card)">
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
  );
}
