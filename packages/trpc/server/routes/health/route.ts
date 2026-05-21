import { sql } from 'drizzle-orm';
import { z, zodUndefinedModel } from '../../schema';
import { publicProcedure, router } from '../../trpc';
import { db } from '@starform/database/client';

export const healthRouter = router({
  getHealth: publicProcedure
    .meta({ openapi: { method: 'GET', path: '/health', protect: false } })
    .input(zodUndefinedModel)
    .output(
      z.object({
        status: z.literal('healthy').describe('status of the server'),
        dbConnected: z.boolean().describe('database connectivity'),
      }),
    )
    .query(async () => {
      try {
        await db.execute(sql`SELECT 1`);
        return { status: 'healthy' as const, dbConnected: true };
      } catch {
        return { status: 'healthy' as const, dbConnected: false };
      }
    }),
});
