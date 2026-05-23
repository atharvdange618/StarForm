import { z } from 'zod';

export interface SchematicField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  config: {
    options?: string[];
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    step?: number;
    [key: string]: unknown;
  };
  order: number;
}

export function buildSubmissionSchema(fields: SchematicField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case 'shortText':
        fieldSchema = z.string();
        if (field.config.maxLength !== undefined) {
          fieldSchema = (fieldSchema as z.ZodString).max(field.config.maxLength);
        }
        if (field.config.pattern !== undefined) {
          fieldSchema = (fieldSchema as z.ZodString).regex(new RegExp(field.config.pattern));
        }
        break;
      case 'longText':
        fieldSchema = z.string();
        if (field.config.maxLength !== undefined) {
          fieldSchema = (fieldSchema as z.ZodString).max(field.config.maxLength);
        }
        break;
      case 'email':
        fieldSchema = z.string().email();
        break;
      case 'number':
        fieldSchema = z.number();
        if (field.config.min !== undefined) {
          fieldSchema = (fieldSchema as z.ZodNumber).min(field.config.min);
        }
        if (field.config.max !== undefined) {
          fieldSchema = (fieldSchema as z.ZodNumber).max(field.config.max);
        }
        break;
      case 'singleSelect':
        fieldSchema = z.enum(field.config.options as [string, ...string[]]);
        break;
      case 'multiSelect':
        fieldSchema = z.array(z.enum(field.config.options as [string, ...string[]])).min(1);
        break;
      case 'dropdown':
        fieldSchema = z.enum(field.config.options as [string, ...string[]]);
        break;
      case 'rating':
        fieldSchema = z
          .number()
          .int()
          .min(1)
          .max(field.config.max || 5);
        break;
      case 'date':
        fieldSchema = z.string();
        break;
      default:
        fieldSchema = z.unknown();
        break;
    }

    if (field.required) {
      shape[field.id] = fieldSchema;
    } else {
      shape[field.id] = fieldSchema.optional();
    }
  }

  shape['_sendEmailCopy'] = z.boolean().optional();

  return z.object(shape);
}
