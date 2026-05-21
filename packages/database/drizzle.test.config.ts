import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url:
      process.env['TEST_DATABASE_URL'] ||
      'postgresql://postgres:PASSWORD@localhost:5432/starform_test',
  },
});
