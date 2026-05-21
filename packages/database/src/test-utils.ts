import { eq, sql } from 'drizzle-orm';
import { db } from './client';
import * as schema from './schema';

type UserInsert = typeof schema.users.$inferInsert;
type FormInsert = typeof schema.forms.$inferInsert;
type FormVersionInsert = typeof schema.formVersions.$inferInsert;
type SubmissionInsert = typeof schema.submissions.$inferInsert;

export async function cleanDatabase(): Promise<void> {
  await db.execute(
    sql.raw('TRUNCATE TABLE submissions, form_versions, forms, themes, users CASCADE'),
  );
}

const defaultUser: Omit<UserInsert, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> = {
  clerkId: 'clerk_test_user',
  email: 'creator@test.com',
  name: 'Test Creator',
  roles: ['respondent', 'creator'],
  plan: 'free',
};

export async function createUser(overrides: Partial<UserInsert> = {}) {
  const [user] = await db
    .insert(schema.users)
    .values({ ...defaultUser, ...overrides } as UserInsert)
    .returning();
  if (!user) throw new Error('Failed to create test user');
  return user;
}

const defaultForm: Omit<FormInsert, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'creatorId'> =
  {
    title: 'Test Form',
    description: 'A form for testing',
    slug: `test-form-${crypto.randomUUID().slice(0, 8)}`,
    visibility: 'public',
    status: 'draft',
    fields: [
      {
        id: crypto.randomUUID(),
        type: 'shortText',
        label: 'Full Name',
        required: true,
        config: {},
        order: 0,
      },
      {
        id: crypto.randomUUID(),
        type: 'email',
        label: 'Email',
        required: true,
        config: {},
        order: 1,
      },
    ],
    config: {},
  };

export async function createForm(creatorId: string, overrides: Partial<FormInsert> = {}) {
  const [form] = await db
    .insert(schema.forms)
    .values({ ...defaultForm, ...overrides, creatorId } as FormInsert)
    .returning();
  if (!form) throw new Error('Failed to create test form');
  return form;
}

export async function publishForm(formId: string) {
  const form = await db.query.forms.findFirst({
    where: eq(schema.forms.id, formId),
  });
  if (!form) throw new Error('Form not found');

  const nextVersion = (form.publishedVersion || 0) + 1;

  const [version] = await db
    .insert(schema.formVersions)
    .values({
      formId: form.id,
      version: nextVersion,
      fields: form.fields,
      config: form.config,
    } as FormVersionInsert)
    .returning();
  if (!version) throw new Error('Failed to create form version');

  const [updated] = await db
    .update(schema.forms)
    .set({ status: 'published', publishedVersion: nextVersion, updatedAt: new Date() })
    .where(eq(schema.forms.id, formId))
    .returning();
  if (!updated) throw new Error('Failed to publish form');

  return { form: updated, version };
}

const defaultSubmission: Omit<
  SubmissionInsert,
  'id' | 'createdAt' | 'deletedAt' | 'formId' | 'formVersionId'
> = {
  data: {},
};

export async function createSubmission(
  formId: string,
  formVersionId: string,
  overrides: Partial<SubmissionInsert> = {},
) {
  const [submission] = await db
    .insert(schema.submissions)
    .values({ ...defaultSubmission, ...overrides, formId, formVersionId } as SubmissionInsert)
    .returning();
  if (!submission) throw new Error('Failed to create test submission');
  return submission;
}
