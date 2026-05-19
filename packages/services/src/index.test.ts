import { describe, it, expect } from 'vitest';

describe('services package', () => {
  it('should export module', async () => {
    const mod = await import('./index');
    expect(mod).toBeDefined();
  });
});
