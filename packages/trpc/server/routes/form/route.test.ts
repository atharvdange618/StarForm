import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { TRPCError } from '@trpc/server';
import { serverRouter } from '../../index';
import { createServerContext } from '../../context';
import { cleanDatabase, createUser, createForm, publishForm } from '@starform/database/test-utils';

describe('formRouter', () => {
  let unauthedCaller: ReturnType<typeof serverRouter.createCaller>;

  beforeAll(() => {
    const ctx = createServerContext();
    unauthedCaller = serverRouter.createCaller(ctx);
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  it('should deny unauthorized access', async () => {
    await expect(unauthedCaller.form.list()).rejects.toThrow(TRPCError);
    await expect(unauthedCaller.form.list()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });

  it('should deny non-creator users from creator procedures', async () => {
    const ctx = createServerContext();
    const authedCtx = {
      ...ctx,
      user: {
        userId: 'test_user',
        clerkId: 'test_clerk',
        roles: ['respondent'] as string[],
        plan: 'free' as const,
        email: 'test@test.com',
        name: null,
      },
    };
    const caller = serverRouter.createCaller(authedCtx);

    await expect(caller.form.list()).rejects.toThrow(TRPCError);
    await expect(caller.form.list()).rejects.toMatchObject({ code: 'FORBIDDEN' });
  });

  it('should create a form', async () => {
    const user = await createUser();
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

    const form = await caller.form.create({
      title: 'My New Form',
      fields: [
        {
          id: crypto.randomUUID(),
          type: 'shortText',
          label: 'Question 1',
          required: true,
          config: {},
          order: 0,
        },
      ],
    });
    expect(form.title).toBe('My New Form');
    expect(form.creatorId).toBe(user.id);
    expect(form.status).toBe('draft');
  });

  it('should list forms for a creator', async () => {
    const user = await createUser();
    await createForm(user.id, { title: 'Form 1', slug: 'form-1' });
    await createForm(user.id, { title: 'Form 2', slug: 'form-2' });

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

    const forms = await caller.form.list();
    expect(forms).toHaveLength(2);
  });

  it('should get a form by id', async () => {
    const user = await createUser();
    const form = await createForm(user.id);

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

    const result = await caller.form.getById({ id: form.id });
    expect(result.id).toBe(form.id);
    expect(result.title).toBe(form.title);
  });

  it('should return NOT_FOUND for non-existent form', async () => {
    const user = await createUser();

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

    await expect(
      caller.form.getById({ id: '00000000-0000-0000-0000-000000000000' }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('should update a form', async () => {
    const user = await createUser();
    const form = await createForm(user.id);

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

    const updated = await caller.form.update({
      id: form.id,
      data: { title: 'Updated Title' },
    });
    expect(updated.title).toBe('Updated Title');
  });

  it('should publish a form', async () => {
    const user = await createUser();
    const form = await createForm(user.id, {
      fields: [
        {
          id: crypto.randomUUID(),
          type: 'shortText',
          label: 'Q1',
          required: true,
          config: {},
          order: 0,
        },
      ],
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

    const published = await caller.form.publish({ id: form.id, config: { visibility: 'public' } });
    expect(published.status).toBe('published');
    expect(published.publishedVersion).toBe(1);
  });

  it('should fetch published form by slug', async () => {
    const user = await createUser();
    const form = await createForm(user.id, { slug: 'my-test-form' });
    await publishForm(form.id);

    const result = await unauthedCaller.form.getBySlug({ slug: 'my-test-form' });
    expect(result.slug).toBe('my-test-form');
    expect(result.status).toBe('published');
  });

  it('should archive a form', async () => {
    const user = await createUser();
    const form = await createForm(user.id);

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

    const archived = await caller.form.archive({ id: form.id });
    expect(archived.status).toBe('archived');
  });

  it('should clone a form', async () => {
    const user = await createUser();
    const form = await createForm(user.id, { title: 'Original', slug: 'original-form' });

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

    const cloned = await caller.form.clone({ id: form.id });
    expect(cloned.title).toContain('(Copy)');
    expect(cloned.status).toBe('draft');
    expect(cloned.creatorId).toBe(user.id);
  });
});
