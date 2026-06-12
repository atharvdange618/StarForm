import { eq, and, desc, count, inArray, sql } from 'drizzle-orm';
import { db } from '@starform/database/client';
import { forms, formVersions, submissions } from '@starform/database';
import type { NewForm } from '@starform/database';
import { TRPCError } from '@trpc/server';

export async function create(
  creatorId: string,
  data: Omit<NewForm, 'creatorId' | 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'slug'> & {
    slug?: string;
  },
) {
  if (data.slug) {
    const existing = await db.query.forms.findFirst({
      where: and(eq(forms.slug, data.slug), sql`${forms.deletedAt} IS NULL`),
    });
    if (existing) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'This URL slug is already in use. Please choose another one.',
      });
    }
  }

  const slug =
    data.slug ||
    `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Math.random().toString(36).substring(2, 8)}`;

  const [form] = await db
    .insert(forms)
    .values({
      ...data,
      creatorId,
      slug,
    })
    .returning();
  if (!form) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create form' });
  }
  return form;
}

export async function getById(formId: string, creatorId: string) {
  const form = await db.query.forms.findFirst({
    where: and(eq(forms.id, formId), eq(forms.creatorId, creatorId)),
    with: {
      theme: true,
      versions: {
        columns: { id: true, version: true, createdAt: true },
        orderBy: [desc(formVersions.version)],
      },
    },
  });

  if (!form) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Form not found' });
  }

  const [submissionCountResult] = await db
    .select({ value: count() })
    .from(submissions)
    .where(eq(submissions.formId, formId));
  const submissionCount = submissionCountResult?.value ?? 0;

  return { ...form, submissionCount };
}

export async function getBySlug(slugOrId: string) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
  const form = await db.query.forms.findFirst({
    where: and(
      isUuid ? eq(forms.id, slugOrId) : eq(forms.slug, slugOrId),
      eq(forms.status, 'published'),
      sql`${forms.deletedAt} IS NULL`,
    ),
    with: {
      theme: true,
    },
  });

  if (!form) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Form not found or not published' });
  }

  return form;
}

export async function list(creatorId: string) {
  const results = await db.query.forms.findMany({
    where: and(eq(forms.creatorId, creatorId), sql`${forms.deletedAt} IS NULL`),
    orderBy: [desc(forms.createdAt)],
    with: {
      theme: true,
    },
  });

  const formIds = results.map((f) => f.id);
  const counts =
    formIds.length > 0
      ? await db
          .select({ formId: submissions.formId, value: count() })
          .from(submissions)
          .where(inArray(submissions.formId, formIds))
          .groupBy(submissions.formId)
      : [];

  const countMap = new Map(counts.map((c) => [c.formId, c.value]));

  return results.map((f) => ({
    ...f,
    submissionCount: countMap.get(f.id) ?? 0,
  }));
}

export async function listPublic(search?: string) {
  let whereClause = and(
    eq(forms.status, 'published'),
    eq(forms.visibility, 'public'),
    sql`${forms.deletedAt} IS NULL`,
  );

  if (search) {
    whereClause = and(
      whereClause,
      sql`(${forms.title} ILIKE ${'%' + search + '%'} OR COALESCE(${forms.description}, '') ILIKE ${'%' + search + '%'})`,
    );
  }

  const results = await db.query.forms.findMany({
    where: whereClause,
    orderBy: [desc(forms.createdAt)],
    with: {
      theme: true,
      creator: {
        columns: {
          name: true,
        },
      },
    },
  });

  const formIds = results.map((f) => f.id);
  const counts =
    formIds.length > 0
      ? await db
          .select({ formId: submissions.formId, value: count() })
          .from(submissions)
          .where(inArray(submissions.formId, formIds))
          .groupBy(submissions.formId)
      : [];

  const countMap = new Map(counts.map((c) => [c.formId, c.value]));

  return results.map((f) => ({
    ...f,
    submissionCount: countMap.get(f.id) ?? 0,
  }));
}

