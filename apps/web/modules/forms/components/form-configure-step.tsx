'use client';

import { useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateTimePicker } from '@/components/datetime-picker';
import { z } from 'zod';
import { useFormBuilderStore } from '@/store/form-builder.store';
import { ThemePicker } from './theme-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const configureSchema = z.object({
  visibility: z.enum(['public', 'unlisted']),
  expiryDate: z.string().optional(),
  responseLimit: z.string().optional(),
  password: z.string().optional(),
  thankYouMessage: z.string().max(1000).optional(),
  webhookUrl: z.string().optional(),
});

type ConfigureData = z.infer<typeof configureSchema>;

export function FormConfigureStep() {
  const {
    themeId,
    visibility,
    expiryDate,
    responseLimit,
    password,
    thankYouMessage,
    webhookUrl,
    setThemeId,
  } = useFormBuilderStore();

  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ConfigureData>({
    resolver: zodResolver(configureSchema),
    defaultValues: {
      visibility,
      expiryDate: expiryDate ?? '',
      responseLimit: responseLimit?.toString() ?? '',
      password: password ?? '',
      thankYouMessage: thankYouMessage ?? '',
      webhookUrl: webhookUrl ?? '',
    },
    mode: 'onBlur',
  });

  const watchedVisibility = watch('visibility');
  const watchedExpiryDate = watch('expiryDate');
  const watchedResponseLimit = watch('responseLimit');
  const watchedPassword = watch('password');
  const watchedThankYouMessage = watch('thankYouMessage');
  const watchedWebhookUrl = watch('webhookUrl');

  useEffect(() => {
    useFormBuilderStore.setState({
      visibility: watchedVisibility,
      expiryDate: watchedExpiryDate ? new Date(watchedExpiryDate).toISOString() : null,
      responseLimit: watchedResponseLimit ? Number.parseInt(watchedResponseLimit, 10) : null,
      password: watchedPassword || null,
      thankYouMessage: watchedThankYouMessage || null,
      webhookUrl: watchedWebhookUrl || null,
      isDirty: true,
    });
  }, [
    watchedVisibility,
    watchedExpiryDate,
    watchedResponseLimit,
    watchedPassword,
    watchedThankYouMessage,
    watchedWebhookUrl,
  ]);

  const handleVisibilityChange = useCallback(
    (newVisibility: 'public' | 'unlisted') => {
      setValue('visibility', newVisibility, { shouldDirty: true });
    },
    [setValue],
  );

  const handleThemeChange = useCallback(
    (id: string | null) => {
      setThemeId(id);
    },
    [setThemeId],
  );

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <section className="space-y-4">
        <div>
          <h3 className="font-heading text-lg font-medium text-foreground">Theme</h3>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            Choose a visual theme for your form
          </p>
        </div>
        <ThemePicker selectedId={themeId} onSelect={handleThemeChange} />
      </section>

      <div className="h-px bg-border" />

      <section className="space-y-4">
        <div>
          <h3 className="font-heading text-lg font-medium text-foreground">Visibility</h3>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            Control who can access your form
          </p>
        </div>
        <div className="flex items-center gap-4" role="radiogroup" aria-label="Form visibility">
          <button
            type="button"
            role="radio"
            aria-checked={watchedVisibility === 'public'}
            onClick={() => {
              handleVisibilityChange('public');
            }}
            className={`flex-1 rounded-[calc(var(--radius)*0.8)] border-2 p-4 text-left transition-all ${
              watchedVisibility === 'public'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <span className="font-body text-sm font-medium text-foreground">Public</span>
            <p className="mt-0.5 font-body text-xs text-muted-foreground">
              Anyone with the link can access
            </p>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={watchedVisibility === 'unlisted'}
            onClick={() => {
              handleVisibilityChange('unlisted');
            }}
            className={`flex-1 rounded-[calc(var(--radius)*0.8)] border-2 p-4 text-left transition-all ${
              watchedVisibility === 'unlisted'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <span className="font-body text-sm font-medium text-foreground">Unlisted</span>
            <p className="mt-0.5 font-body text-xs text-muted-foreground">
              Only people with the direct link
            </p>
          </button>
        </div>
      </section>

      <div className="h-px bg-border" />

      <section className="space-y-4">
        <div>
          <h3 className="font-heading text-lg font-medium text-foreground">Limits & Security</h3>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            Set optional restrictions on your form
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="expiry-date" className="font-body text-sm text-muted-foreground">
              Expiry Date
            </Label>
            <Controller
              control={control}
              name="expiryDate"
              render={({ field }) => (
                <DateTimePicker
                  date={field.value ? new Date(field.value) : undefined}
                  onDateChange={(date) => {
                    field.onChange(date ? date.toISOString() : '');
                  }}
                  placeholder="Select expiry date"
                />
              )}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="response-limit" className="font-body text-sm text-muted-foreground">
              Response Limit
            </Label>
            <Input
              id="response-limit"
              type="number"
              min={1}
              {...register('responseLimit')}
              placeholder="No limit"
              className="font-body"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="form-password" className="font-body text-sm text-muted-foreground">
            Password Protection
          </Label>
          <Input
            id="form-password"
            type="password"
            {...register('password')}
            placeholder="Leave empty for no password"
            className="font-body"
          />
        </div>
      </section>

      <div className="h-px bg-border" />

      <section className="space-y-4">
        <div>
          <h3 className="font-heading text-lg font-medium text-foreground">Thank You Message</h3>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            What respondents see after submitting
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="thank-you-message" className="font-body text-sm text-muted-foreground">
            Message
          </Label>
          <Textarea
            id="thank-you-message"
            {...register('thankYouMessage')}
            placeholder="Thank you for your response!"
            className="min-h-20 resize-y font-body"
          />
          {errors.thankYouMessage ? (
            <p className="font-body text-xs text-destructive">{errors.thankYouMessage.message}</p>
          ) : null}
        </div>
      </section>

      <div className="h-px bg-border" />

      <section className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="grid gap-2">
            <Label
              htmlFor="webhook-url"
              className="font-heading text-lg font-medium text-foreground"
            >
              Webhook URL
            </Label>
            <p className="font-body text-sm text-muted-foreground">
              Receive submission notifications via webhook
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            Pro
          </Badge>
        </div>
        <div className="grid gap-2">
          <Input
            id="webhook-url"
            type="url"
            {...register('webhookUrl')}
            placeholder="https://discord.com/api/webhooks/..."
            className="font-body"
          />
        </div>
      </section>
    </div>
  );
}
