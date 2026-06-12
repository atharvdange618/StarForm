'use client';

import { trpc } from '@/lib/trpc';

export function useMe() {
  return trpc.user.me.useQuery();
}

export function useUserUsage() {
  return trpc.user.usage.useQuery();
}

export function useUpdatePlan() {
  const utils = trpc.useUtils();
  return trpc.user.updatePlan.useMutation({
    onSuccess: () => {
      void utils.user.me.invalidate();
      void utils.user.usage.invalidate();
    },
  });
}
