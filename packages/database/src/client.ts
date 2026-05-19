import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from './env.js';
import * as schema from './schema.js';

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle> | undefined;
};

const queryClient = postgres(env.DATABASE_URL);

export const db = globalForDb.db ?? drizzle(queryClient, { schema, casing: 'snake_case' });

if (env.NODE_ENV !== 'production') {
  globalForDb.db = db;
}
