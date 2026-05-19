import { performance } from 'node:perf_hooks';

import { initTRPC, TRPCError } from '@trpc/server';
import { OpenApiMeta } from 'trpc-to-openapi';

import type { Context } from './context';

export const tRPCContext = initTRPC.meta<OpenApiMeta>().context<Context>().create({});

export const router = tRPCContext.router;

const loggerMiddleware = tRPCContext.middleware(async ({ ctx, path, type, next }) => {
  const start = performance.now();
  const result = await next();
  const durationMs = Math.round((performance.now() - start) * 1000) / 1000;

  const base = { event: 'trpc.call', path, type, durationMs } as const;

  if (result.ok) {
    ctx.log.info({ ...base, ok: true }, `tRPC ${type} ${path} OK ${durationMs}ms`);
  } else {
    ctx.log.error(
      { ...base, ok: false, code: result.error.code, err: result.error },
      `tRPC ${type} ${path} ERR ${result.error.code} ${durationMs}ms`,
    );
  }
  return result;
});

export const publicProcedure = tRPCContext.procedure.use(loggerMiddleware);

export const protectedProcedure = publicProcedure.use(async (opts) => {
  if (opts.ctx.user === null) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authentication required' });
  }
  return opts.next();
});
