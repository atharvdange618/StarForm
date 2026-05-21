import { z } from 'zod';
import { router, creatorProcedure } from '../../trpc';
import { analyticsService } from '@starform/services';

export const analyticsRouter = router({
  getFormStats: creatorProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/forms/{id}/analytics',
        tags: ['Analytics'],
        protect: true,
        summary: 'Get form analytics',
      },
    })
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      return await analyticsService.getFormStats(input.id);
    }),
});
