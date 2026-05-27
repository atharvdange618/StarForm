'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FieldData, FieldConfig } from '../types';

interface FieldConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field: FieldData | null;
  onSave: (field: FieldData) => void;
  allFields?: FieldData[];
}

const fieldTypes = [
  { value: 'shortText', label: 'Short Text', icon: 'Aa' },
  { value: 'longText', label: 'Long Text', icon: '¶' },
  { value: 'email', label: 'Email', icon: '@' },
  { value: 'number', label: 'Number', icon: '#' },
  { value: 'singleSelect', label: 'Single Select', icon: '○' },
  { value: 'multiSelect', label: 'Multi Select', icon: '☑' },
  { value: 'dropdown', label: 'Dropdown', icon: '▾' },
  { value: 'rating', label: 'Rating', icon: '★' },
  { value: 'date', label: 'Date', icon: '📅' },
] as const;

const typeEnum = z.enum([
  'shortText',
  'longText',
  'email',
  'number',
  'singleSelect',
  'multiSelect',
  'dropdown',
  'rating',
  'date',
]);

const fieldFormSchema = z.object({
  type: typeEnum,
  label: z.string().min(1, 'Label is required'),
  required: z.boolean(),
  maxLength: z.string().optional(),
  min: z.string().optional(),
  max: z.string().optional(),
  pattern: z.string().optional(),
  step: z.string().optional(),
  ratingMax: z.enum(['5', '10']),
  options: z.string().optional(),
  enableConditional: z.boolean().default(false),
  conditionalFieldId: z.string().optional(),
  conditionalValue: z.string().optional(),
});

type FieldFormData = z.infer<typeof fieldFormSchema>;

function generateId(): string {
  return crypto.randomUUID();
}

