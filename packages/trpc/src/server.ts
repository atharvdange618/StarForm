import { initTRPC } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export interface Context {
  user: null;
}

export async function createContext(_opts: CreateExpressContextOptions): Promise<Context> {
  return { user: null };
}

const t = initTRPC.context<Context>().meta<Record<string, unknown>>().create();

export const serverRouter = t.router({
  health: t.procedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })),
});

export const publicProcedure = t.procedure;
