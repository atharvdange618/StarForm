'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

export function useSubmitForm(slug: string) {
  const router = useRouter();

  return trpc.submission.submit.useMutation({
    onSuccess: (data) => {
      localStorage.removeItem(`starform-draft-${slug}`);
      toast.success('Form submitted successfully!');
      router.push(`/${slug}/receipt/${data.id}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit form');
    },
  });
}
