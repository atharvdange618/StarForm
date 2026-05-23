'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useFormBuilderStore } from '@/store/form-builder.store';
import { useForm } from '@/modules/forms/hooks/useForms';
import { FieldRenderer } from '@/modules/forms/components/field-renderer';

export default function PreviewFormPage() {
  const params = useParams();
  const id = params.id as string;
  const loadFromForm = useFormBuilderStore((s) => s.loadFromForm);
  const hydrated = useRef(false);

  const { data: form, isPending, isError } = useForm(id);

  useEffect(() => {
    if (!form || hydrated.current) return;
    hydrated.current = true;
    loadFromForm({
      title: form.title,
      description: form.description,
      slug: form.slug,
      fields: form.fields ?? [],
      themeId: form.themeId,
      visibility: form.visibility,
      config: form.config,
    });
  }, [form, loadFromForm]);

  const { title, description, fields } = useFormBuilderStore();
  const sortedFields = useMemo(() => [...fields].toSorted((a, b) => a.order - b.order), [fields]);

  if (isPending) {
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

        <div className="space-y-6">
          {sortedFields.length === 0 ? (
            <p className="py-8 text-center font-body text-sm text-muted-foreground">
              No fields added yet
            </p>
          ) : (
            sortedFields.map((field) => <FieldRenderer key={field.id} field={field} />)
          )}
        </div>
      </div>
    </div>
  );
}
