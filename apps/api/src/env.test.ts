import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('env schema', () => {
  const envSchema = z.object({
    PORT: z.string().optional(),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    BASE_URL: z.string().default('http://localhost:8000'),
    DATABASE_URL: z.string().url(),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_PUBLISHABLE_KEY: z.string().min(1),
  });

  it('should accept valid env values', () => {
    const result = envSchema.parse({
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://localhost:5432/test',
      CLERK_SECRET_KEY: 'sk_test_abc123',
      CLERK_PUBLISHABLE_KEY: 'pk_test_abc123',
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
    });
    expect(result.PORT).toBeUndefined();
  });

  it('should reject invalid DATABASE_URL', () => {
    expect(() =>
      envSchema.parse({
        NODE_ENV: 'development',
        DATABASE_URL: 'not-a-url',
        CLERK_SECRET_KEY: 'sk_test_abc123',
        CLERK_PUBLISHABLE_KEY: 'pk_test_abc123',
      }),
    ).toThrow();
  });

  it('should reject missing CLERK_SECRET_KEY', () => {
    expect(() =>
      envSchema.parse({
        NODE_ENV: 'development',
        DATABASE_URL: 'postgresql://localhost:5432/test',
        CLERK_PUBLISHABLE_KEY: 'pk_test_abc123',
      }),
    ).toThrow();
  });

  it('should reject missing CLERK_PUBLISHABLE_KEY', () => {
    expect(() =>
      envSchema.parse({
        NODE_ENV: 'development',
        DATABASE_URL: 'postgresql://localhost:5432/test',
        CLERK_SECRET_KEY: 'sk_test_abc123',
      }),
    ).toThrow();
  });
});
