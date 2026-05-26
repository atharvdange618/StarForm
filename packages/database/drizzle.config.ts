import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load env variables from root since drizzle-kit might not load parent .env automatically in all systems
dotenv.config({ path: resolve(process.cwd(), '../../.env') });

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
