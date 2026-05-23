import { eq, count } from 'drizzle-orm';
import { env } from '@starform/env';
import { db } from '@starform/database/client';
import { forms, submissions } from '@starform/database';
import { logger } from '@starform/logger';

interface SubmissionData {
  id: string;
  formId: string;
  data: unknown;
  createdAt: Date;
}

export async function notify(formId: string, submission: SubmissionData) {
  try {
    const form = await db.query.forms.findFirst({
      where: eq(forms.id, formId),
      columns: { title: true, slug: true, config: true, creatorId: true },
    });

    if (!form) return;

    const config = (form.config as Record<string, unknown>) ?? {};
    const webhookUrl = config.webhookUrl as string | undefined;
    if (!webhookUrl) return;

    const [countResult] = await db
      .select({ count: count() })
      .from(submissions)
      .where(eq(submissions.formId, formId));

    const payload = {
      event: 'submission.created',
      formTitle: form.title,
      submissionId: submission.id,
      responseCount: countResult?.count ?? 0,
      formUrl: `${env.BASE_URL ?? ''}/${form.slug}`,
    };

    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch((err) => {
      logger.error({ err, webhookUrl, formId }, 'Webhook delivery failed');
    });
  } catch (err) {
    logger.error({ err, formId }, 'Webhook notification error');
  }
}
