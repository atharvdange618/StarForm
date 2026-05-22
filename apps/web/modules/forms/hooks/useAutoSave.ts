'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export function useAutoSave(formSlug: string, getValues: () => Record<string, unknown>) {
  const STORAGE_KEY = `starform-draft-${formSlug}`;

  const getValuesRef = useRef(getValues);
  getValuesRef.current = getValues;

  const restoreDraft = useCallback((): Record<string, unknown> | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, [STORAGE_KEY]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, [STORAGE_KEY]);

  useEffect(() => {
    const timer = setInterval(() => {
      try {
        const values = getValuesRef.current();
        if (values && Object.keys(values).length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
        }
      } catch {
        // localStorage may be unavailable
      }
    }, 1500);

    return () => clearInterval(timer);
  }, [STORAGE_KEY]);

  return { restoreDraft, clearDraft };
}
