'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FieldData } from '../types';

export function FieldRenderer({ field }: { field: FieldData }) {
  const renderInput = () => {
    switch (field.type) {
      case 'shortText': {
        return (
          <Input
            placeholder={`Enter ${field.label.toLowerCase()}...`}
            maxLength={field.config.maxLength}
            className="font-body"
          />
        );
      }
      case 'longText': {
        return (
          <textarea
            placeholder={`Enter ${field.label.toLowerCase()}...`}
            maxLength={field.config.maxLength}
            className="starform-input min-h-25 resize-y font-body"
            rows={4}
          />
        );
      }
      case 'email': {
        return <Input type="email" placeholder="email@example.com" className="font-body" />;
      }
      case 'number': {
        return (
          <Input
            type="number"
            min={field.config.min}
            max={field.config.max}
            step={field.config.step}
            className="font-body"
          />
        );
      }
      case 'singleSelect':
      case 'dropdown': {
        return (
          <div className="space-y-2">
            {field.config.options?.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary/50"
              >
                <input
                  type="radio"
                  name={`preview-${field.id}`}
                  className="h-4 w-4 accent-primary"
                />
                <span className="font-body text-sm text-foreground">{opt}</span>
              </label>
            ))}
          </div>
        );
      }
      case 'multiSelect': {
        return (
          <div className="space-y-2">
            {field.config.options?.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary/50"
              >
                <input type="checkbox" className="h-4 w-4 rounded accent-primary" />
                <span className="font-body text-sm text-foreground">{opt}</span>
              </label>
            ))}
          </div>
        );
      }
      case 'rating': {
        return (
          <div className="flex gap-1">
            {Array.from(
              { length: typeof field.config.max === 'number' ? field.config.max : 5 },
              (_, i) => (
                <button
                  key={i}
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-muted-foreground transition-colors hover:text-yellow-500"
                >
                  ★
                </button>
              ),
            )}
          </div>
        );
      }
      case 'date': {
        return <Input type="date" className="font-body" />;
      }
      default: {
        return <Input className="font-body" />;
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
    </div>
  );
}
