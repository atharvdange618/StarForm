import { describe, it, expect } from 'vitest';
import { envSchema } from '@starform/env';

describe('env schema', () => {
  it('should accept valid env values', () => {
    const result = envSchema.parse({
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://localhost:5432/test',
      CLERK_SECRET_KEY: 'sk_test_abc123',
      CLERK_PUBLISHABLE_KEY: 'pk_test_abc123',
      CLERK_WEBHOOK_SECRET: 'whsec_abc123',
    });
    expect(result.DATABASE_URL).toBe('postgresql://localhost:5432/test');
    expect(result.CLERK_SECRET_KEY).toBe('sk_test_abc123');
    expect(result.CLERK_PUBLISHABLE_KEY).toBe('pk_test_abc123');
  });

  it('should apply default for PORT', () => {
    const result = envSchema.parse({
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://localhost:5432/test',
      CLERK_SECRET_KEY: 'sk_test_abc123',
      CLERK_PUBLISHABLE_KEY: 'pk_test_abc123',
      CLERK_WEBHOOK_SECRET: 'whsec_abc123',
    });
    expect(result.PORT).toBeUndefined();
  });

  it('should apply default for LOG_LEVEL', () => {
    const result = envSchema.parse({
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://localhost:5432/test',
      CLERK_SECRET_KEY: 'sk_test_abc123',
      CLERK_PUBLISHABLE_KEY: 'pk_test_abc123',
      CLERK_WEBHOOK_SECRET: 'whsec_abc123',
    });
    expect(result.LOG_LEVEL).toBe('debug');
  });

  it('should reject invalid DATABASE_URL', () => {
    expect(() =>
      envSchema.parse({
        NODE_ENV: 'development',
        DATABASE_URL: 'not-a-url',
        CLERK_SECRET_KEY: 'sk_test_abc123',
        CLERK_PUBLISHABLE_KEY: 'pk_test_abc123',
        CLERK_WEBHOOK_SECRET: 'whsec_abc123',
      }),
    ).toThrow();
  });

  it('should reject missing CLERK_SECRET_KEY', () => {
    expect(() =>
      envSchema.parse({
        NODE_ENV: 'development',
        DATABASE_URL: 'postgresql://localhost:5432/test',
        CLERK_PUBLISHABLE_KEY: 'pk_test_abc123',
        CLERK_WEBHOOK_SECRET: 'whsec_abc123',
      }),
    ).toThrow();
  });
});
