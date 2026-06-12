import { z } from 'zod';
import { router, creatorProcedure, publicProcedure } from '../../trpc';
import { formService, quotaService } from '@starform/services';
import {
  formCreateSchema,
  formUpdateSchema,
  publishConfigSchema,
  formOutputSchema,
  zodUndefinedModel,
  publicFormOutputSchema,
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

  listPublic: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/forms/public',
        tags: ['Form'],
        protect: false,
        summary: 'List all public forms',
      },
    })
    .input(z.object({ search: z.string().optional() }))
    .output(z.array(publicFormOutputSchema))
    .query(async ({ input }) => {
      return await formService.listPublic(input.search);
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
      const isProOrEnterprise = ctx.user.plan === 'pro' || ctx.user.plan === 'enterprise';
      const data = isProOrEnterprise
        ? input.data
        : {
            ...input.data,
            config: input.data.config
              ? { ...input.data.config, webhookUrl: null }
              : input.data.config,
          };
      return await formService.update(input.id, ctx.user.userId, data);
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
