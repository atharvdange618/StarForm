import { describe, it, expect } from 'vitest';
import { TRPCError } from '@trpc/server';

import { createServerContext } from '../context';
import { tRPCContext, publicProcedure, protectedProcedure, creatorProcedure } from '../trpc';

describe('auth procedures', () => {
  it('publicProcedure should not require auth', () => {
    expect(publicProcedure).toBeDefined();
  });

  it('protectedProcedure should throw UNAUTHORIZED when user is null', async () => {
    const ctx = createServerContext();

    const testRouter = tRPCContext.router({
      test: protectedProcedure.query(async () => 'ok'),
    });

    const testCaller = testRouter.createCaller(ctx);
    await expect(testCaller.test()).rejects.toThrow(TRPCError);
    await expect(testCaller.test()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
  });

  it('creatorProcedure should throw FORBIDDEN when user lacks creator role', async () => {
    const ctx = createServerContext();
    // Simulate a non-creator user
    const authedCtx = {
      ...ctx,
      user: {
        userId: 'test-user-id',
        clerkId: 'test-clerk-id',
        roles: ['respondent'],
        plan: 'free' as const,
        email: 'test@test.com',
        name: null,
      },
    };

    const testRouter = tRPCContext.router({
      test: creatorProcedure.query(async () => 'ok'),
    });

    const testCaller = testRouter.createCaller(authedCtx);
    await expect(testCaller.test()).rejects.toThrow(TRPCError);
    await expect(testCaller.test()).rejects.toMatchObject({ code: 'FORBIDDEN' });
  });

  it('creatorProcedure should pass with creator role', async () => {
    const ctx = createServerContext();
    const authedCtx = {
      ...ctx,
      user: {
        userId: 'creator_123',
        clerkId: 'clerk_creator_123',
        roles: ['respondent', 'creator'],
        plan: 'pro' as const,
        email: 'creator@test.com',
        name: 'Test Creator',
      },
    };

    const testRouter = tRPCContext.router({
      test: creatorProcedure.query(async () => 'ok'),
    });

    const testCaller = testRouter.createCaller(authedCtx);
    await expect(testCaller.test()).resolves.toBe('ok');
  });

  it('protectedProcedure should pass with valid user', async () => {
    const ctx = createServerContext();
    const authedCtx = {
      ...ctx,
      user: {
        userId: 'test-user-id',
        clerkId: 'test-clerk-id',
        roles: ['respondent'],
        plan: 'free' as const,
        email: 'test@test.com',
        name: null,
      },
    };

    const testRouter = tRPCContext.router({
      test: protectedProcedure.query(async () => 'ok'),
    });

    const testCaller = testRouter.createCaller(authedCtx);
    await expect(testCaller.test()).resolves.toBe('ok');
  });
});
