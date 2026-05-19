'use client';

import { trpc } from '@/lib/trpc';

export function TRPCExample() {
  const health = trpc.health.getHealth.useQuery();

  return (
    <div className="mt-12 text-center">
      <h3 className="mb-2 text-lg font-semibold text-foreground">API Status</h3>
      {health.isLoading && <p className="text-muted-foreground">checking...</p>}
      {health.isError && (
        <p className="text-destructive">API unreachable: {health.error.message}</p>
      )}
      {health.data && (
        <p className="text-green-600 dark:text-green-400">
          Server is <span className="font-medium capitalize">{health.data.status}</span>
        </p>
      )}
    </div>
  );
}
