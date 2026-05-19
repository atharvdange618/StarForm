import { describe, it, expect } from 'vitest';
import { TRPCError } from '@trpc/server';

import { serverRouter } from '../index';
import { createServerContext } from '../context';
import {
  tRPCContext,
  publicProcedure,
  protectedProcedure,
  creatorProcedure,
  respondentProcedure,
} from '../trpc';

describe('auth procedures', () => {
  it('publicProcedure should not require auth', () => {
    expect(publicProcedure).toBeDefined();
  });

  it('protectedProcedure should throw UNAUTHORIZED when user is null', async () => {
    const ctx = createServerContext();
    const caller = serverRouter.createCaller(ctx);

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
        userId: 'test-creator-id',
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

  it('respondentProcedure should throw FORBIDDEN when user lacks respondent role', async () => {
    const ctx = createServerContext();
    const authedCtx = {
      ...ctx,
      user: {
        userId: 'test-user-id',
        roles: ['creator'],
        plan: 'free' as const,
        email: 'creator@test.com',
        name: null,
      },
    };

    const testRouter = tRPCContext.router({
      test: respondentProcedure.query(async () => 'ok'),
    });

    const testCaller = testRouter.createCaller(authedCtx);
    await expect(testCaller.test()).rejects.toMatchObject({ code: 'FORBIDDEN' });
  });
});
