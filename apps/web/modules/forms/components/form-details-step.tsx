'use client';

import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFormBuilderStore } from '@/store/form-builder.store';

const detailsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens')
    .optional()
    .or(z.literal('')),
});

type DetailsData = z.infer<typeof detailsSchema>;

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-|-$/g, '')
    .slice(0, 100);
}

export function FormDetailsStep() {
  const { title, description, slug, setDetails } = useFormBuilderStore();

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<DetailsData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { title, description, slug },
    mode: 'onBlur',
  });

  const syncToStore = useCallback(
    async (field?: keyof DetailsData) => {
      if (field) {
        const valid = await trigger(field);
        if (!valid) return;
      } else {
        const valid = await trigger();
        if (!valid) return;
      }
      const values = getValues();
      const finalSlug = values.slug ?? generateSlug(values.title);
      setDetails(values.title, values.description ?? '', finalSlug);
    },
    [trigger, getValues, setDetails],
  );

  return (
    <div className="mx-auto max-w-xl space-y-6 animate-fade-up">
      <div className="grid gap-2">
        <Label htmlFor="form-title" className="font-body text-sm text-muted-foreground">
          Form Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="form-title"
          {...register('title')}
          placeholder="e.g. Customer Feedback Survey"
          className="font-body"
          onBlur={() => {
            void syncToStore('title');
          }}
        />
        {errors.title ? (
          <p className="font-body text-xs text-destructive">{errors.title.message}</p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="form-description" className="font-body text-sm text-muted-foreground">
          Description
        </Label>
        <Textarea
          id="form-description"
          {...register('description')}
          placeholder="Optional description or instructions..."
          className="min-h-25 resize-y font-body"
          onBlur={() => {
            void syncToStore('description');
          }}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="form-slug" className="font-body text-sm text-muted-foreground">
          URL Slug
        </Label>
        <div className="flex items-center gap-2">
          <span className="shrink-0 font-body text-sm text-muted-foreground">starform.app/</span>
          <Input
            id="form-slug"
            {...register('slug')}
            placeholder="auto-generated"
            className="font-mono text-sm"
            onBlur={() => {
              void syncToStore('slug');
            }}
          />
        </div>
        {errors.slug ? (
          <p className="font-body text-xs text-destructive">{errors.slug.message}</p>
        ) : null}
        <p className="font-body text-xs text-muted-foreground">
          Leave empty for auto-generation from title
        </p>
      </div>
    </div>
  );
}
