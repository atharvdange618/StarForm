import { eq, and, desc, count } from 'drizzle-orm';
import { db } from '@starform/database/client';
import { submissions, forms } from '@starform/database';
import { TRPCError } from '@trpc/server';

export async function submit(
  formId: string,
  formVersionId: string,
  data: Record<string, unknown>,
  respondentHash?: string,
) {
  return await db.transaction(async (tx) => {
    if (respondentHash) {
      const existing = await tx.query.submissions.findFirst({
        where: and(eq(submissions.formId, formId), eq(submissions.respondentHash, respondentHash)),
      });
      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'You have already submitted this form',
        });
      }
    }

    const form = await tx.query.forms.findFirst({
      where: eq(forms.id, formId),
    });

    if (!form) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Form not found' });
    }

    if (form.status !== 'published') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Form is not published' });
    }

    const config = (form.config || {}) as { responseLimit?: number; expiryDate?: string };

    let currentCount = 0;
    if (config.responseLimit) {
      const [result] = await tx
        .select({ value: count() })
        .from(submissions)
        .where(eq(submissions.formId, formId));
      currentCount = result?.value ?? 0;
      if (currentCount >= config.responseLimit) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Form has reached its response limit',
        });
      }
    }

    if (config.expiryDate && new Date(config.expiryDate) < new Date()) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Form has expired' });
    }

    const [submission] = await tx
      .insert(submissions)
      .values({
        formId,
        formVersionId,
        data,
        respondentHash,
      })
      .returning();

    if (!submission) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create submission',
      });
    }

    void import('./webhook.service').then((m) => m.notify(formId, submission));

    const configRecord = (form.config || {}) as Record<string, unknown>;
    const notificationEmail = configRecord.notificationEmail as string | undefined;
    const formFields = (form.fields as { id: string; label: string; type: string }[]) ?? [];
    const emailField = formFields.find((f) => f.type === 'email');

    const respondentEmail = emailField
      ? (data[emailField.id] as string | undefined)
      : (data._respondentEmail as string | undefined);

    if (respondentEmail && data._sendEmailCopy) {
      const responses = formFields
        .filter((f) => f.id !== (emailField?.id ?? '') && !f.id.startsWith('_'))
        .map((f) => {
          let value = '';
          const rawData = data[f.id];

          if (Array.isArray(rawData)) {
            value = rawData.join(', ');
          } else {
            value = String(rawData ?? '');
            if (f.type === 'date' && value) {
              const d = new Date(value);
              if (!isNaN(d.getTime())) {
                value = d.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });
              }
            }
          }

          return { label: f.label, value };
        });
      void import('./email.service').then((m) =>
        m.sendRespondentConfirmation(respondentEmail, form.title, submission.id, responses),
      );
    }

    if (notificationEmail) {
      void import('./email.service').then((m) =>
        m.sendCreatorNotification(notificationEmail, form.title, currentCount + 1, form.slug),
      );
    }

    return submission;
  });
}

export async function list(formId: string, creatorId: string, page = 1, limit = 20) {
  const form = await db.query.forms.findFirst({
    where: and(eq(forms.id, formId), eq(forms.creatorId, creatorId)),
  });

  if (!form) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Form not found' });
  }

  const offset = (page - 1) * limit;

  return await db.query.submissions.findMany({
    where: eq(submissions.formId, formId),
    orderBy: [desc(submissions.createdAt)],
    limit,
    offset,
  });
}

export async function getCount(formId: string) {
  const [result] = await db
    .select({ count: count() })
    .from(submissions)
    .where(eq(submissions.formId, formId));
  return result?.count ?? 0;
}

export async function getById(submissionId: string) {
  const submission = await db.query.submissions.findFirst({
    where: eq(submissions.id, submissionId),
    with: {
      form: true,
    },
  });

  if (!submission) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Submission not found' });
  }

  return submission;
}