function getDefaultValues(field: FieldData | null): FieldFormData {
  const cond = field?.config?.conditionalVisibility as
    | { fieldId: string; value: string }
    | undefined;
  return {
    type: (field?.type ?? 'shortText') as FieldFormData['type'],
    label: field?.label ?? '',
    required: field?.required ?? false,
    maxLength: field?.config.maxLength?.toString() ?? '',
    min: field?.config.min === undefined ? '' : Number(field.config.min).toString(),
    max: field?.config.max === undefined ? '' : Number(field.config.max).toString(),
    pattern: field?.config.pattern ?? '',
    step: field?.config.step?.toString() ?? '',
    ratingMax:
      field?.config.max === 5 || field?.config.max === 10
        ? (String(field.config.max) as '5' | '10')
        : '5',
    options: field?.config.options?.join('\n') ?? '',
    enableConditional: !!cond,
    conditionalFieldId: cond?.fieldId ?? '',
    conditionalValue: cond?.value ?? '',
  };
}
export function FieldConfigDialog({
  open,
  onOpenChange,
  field,
  onSave,
  allFields,
}: FieldConfigDialogProps) {
  const isEditing = !!field;
  const fieldsArray = allFields || [];

  const precedingFields = fieldsArray.filter((f) => {
    if (field) {
      const fieldIndex = fieldsArray.findIndex((x) => x.id === field.id);
      const fIndex = fieldsArray.findIndex((x) => x.id === f.id);
      if (fieldIndex !== -1 && fIndex !== -1 && fIndex >= fieldIndex) return false;
    }
    return true;
  });

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(fieldFormSchema) as any,
    defaultValues: getDefaultValues(field),
  });

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(field));
    }
  }, [open, field, reset]);

  const currentType = watch('type');
  const showOptions = ['singleSelect', 'multiSelect', 'dropdown'].includes(currentType);
  const showMaxLength = currentType === 'shortText' || currentType === 'longText';
  const showPattern = currentType === 'shortText';
  const showRange = currentType === 'number';
  const showStep = currentType === 'number';
  const showRating = currentType === 'rating';

  const handleTypeChange = (newType: string) => {
    const current = getValues();
    const fresh = getDefaultValues(null);
    reset({
      type: newType as FieldFormData['type'],
      label: current.label || '',
      required: current.required,
      maxLength: fresh.maxLength,
      min: fresh.min,
      max: fresh.max,
      pattern: fresh.pattern,
      step: fresh.step,
      ratingMax: fresh.ratingMax,
      options: fresh.options,
    });
  };

  const onSubmit = (data: FieldFormData) => {
    const config: FieldConfig = {};

    switch (data.type) {
      case 'shortText': {
        if (data.maxLength) config.maxLength = Number.parseInt(data.maxLength, 10);
        if (data.pattern) config.pattern = data.pattern;
        break;
      }
      case 'longText': {
        if (data.maxLength) config.maxLength = Number.parseInt(data.maxLength, 10);
        break;
      }
      case 'number': {
        if (data.min?.trim()) config.min = Number.parseFloat(data.min);
        if (data.max?.trim()) config.max = Number.parseFloat(data.max);
        if (data.step?.trim()) config.step = Number.parseFloat(data.step);
        break;
      }
      case 'singleSelect':
      case 'multiSelect':
      case 'dropdown': {
        config.options = (data.options ?? '')
          .split('\n')
          .map((o) => o.trim())
          .filter((o) => o.length > 0);
        break;
      }
      case 'rating': {
        config.max = Number.parseInt(data.ratingMax, 10);
        break;
      }
    }

    if (data.enableConditional && data.conditionalFieldId && data.conditionalValue) {
      config.conditionalVisibility = {
        fieldId: data.conditionalFieldId,
        value: data.conditionalValue,
      };
    }

    onSave({
      id: field?.id ?? generateId(),
      type: data.type,
      label: data.label || 'Untitled Field',
      required: data.required,
      config,
      order: field?.order ?? 0,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit(onSubmit)();
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-heading">
              {isEditing ? 'Edit Field' : 'Add Field'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="field-type" className="font-body text-sm text-muted-foreground">
                Field Type
              </Label>
              <Select value={currentType} onValueChange={handleTypeChange}>
                <SelectTrigger id="field-type" className="font-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map((ft) => (
                    <SelectItem key={ft.value} value={ft.value} className="font-body">
                      <span className="flex items-center gap-2">
                        <span className="w-5 text-center text-sm">{ft.icon}</span>
                        {ft.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="field-label" className="font-body text-sm text-muted-foreground">
                Label
              </Label>
              <Input
                id="field-label"
                {...register('label')}
                placeholder="Enter field label"
                className="font-body"
              />
              {errors.label ? (
                <p className="font-body text-xs text-destructive">{errors.label.message}</p>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="field-required"
                checked={watch('required')}
                onCheckedChange={(checked) => {
                  setValue('required', checked, { shouldDirty: true });
                }}
              />
              <Label htmlFor="field-required" className="font-body text-sm text-muted-foreground">
                Required field
              </Label>
            </div>

            {showMaxLength ? (
              <div className="grid gap-2">
                <Label
                  htmlFor="field-max-length"
                  className="font-body text-sm text-muted-foreground"
                >
                  Max Length
                </Label>
                <Input
                  id="field-max-length"
                  type="number"
                  {...register('maxLength')}
                  placeholder="Leave empty for unlimited"
                  className="font-body"
                />
              </div>
            ) : null}

            {showPattern ? (
              <div className="grid gap-2">
                <Label htmlFor="field-pattern" className="font-body text-sm text-muted-foreground">
                  Validation Pattern (regex)
                </Label>
                <Input
                  id="field-pattern"
                  {...register('pattern')}
                  placeholder="e.g. ^[A-Z].+$"
                  className="font-mono text-sm"
                />
              </div>
            ) : null}

            {showRange ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="field-min" className="font-body text-sm text-muted-foreground">
                    Min
                  </Label>
                  <Input
                    id="field-min"
                    type="number"
                    {...register('min')}
                    placeholder="No min"
                    className="font-body"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="field-max" className="font-body text-sm text-muted-foreground">
                    Max
                  </Label>
                  <Input
                    id="field-max"
                    type="number"
                    {...register('max')}
                    placeholder="No max"
                    className="font-body"
                  />
                </div>
              </div>
            ) : null}

            {showStep ? (
              <div className="grid gap-2">
                <Label htmlFor="field-step" className="font-body text-sm text-muted-foreground">
                  Step
                </Label>
                <Input
                  id="field-step"
                  type="number"
                  step="any"
                  {...register('step')}
                  placeholder="e.g. 0.5"
                  className="font-body"
                />
              </div>
            ) : null}

            {showOptions ? (
              <div className="grid gap-2">
                <Label htmlFor="field-options" className="font-body text-sm text-muted-foreground">
                  Options (one per line)
                </Label>
                <Textarea
                  id="field-options"
                  {...register('options')}
                  placeholder={'Option 1\nOption 2\nOption 3'}
                  rows={4}
                  className="resize-y font-body"
                />
              </div>
            ) : null}

            {showRating ? (
              <div className="grid gap-2">
                <Label htmlFor="field-rating" className="font-body text-sm text-muted-foreground">
                  Max Rating
                </Label>
                <Select
                  value={watch('ratingMax')}
                  onValueChange={(v) => {
                    setValue('ratingMax', v as '5' | '10', { shouldDirty: true });
                  }}
                >
                  <SelectTrigger id="field-rating" className="font-body">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5" className="font-body">
                      5 stars
                    </SelectItem>
                    <SelectItem value="10" className="font-body">
                      10 stars
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            {precedingFields.length > 0 ? (
              <div className="rounded-lg border border-border p-4 space-y-4 bg-muted/20">
                <div className="flex items-center gap-3">
                  <Switch
                    id="enable-conditional"
                    checked={watch('enableConditional')}
                    onCheckedChange={(checked) => {
                      setValue('enableConditional', checked, { shouldDirty: true });
                    }}
                  />
                  <Label
                    htmlFor="enable-conditional"
                    className="font-body text-sm font-medium text-foreground"
                  >
                    Conditional Visibility
                  </Label>
                </div>

                {watch('enableConditional') ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="cond-field"
                        className="font-body text-xs text-muted-foreground"
                      >
                        Show if this field...
                      </Label>
                      <Select
                        value={watch('conditionalFieldId')}
                        onValueChange={(val) => {
                          setValue('conditionalFieldId', val, { shouldDirty: true });
                          setValue('conditionalValue', '', { shouldDirty: true });
                        }}
                      >
                        <SelectTrigger id="cond-field" className="font-body text-sm">
                          <SelectValue placeholder="Select trigger field..." />
                        </SelectTrigger>
                        <SelectContent>
                          {precedingFields.map((pf) => (
                            <SelectItem key={pf.id} value={pf.id} className="font-body">
                              {pf.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {watch('conditionalFieldId') ? (
                      <div className="grid gap-2">
                        <Label
                          htmlFor="cond-val"
                          className="font-body text-xs text-muted-foreground"
                        >
                          ...equals this value:
                        </Label>
                        {(() => {
                          const selectedTrigger = precedingFields.find(
                            // eslint-disable-next-line react-hooks/incompatible-library
                            (f) => f.id === watch('conditionalFieldId'),
                          );
                          const opts = selectedTrigger?.config?.options || [];
                          if (opts.length > 0) {
                            return (
                              <Select
                                value={watch('conditionalValue')}
                                onValueChange={(val) => {
                                  setValue('conditionalValue', val, { shouldDirty: true });
                                }}
                              >
                                <SelectTrigger id="cond-val" className="font-body text-sm">
                                  <SelectValue placeholder="Select trigger value..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {opts.map((opt) => (
                                    <SelectItem key={opt} value={opt} className="font-body">
                                      {opt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            );
                          }

                          return (
                            <Input
                              id="cond-val"
                              {...register('conditionalValue')}
                              placeholder="Enter value to match..."
                              className="font-body text-sm"
                            />
                          );
                        })()}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!watch('label').trim()}>
              {isEditing ? 'Save Changes' : 'Add Field'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
