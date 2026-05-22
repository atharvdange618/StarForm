'use client';

import { useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { FormBuilder } from '@/modules/forms/components/form-builder';
import { useFormBuilderStore } from '@/store/form-builder.store';
import { useForm } from '@/modules/forms/hooks/useForms';

export default function EditFormPage() {
  const params = useParams();
  const router = useRouter();
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

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-body text-sm">Loading form...</span>
        </div>
      </div>
    );
  }

  if (isError || !form) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="font-body text-muted-foreground">Form not found</p>
        <button
          onClick={() => {
            router.push('/dashboard');
          }}
          className="font-body text-sm text-primary underline-offset-4 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <FormBuilder
      existingFormId={id}
      onPublished={() => {
        router.push('/dashboard');
      }}
    />
  );
}
