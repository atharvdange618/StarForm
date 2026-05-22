export const formKeys = {
  all: ['forms'] as const,
  lists: () => [...formKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...formKeys.lists(), filters] as const,
  details: () => [...formKeys.all, 'detail'] as const,
  detail: (id: string) => [...formKeys.details(), id] as const,
  bySlug: (slug: string) => [...formKeys.all, 'slug', slug] as const,
};

export const submissionKeys = {
  all: ['submissions'] as const,
  list: (formId: string) => [...submissionKeys.all, 'list', formId] as const,
  detail: (id: string) => [...submissionKeys.all, 'detail', id] as const,
};

export const themeKeys = {
  all: ['themes'] as const,
  lists: () => [...themeKeys.all, 'list'] as const,
  detail: (id: string) => [...themeKeys.all, 'detail', id] as const,
};

export const analyticsKeys = {
  formStats: (formId: string) => ['analytics', 'formStats', formId] as const,
};
