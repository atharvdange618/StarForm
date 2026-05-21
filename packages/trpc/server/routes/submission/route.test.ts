import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { TRPCError } from '@trpc/server';
import { serverRouter } from '../../index';
import { createServerContext } from '../../context';
import { cleanDatabase, createUser, createForm, publishForm } from '@starform/database/test-utils';

describe('submissionRouter', () => {
  let unauthedCaller: ReturnType<typeof serverRouter.createCaller>;

  beforeAll(() => {
    const ctx = createServerContext();
    unauthedCaller = serverRouter.createCaller(ctx);
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  it('should reject submission for non-existent slug', async () => {
    await expect(
      unauthedCaller.submission.submit({ slug: 'non-existent', data: {} }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('should reject submission for unpublished form', async () => {
    const user = await createUser();
    await createForm(user.id, { slug: 'draft-form' });

    await expect(
      unauthedCaller.submission.submit({ slug: 'draft-form', data: {} }),
    ).rejects.toThrow();
  });

  it('should accept submission for published form', async () => {
    const user = await createUser();
    const nameFieldId = crypto.randomUUID();
    const emailFieldId = crypto.randomUUID();
    const form = await createForm(user.id, {
      slug: 'published-form',
      fields: [
        { id: nameFieldId, type: 'shortText', label: 'Name', required: true, config: {}, order: 0 },
        { id: emailFieldId, type: 'email', label: 'Email', required: true, config: {}, order: 1 },
      ],
    });
    await publishForm(form.id);

    const result = await unauthedCaller.submission.submit({
      slug: 'published-form',
      data: { [nameFieldId]: 'Jane Doe', [emailFieldId]: 'jane@example.com' },
    });
    expect(result.formId).toBe(form.id);
  });

  it('should reject duplicate submission with same respondentHash', async () => {
    const user = await createUser();
    const nameFieldId = crypto.randomUUID();
    const form = await createForm(user.id, {
      slug: 'dedup-form',
      fields: [
        { id: nameFieldId, type: 'shortText', label: 'Name', required: true, config: {}, order: 0 },
      ],
    });
    await publishForm(form.id);

    await unauthedCaller.submission.submit({
      slug: 'dedup-form',
      data: { [nameFieldId]: 'First' },
      respondentHash: 'abc123',
    });

    await expect(
      unauthedCaller.submission.submit({
        slug: 'dedup-form',
        data: { [nameFieldId]: 'Second' },
        respondentHash: 'abc123',
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT' });
  });

  it('should deny unauthorized access to list', async () => {
    await expect(
      unauthedCaller.submission.list({ formId: '00000000-0000-0000-0000-000000000000' }),
    ).rejects.toThrow(TRPCError);
    await expect(
      unauthedCaller.submission.list({ formId: '00000000-0000-0000-0000-000000000000' }),
    ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });

  it('should list submissions for form creator', async () => {
    const user = await createUser();
    const nameFieldId = crypto.randomUUID();
    const form = await createForm(user.id, {
      slug: 'list-test-form',
      fields: [
        { id: nameFieldId, type: 'shortText', label: 'Name', required: true, config: {}, order: 0 },
      ],
    });
    await publishForm(form.id);

    await unauthedCaller.submission.submit({
      slug: 'list-test-form',
      data: { [nameFieldId]: 'Submission 1' },
    });
    await unauthedCaller.submission.submit({
      slug: 'list-test-form',
      data: { [nameFieldId]: 'Submission 2' },
    });

    const ctx = createServerContext();
    const authedCtx = {
      ...ctx,
      user: {
        userId: user.id,
        clerkId: user.clerkId,
        roles: user.roles,
        plan: user.plan as 'free' | 'pro' | 'enterprise',
        email: user.email,
        name: user.name,
      },
    };
    const caller = serverRouter.createCaller(authedCtx);

    const submissions = await caller.submission.list({ formId: form.id });
    expect(submissions).toHaveLength(2);
  });

  it('should get submission by id', async () => {
    const user = await createUser();
    const nameFieldId = crypto.randomUUID();
    const form = await createForm(user.id, {
      slug: 'get-by-id-form',
      fields: [
        { id: nameFieldId, type: 'shortText', label: 'Name', required: true, config: {}, order: 0 },
      ],
    });
    await publishForm(form.id);

    const submitted = await unauthedCaller.submission.submit({
      slug: 'get-by-id-form',
      data: { [nameFieldId]: 'Receipt Test' },
    });

    const result = await unauthedCaller.submission.getById({ id: submitted.id });
    expect(result.id).toBe(submitted.id);
  });
});
