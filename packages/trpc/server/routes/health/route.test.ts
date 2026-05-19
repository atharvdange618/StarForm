import { describe, it, expect, beforeAll } from 'vitest';
import { serverRouter } from '../../index';
import { createServerContext } from '../../context';

describe('health router', () => {
  let caller: ReturnType<typeof serverRouter.createCaller>;

  beforeAll(() => {
    const ctx = createServerContext();
    caller = serverRouter.createCaller(ctx);
  });

  it('should return healthy status', async () => {
    const result = await caller.health.getHealth();
    expect(result.status).toBe('healthy');
  });
});
