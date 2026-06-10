import { TRPCClientError } from '@trpc/client';

export function getTRPCErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (err instanceof TRPCClientError) {
    return err.message || fallback;
  }
  if (err instanceof Error) {
    return err.message || fallback;
  }
  return fallback;
}
