'use client';

import { useState } from 'react';
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { ThemeProvider } from 'next-themes';
import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { env } from '@/lib/env';
import { getTRPCErrorMessage } from '@/lib/trpc-error';

function TRPCProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const [queryClient] = useState<QueryClient>(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError(err) {
            toast.error(getTRPCErrorMessage(err));
          },
        }),
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 30_000,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );
  const [trpcClient] = useState<ReturnType<typeof trpc.createClient>>(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${env.NEXT_PUBLIC_API_URL}/api/trpc`,
          async headers() {
            const token = await getToken();
            return token ? { Authorization: `Bearer ${token}` } : {};
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TRPCProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              closeButton: true,
            }}
          />
        </TRPCProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
