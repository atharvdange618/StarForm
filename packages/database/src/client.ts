import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { z } from 'zod';
import * as schema from './schema.js';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
});

const env = envSchema.parse(process.env);

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle> | undefined;
};

const queryClient = postgres(env.DATABASE_URL);

export const db = globalForDb.db ?? drizzle(queryClient, { schema, casing: 'snake_case' });

if (env.NODE_ENV !== 'production') {
  globalForDb.db = db;
}
