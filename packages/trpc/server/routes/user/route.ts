import { z } from 'zod';
import { router, protectedProcedure } from '../../trpc';
import { userService } from '@starform/services';

export const userRouter = router({
  me: protectedProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/user/me',
        tags: ['User'],
        protect: true,
        summary: 'Get current user profile',
      },
    })
    .query(async ({ ctx }) => {
      return await userService.me(ctx.user.clerkId);
    }),

  updateProfile: protectedProcedure
    .meta({
      openapi: {
        method: 'PATCH',
        path: '/user/me',
        tags: ['User'],
        protect: true,
        summary: 'Update profile',
      },
    })
    .input(z.object({ name: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return await userService.updateProfile(ctx.user.clerkId, input);
    }),
});
