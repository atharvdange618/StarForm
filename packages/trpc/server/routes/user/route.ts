import { z } from 'zod';
import { router, protectedProcedure } from '../../trpc';
import { userService, quotaService } from '@starform/services';
import { zodUndefinedModel, userOutputSchema, userUsageOutputSchema, planEnum } from '../../schema';
import { clerkClient } from '@clerk/express';

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
    .input(zodUndefinedModel)
    .output(userOutputSchema.optional())
    .query(async ({ ctx }) => {
      return await userService.me(ctx.user.clerkId);
    }),

  usage: protectedProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/user/usage',
        tags: ['User'],
        protect: true,
        summary: 'Get current user plan usage stats',
      },
    })
    .input(zodUndefinedModel)
    .output(userUsageOutputSchema)
    .query(async ({ ctx }) => {
      return await quotaService.getPlanUsage(ctx.user.userId, ctx.user.plan);
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
    .output(userOutputSchema.optional())
    .mutation(async ({ ctx, input }) => {
      return await userService.updateProfile(ctx.user.clerkId, input);
    }),

  updatePlan: protectedProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/user/plan',
        tags: ['User'],
        protect: true,
        summary: 'Update current user billing plan',
      },
    })
    .input(z.object({ plan: planEnum }))
    .output(userOutputSchema.optional())
    .mutation(async ({ ctx, input }) => {
      try {
        await clerkClient.users.updateUserMetadata(ctx.user.clerkId, {
          unsafeMetadata: { plan: input.plan },
        });
      } catch (err) {
        ctx.log.error({ err }, `Failed to update Clerk user plan metadata for ${ctx.user.clerkId}`);
      }
      return await userService.updatePlan(ctx.user.clerkId, input.plan);
    }),
});
