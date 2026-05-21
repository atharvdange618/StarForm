import { z } from 'zod';
import { router, publicProcedure, creatorProcedure } from '../../trpc';
import { submissionService, formService } from '@starform/services';
import { buildSubmissionSchema, submissionOutputSchema } from '../../schema';
import { TRPCError } from '@trpc/server';
import type { FieldDefinition } from '../../schema';

export const submissionRouter = router({
  submit: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/forms/slug/{slug}/submissions',
        tags: ['Submission'],
        protect: false,
        summary: 'Submit form response',
      },
    })
    .input(
      z.object({
        slug: z.string(),
        data: z.record(z.string(), z.any()),
        respondentHash: z.string().optional(),
      }),
    )
    .output(submissionOutputSchema)
    .mutation(async ({ input }) => {
      const form = await formService.getBySlug(input.slug);

      const latestVersion = form.publishedVersion;
      if (!latestVersion) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Form has no published versions' });
      }

      const formVersion = await formService.getPublishedVersion(form.id, latestVersion);

      const dynamicSchema = buildSubmissionSchema(formVersion.fields as FieldDefinition[]);
      const parsedData = dynamicSchema.parse(input.data);

      return await submissionService.submit(
        form.id,
        formVersion.id,
        parsedData,
        input.respondentHash,
      );
    }),

  list: creatorProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/forms/{formId}/submissions',
        tags: ['Submission'],
        protect: true,
        summary: 'List submissions for a form',
      },
    })
    .input(z.object({ formId: z.string().uuid(), page: z.number().int().min(1).optional() }))
    .output(z.array(submissionOutputSchema))
    .query(async ({ ctx, input }) => {
      return await submissionService.list(input.formId, ctx.user.userId, input.page || 1, 20);
    }),

  getById: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/submissions/{id}',
        tags: ['Submission'],
        protect: false,
        summary: 'Get submission receipt',
      },
    })
    .input(z.object({ id: z.string().uuid() }))
    .output(submissionOutputSchema)
    .query(async ({ input }) => {
      return await submissionService.getById(input.id);
    }),
});
