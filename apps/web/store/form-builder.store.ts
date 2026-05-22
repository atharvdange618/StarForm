import { create } from 'zustand';
import type { FieldData } from '@/modules/forms/types';

export interface FormBuilderState {
  step: number;
  title: string;
  description: string;
  slug: string;
  fields: FieldData[];
  themeId: string | null;
  visibility: 'public' | 'unlisted';
  expiryDate: string | null;
  responseLimit: number | null;
  password: string | null;
  thankYouMessage: string | null;
  webhookUrl: string | null;
  isDirty: boolean;

  setStep: (step: number) => void;
  setDetails: (title: string, description: string, slug: string) => void;
  addField: (field: FieldData) => void;
  updateField: (id: string, field: Partial<FieldData>) => void;
  removeField: (id: string) => void;
  reorderFields: (fromIndex: number, toIndex: number) => void;
  setThemeId: (id: string | null) => void;
  setVisibility: (v: 'public' | 'unlisted') => void;
  setExpiryDate: (d: string | null) => void;
  setResponseLimit: (n: number | null) => void;
  setPassword: (p: string | null) => void;
  setThankYouMessage: (m: string | null) => void;
  setWebhookUrl: (u: string | null) => void;
  reset: () => void;
  loadFromForm: (form: {
    title: string;
    description: string | null;
    slug: string;
    fields: unknown;
    themeId: string | null;
    visibility: 'public' | 'unlisted';
    config: unknown;
  }) => void;
}

const initialState = {
  step: 0,
  title: '',
  description: '',
  slug: '',
  fields: [] as FieldData[],
  themeId: null as string | null,
  visibility: 'public' as 'public' | 'unlisted',
  expiryDate: null as string | null,
  responseLimit: null as number | null,
  password: null as string | null,
  thankYouMessage: null as string | null,
  webhookUrl: null as string | null,
  isDirty: false,
};

export const useFormBuilderStore = create<FormBuilderState>((set) => ({
  ...initialState,

  setStep: (step) => {
    set({ step });
  },

  setDetails: (title, description, slug) => {
    set({ title, description, slug, isDirty: true });
  },

  addField: (field) => {
    set((state) => ({ fields: [...state.fields, field], isDirty: true }));
  },

  updateField: (id, field) => {
    set((state) => ({
      fields: state.fields.map((f) => (f.id === id ? { ...f, ...field } : f)),
      isDirty: true,
    }));
  },

  removeField: (id) => {
    set((state) => ({
      fields: state.fields.filter((f) => f.id !== id),
      isDirty: true,
    }));
  },

  reorderFields: (fromIndex, toIndex) => {
    set((state) => {
      const fields = [...state.fields];
      const [moved] = fields.splice(fromIndex, 1);
      if (!moved) return { fields: state.fields, isDirty: state.isDirty };
      fields.splice(toIndex, 0, moved);
      return { fields, isDirty: true };
    });
  },

  setThemeId: (themeId) => {
    set({ themeId, isDirty: true });
  },
  setVisibility: (visibility) => {
    set({ visibility, isDirty: true });
  },
  setExpiryDate: (expiryDate) => {
    set({ expiryDate, isDirty: true });
  },
  setResponseLimit: (responseLimit) => {
    set({ responseLimit, isDirty: true });
  },
  setPassword: (password) => {
    set({ password, isDirty: true });
  },
  setThankYouMessage: (thankYouMessage) => {
    set({ thankYouMessage, isDirty: true });
  },
  setWebhookUrl: (webhookUrl) => {
    set({ webhookUrl, isDirty: true });
  },

  reset: () => {
    set(initialState);
  },

  loadFromForm: (form) => {
    set(() => {
      const cfg = form.config as Record<string, unknown> | null | undefined;
      return {
        title: form.title,
        description: form.description ?? '',
        slug: form.slug,
        fields: Array.isArray(form.fields) ? form.fields : [],
        themeId: form.themeId,
        visibility: form.visibility,
        expiryDate: (cfg?.expiryDate as string | undefined) ?? null,
        responseLimit: (cfg?.responseLimit as number | undefined) ?? null,
        password: (cfg?.password as string | undefined) ?? null,
        thankYouMessage: (cfg?.thankYouMessage as string | undefined) ?? null,
        webhookUrl: (cfg?.webhookUrl as string | undefined) ?? null,
        isDirty: false,
      };
    });
  },
}));
