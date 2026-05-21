import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.loadEnvFile(resolve(__dirname, '../../.env'));

const testDbUrl =
  process.env['TEST_DATABASE_URL'] || 'postgresql://postgres:PASSWORD@localhost:5432/starform_test';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: ['**/node_modules/**', '**/dist/**'],
    env: {
      DATABASE_URL: testDbUrl,
      NODE_ENV: 'development',
      CLERK_SECRET_KEY: 'sk_test_abc123',
      CLERK_PUBLISHABLE_KEY: 'pk_test_abc123',
      CLERK_WEBHOOK_SECRET: 'whsec_abc123',
    },
  },
});
