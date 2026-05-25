'use client';

import type { UseFormRegister, FieldErrors, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateTimePicker } from '@/components/datetime-picker';
import type { FieldData } from '../types';

interface InteractiveFieldRendererProps {
  field: FieldData;
  register: UseFormRegister<Record<string, unknown>>;
  errors: FieldErrors<Record<string, unknown>>;
  control: Control<Record<string, unknown>>;
}

export function InteractiveFieldRenderer({
  field,
  register,
  errors,
  control,
}: InteractiveFieldRendererProps) {
  const fieldError = errors[field.id];

  const renderInput = () => {
    switch (field.type) {
      case 'shortText': {
        return (
          <Input
            {...register(field.id, { required: field.required })}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
            maxLength={field.config.maxLength}
            className="font-body"
          />
        );
      }
      case 'longText': {
        return (
          <textarea
            {...register(field.id, { required: field.required })}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
            maxLength={field.config.maxLength}
            className="starform-input min-h-25 resize-y font-body"
            rows={4}
          />
        );
      }
      case 'email': {
        return (
          <Input
            {...register(field.id, { required: field.required })}
            type="email"
            placeholder="email@example.com"
            className="font-body"
          />
        );
      }
      case 'number': {
        return (
          <Input
            {...register(field.id, { required: field.required, valueAsNumber: true })}
            type="number"
            min={field.config.min}
            max={field.config.max}
            step={field.config.step}
            className="font-body"
          />
        );
      }
      case 'singleSelect': {
        return (
          <Controller
            name={field.id}
            control={control}
            rules={{ required: field.required }}
            render={({ field: controllerField }) => (
              <RadioGroup
                value={controllerField.value as string}
                onValueChange={controllerField.onChange}
                className="space-y-2"
              >
                {field.config.options?.map((opt) => (
                  <label
                    key={opt}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary/50"
                  >
                    <RadioGroupItem value={opt} />
                    <span className="font-body text-sm text-foreground">{opt}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />
        );
      }
      case 'multiSelect': {
        return (
          <Controller
            name={field.id}
            control={control}
            rules={{ required: field.required }}
            render={({ field: controllerField }) => {
              const selected = (controllerField.value as string[]) || [];
              return (
                <div className="space-y-2">
                  {field.config.options?.map((opt) => {
                    const isChecked = selected.includes(opt);
                    return (
                      <label
                        key={opt}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary/50"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              controllerField.onChange([...selected, opt]);
                            } else {
                              controllerField.onChange(selected.filter((v) => v !== opt));
                            }
                          }}
                        />
                        <span className="font-body text-sm text-foreground">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              );
            }}
          />
        );
      }
      case 'dropdown': {
        return (
          <Controller
            name={field.id}
            control={control}
            rules={{ required: field.required }}
            render={({ field: controllerField }) => (
              <Select
                value={(controllerField.value as string) || ''}
                onValueChange={controllerField.onChange}
              >
                <SelectTrigger className="font-body">
                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
                </SelectTrigger>
                <SelectContent>
                  {field.config.options?.map((opt) => (
                    <SelectItem key={opt} value={opt} className="font-body">
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );
      }
      case 'rating': {
        const maxRating = typeof field.config.max === 'number' ? field.config.max : 5;
        return (
          <Controller
            name={field.id}
            control={control}
            rules={{ required: field.required }}
            render={({ field: controllerField }) => (
              <div className="flex gap-1">
                {Array.from({ length: maxRating }, (_, i) => {
                  const starValue = i + 1;
                  const isFilled =
                    controllerField.value !== undefined &&
                    starValue <= (controllerField.value as number);
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => controllerField.onChange(starValue)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-lg transition-colors ${
                        isFilled
                          ? 'text-yellow-500 hover:text-yellow-600'
                          : 'text-muted-foreground hover:text-yellow-400'
                      }`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
            )}
          />
        );
      }
      case 'date': {
        return (
          <Controller
            name={field.id}
            control={control}
            rules={{ required: field.required }}
            render={({ field: controllerField }) => (
              <DateTimePicker
                allowPastDates
                date={controllerField.value ? new Date(controllerField.value as string) : undefined}
                onDateChange={(d) => controllerField.onChange(d ? d.toISOString() : undefined)}
                placeholder={`Select ${field.label.toLowerCase()}...`}
              />
            )}
          />
        );
      }
      default: {
        return <Input {...register(field.id)} className="font-body" />;
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label className="font-body text-sm text-foreground">
        {field.label}
        {field.required ? <span className="ml-1 text-destructive">*</span> : null}
      </Label>
      {renderInput()}
      {fieldError && (
        <p className="font-body text-xs text-destructive">
          {(fieldError.message as string) || 'This field is required'}
        </p>
      )}
    </div>
  );
}
