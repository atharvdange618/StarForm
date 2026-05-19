import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      DATABASE_URL: 'postgresql://localhost:5432/starform_test',
      NODE_ENV: 'development',
    },
  },
});
