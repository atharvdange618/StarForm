import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const envSchema = z.object({
  PORT: z.string().optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  BASE_URL: z.string().default('http://localhost:8000'),
  DATABASE_URL: z.string().url(),
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().min(1),
  LOG_LEVEL: z.string().default('debug'),
});

const safeParseResult = envSchema.safeParse(process.env);
if (!safeParseResult.success) {
  throw new Error(
    `@starform/env: Invalid environment variables:\n${safeParseResult.error.message}`,
  );
}

export const env = safeParseResult.data;
