import { describe, it, expect } from 'vitest';
import {
  users,
  forms,
  formVersions,
  submissions,
  themes,
  visibilityEnum,
  statusEnum,
  planEnum,
} from './schema';

describe('Database schema exports', () => {
  it('should export users table', () => {
    expect(users).toBeDefined();
    expect(typeof users).toBe('object');
  });

  it('should export forms table', () => {
    expect(forms).toBeDefined();
    expect(typeof forms).toBe('object');
  });

  it('should export form_versions table', () => {
    expect(formVersions).toBeDefined();
    expect(typeof formVersions).toBe('object');
  });

  it('should export submissions table', () => {
    expect(submissions).toBeDefined();
    expect(typeof submissions).toBe('object');
  });

  it('should export themes table', () => {
    expect(themes).toBeDefined();
    expect(typeof themes).toBe('object');
  });

  it('should define visibility enum values', () => {
    expect(visibilityEnum.enumValues).toContain('public');
    expect(visibilityEnum.enumValues).toContain('unlisted');
  });

  it('should define status enum values', () => {
    expect(statusEnum.enumValues).toContain('draft');
    expect(statusEnum.enumValues).toContain('published');
    expect(statusEnum.enumValues).toContain('archived');
  });

  it('should have all 5 tables', () => {
    const tables = [users, forms, formVersions, submissions, themes];
    expect(tables).toHaveLength(5);
  });

  it('should define plan enum values', () => {
    expect(planEnum.enumValues).toContain('free');
    expect(planEnum.enumValues).toContain('pro');
    expect(planEnum.enumValues).toContain('enterprise');
  });
});
