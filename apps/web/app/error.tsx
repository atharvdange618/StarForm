'use client';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="text-[4rem] font-display font-bold text-cerulean-300">Oops!</div>
      <h2 className="font-body text-xl text-slate-600">Something went wrong</h2>
      <p className="max-w-md font-body text-slate-500">
        {error.message || 'An unexpected error occurred'}
      </p>
      <Button onClick={reset} className="mt-4 rounded-full px-6">
        Try Again
      </Button>
    </div>
  );
}