export async function update(
  formId: string,
  creatorId: string,
  data: Partial<Omit<NewForm, 'id' | 'creatorId' | 'createdAt' | 'updatedAt' | 'deletedAt'>>,
) {
  const form = await db.query.forms.findFirst({
    where: and(eq(forms.id, formId), eq(forms.creatorId, creatorId)),
  });

  if (!form) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Form not found' });
  }

  if (data.slug && data.slug !== form.slug) {
    const existing = await db.query.forms.findFirst({
      where: and(eq(forms.slug, data.slug), sql`${forms.deletedAt} IS NULL`),
    });
    if (existing) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'This URL slug is already in use. Please choose another one.',
      });
    }
  }

  if (data.fields) {
    const [submissionCountResult] = await db
      .select({ value: count() })
      .from(submissions)
      .where(eq(submissions.formId, formId));
    if ((submissionCountResult?.value ?? 0) > 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Cannot edit fields of a form that has submissions',
      });
    }
  }

  const [updated] = await db
    .update(forms)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(forms.id, formId), eq(forms.creatorId, creatorId)))
    .returning();

  if (!updated) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Form not found' });
  }
  return updated;
}

export async function publish(
  formId: string,
  creatorId: string,
  config?: {
    themeId?: string | null;
    visibility?: 'public' | 'unlisted';
    expiryDate?: string;
    responseLimit?: number;
    password?: string;
    thankYouMessage?: string;
  },
) {
  return await db.transaction(async (tx) => {
    const form = await tx.query.forms.findFirst({
      where: and(eq(forms.id, formId), eq(forms.creatorId, creatorId)),
    });

    if (!form) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Form not found' });
    }

    const nextVersion = (form.publishedVersion || 0) + 1;

    if (config) {
      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (config.themeId !== undefined) updateData.themeId = config.themeId;
      if (config.visibility !== undefined) updateData.visibility = config.visibility;
      if (
        config.expiryDate !== undefined ||
        config.responseLimit !== undefined ||
        config.password !== undefined ||
        config.thankYouMessage !== undefined
      ) {
        updateData.config = {
          ...((form.config as Record<string, unknown>) || {}),
          ...(config.expiryDate !== undefined ? { expiryDate: config.expiryDate } : {}),
          ...(config.responseLimit !== undefined ? { responseLimit: config.responseLimit } : {}),
          ...(config.password !== undefined ? { password: config.password } : {}),
          ...(config.thankYouMessage !== undefined
            ? { thankYouMessage: config.thankYouMessage }
            : {}),
        };
      }
      await tx.update(forms).set(updateData).where(eq(forms.id, form.id));
    }

    await tx
      .insert(formVersions)
      .values({
        formId: form.id,
        version: nextVersion,
        fields: form.fields,
        config: form.config,
      })
      .returning();

    const [updated] = await tx
      .update(forms)
      .set({ status: 'published', publishedVersion: nextVersion, updatedAt: new Date() })
      .where(eq(forms.id, form.id))
      .returning();

    if (!updated) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to publish form' });
    }
    return updated;
  });
}

export async function archive(formId: string, creatorId: string) {
  const [archived] = await db
    .update(forms)
    .set({ status: 'archived', deletedAt: new Date() })
    .where(and(eq(forms.id, formId), eq(forms.creatorId, creatorId)))
    .returning();

  if (!archived) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Form not found' });
  }
  return archived;
}

export async function clone(formId: string, creatorId: string) {
  const form = await db.query.forms.findFirst({
    where: and(eq(forms.id, formId), eq(forms.creatorId, creatorId)),
  });

  if (!form) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Form not found' });
  }

  return await create(creatorId, {
    title: `${form.title} (Copy)`,
    description: form.description,
    fields: form.fields,
    themeId: form.themeId,
    config: form.config,
    slug: `${form.slug}-copy-${Math.random().toString(36).substring(2, 8)}`,
    visibility: form.visibility,
    status: 'draft',
    publishedVersion: null,
  });
}

export async function getPublishedVersion(formId: string, version: number) {
  const fv = await db.query.formVersions.findFirst({
    where: and(eq(formVersions.formId, formId), eq(formVersions.version, version)),
  });
  if (!fv) throw new TRPCError({ code: 'NOT_FOUND', message: 'Version not found' });
  return fv;
}
