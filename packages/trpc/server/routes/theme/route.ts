import { z } from 'zod';
import { router, protectedProcedure, creatorProcedure } from '../../trpc';
import { themeService } from '@starform/services';

const themeConfigSchema = z.object({
  colors: z
    .object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
      accent: z.string().optional(),
      background: z.string().optional(),
      text: z.string().optional(),
    })
    .optional(),
  fonts: z
    .object({
      heading: z.string().optional(),
      body: z.string().optional(),
    })
    .optional(),
  animationKeyframe: z.string().optional(),
  borderStyle: z.string().optional(),
});

export const themeRouter = router({
  list: protectedProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/themes',
        tags: ['Theme'],
        protect: true,
        summary: 'List themes',
      },
    })
    .query(async ({ ctx }) => {
      return await themeService.list(ctx.user.userId);
    }),

  getById: protectedProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/themes/{id}',
        tags: ['Theme'],
        protect: true,
        summary: 'Get theme by ID',
      },
    })
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      return await themeService.getById(input.id);
    }),

  create: creatorProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/themes',
        tags: ['Theme'],
        protect: true,
        summary: 'Create custom theme',
      },
    })
    .input(
      z.object({
        name: z.string().min(1),
        config: themeConfigSchema,
        isGlobal: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await themeService.create(ctx.user.userId, {
        name: input.name,
        config: input.config,
        isGlobal: input.isGlobal || false,
      });
    }),
});
