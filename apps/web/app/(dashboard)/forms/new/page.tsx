'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/modules/forms/components/form-builder';
import { useFormBuilderStore } from '@/store/form-builder.store';

export default function NewFormPage() {
  const router = useRouter();
  const reset = useFormBuilderStore((s) => s.reset);

  useEffect(() => {
    reset();
    document.title = 'New Form | StarForm';
  }, [reset]);

  return (
    <FormBuilder
      onPublished={() => {
        router.push('/dashboard');
      }}
    />
  );
}
