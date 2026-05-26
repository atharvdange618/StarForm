import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  clean: true,
  sourcemap: true,
  platform: 'node',
  external: [/^(?!@starform\/)[^./]/],
  noExternal: [
    '@starform/env',
    '@starform/logger',
    '@starform/services',
    '@starform/trpc',
    '@starform/database',
  ],
});
