import { config } from '@starform/eslint-config/base';

export default [
  ...config,
  {
    ignores: [
      '**/dist/**',
      '**/.turbo/**',
      '**/node_modules/**',
      '**/drizzle/**',
      '**/coverage/**',
      '**/.next/**',
      '**/out/**',
    ],
  },
];
