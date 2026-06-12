import { z } from 'zod';
import { router, creatorProcedure, publicProcedure } from '../../trpc';
import { formService, quotaService } from '@starform/services';
import {
  formCreateSchema,
  formUpdateSchema,
  publishConfigSchema,
  formOutputSchema,
  zodUndefinedModel,
} from '../../schema';

export const formRouter = router({
  create: creatorProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/forms',
        tags: ['Form'],
        protect: true,
        summary: 'Create a new form',
      },
    })
    .input(formCreateSchema)
    .output(formOutputSchema)
    .mutation(async ({ ctx, input }) => {
      return await formService.create(ctx.user.userId, input);
    }),

  list: creatorProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/forms',
        tags: ['Form'],
        protect: true,
        summary: 'List your forms',
      },
    })
    .input(zodUndefinedModel)
    .output(z.array(formOutputSchema))
    .query(async ({ ctx }) => {
      return await formService.list(ctx.user.userId);
    }),

  getById: creatorProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/forms/{id}',
        tags: ['Form'],
        protect: true,
        summary: 'Get form by ID',
      },
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(formOutputSchema)
    .query(async ({ ctx, input }) => {
      return await formService.getById(input.id, ctx.user.userId);
    }),

  getBySlug: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/forms/slug/{slug}',
        tags: ['Form'],
        protect: false,
        summary: 'Get form by slug',
      },
    })
    .input(z.object({ slug: z.string() }))
    .output(formOutputSchema)
    .query(async ({ input }) => {
      return await formService.getBySlug(input.slug);
    }),

  update: creatorProcedure
    .meta({
      openapi: {
        method: 'PATCH',
        path: '/forms/{id}',
        tags: ['Form'],
        protect: true,
        summary: 'Update form details',
      },
    })
    .input(z.object({ id: z.string().uuid(), data: formUpdateSchema }))
    .output(formOutputSchema)
    .mutation(async ({ ctx, input }) => {
      return await formService.update(input.id, ctx.user.userId, input.data);
    }),

  publish: creatorProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/forms/{id}/publish',
        tags: ['Form'],
        protect: true,
        summary: 'Publish form',
      },
    })
    .input(z.object({ id: z.string().uuid(), config: publishConfigSchema }))
    .output(formOutputSchema)
    .mutation(async ({ ctx, input }) => {
      await quotaService.checkFormLimit(ctx.user.userId, ctx.user.plan);

      return await formService.publish(input.id, ctx.user.userId, input.config);
    }),

  archive: creatorProcedure
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/forms/{id}',
        tags: ['Form'],
        protect: true,
        summary: 'Archive form',
      },
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(formOutputSchema)
    .mutation(async ({ ctx, input }) => {
      return await formService.archive(input.id, ctx.user.userId);
    }),

  clone: creatorProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/forms/{id}/clone',
        tags: ['Form'],
        protect: true,
        summary: 'Clone a form',
      },
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(formOutputSchema)
    .mutation(async ({ ctx, input }) => {
      return await formService.clone(input.id, ctx.user.userId);
    }),
});
