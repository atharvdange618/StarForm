'use client';

import { trpc } from '@/lib/trpc';

export function useFormsList() {
  return trpc.form.list.useQuery();
}

export function useForm(id: string) {
  return trpc.form.getById.useQuery({ id }, { enabled: !!id });
}

export function useFormBySlug(slug: string) {
  return trpc.form.getBySlug.useQuery({ slug }, { enabled: !!slug });
}

export function useCreateForm() {
  const utils = trpc.useUtils();
  return trpc.form.create.useMutation({
    onSuccess: () => {
      void utils.form.list.invalidate();
    },
  });
}

export function useUpdateForm() {
  const utils = trpc.useUtils();
  return trpc.form.update.useMutation({
    onSuccess: (data) => {
      void utils.form.list.invalidate();
      void utils.form.getById.invalidate({ id: data.id });
    },
  });
}

export function usePublishForm() {
  const utils = trpc.useUtils();
  return trpc.form.publish.useMutation({
    onSuccess: (data) => {
      void utils.form.list.invalidate();
      void utils.form.getById.invalidate({ id: data.id });
    },
  });
}

export function useArchiveForm() {
  const utils = trpc.useUtils();
  return trpc.form.archive.useMutation({
    onSuccess: () => {
      void utils.form.list.invalidate();
    },
  });
}

export function useCloneForm() {
  const utils = trpc.useUtils();
  return trpc.form.clone.useMutation({
    onSuccess: () => {
      void utils.form.list.invalidate();
    },
  });
}

export function useFormAnalytics(formId: string) {
  return trpc.analytics.getFormStats.useQuery({ id: formId }, { enabled: !!formId });
}

export function useSubmissionsList(formId: string, page: number) {
  return trpc.submission.list.useQuery({ formId, page }, { enabled: !!formId });
}
