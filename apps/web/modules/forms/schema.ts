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

export function isFieldVisible(
  field: { id: string; config: { conditionalVisibility?: { fieldId: string; value: string } } },
  data: Record<string, unknown>,
  fields: Array<{
    id: string;
    config: { conditionalVisibility?: { fieldId: string; value: string } };
  }>,
): boolean {
  const cond = field.config?.conditionalVisibility;
  if (!cond || !cond.fieldId || !cond.value) return true;

  const triggerField = fields.find((f) => f.id === cond.fieldId);
  if (triggerField && !isFieldVisible(triggerField, data, fields)) {
    return false;
  }

  const triggerValue = data[cond.fieldId];
  if (Array.isArray(triggerValue)) {
    return triggerValue.includes(cond.value);
  }
  return String(triggerValue ?? '') === cond.value;
}

function getFieldValidator(field: SchematicField): z.ZodTypeAny {
  switch (field.type) {
    case 'shortText': {
      let schema = z.string();
      if (field.config.maxLength !== undefined) {
        schema = schema.max(field.config.maxLength);
      }
      if (field.config.pattern !== undefined) {
        schema = schema.regex(new RegExp(field.config.pattern));
      }
      return schema;
    }
    case 'longText': {
      let schema = z.string();
      if (field.config.maxLength !== undefined) {
        schema = schema.max(field.config.maxLength);
      }
      return schema;
    }
    case 'email':
      return z.string().email();
    case 'number': {
      let schema = z.number();
      if (field.config.min !== undefined) {
        schema = schema.min(field.config.min);
      }
      if (field.config.max !== undefined) {
        schema = schema.max(field.config.max);
      }
      return schema;
    }
    case 'singleSelect':
      return z.enum(field.config.options as [string, ...string[]]);
    case 'multiSelect':
      return z.array(z.enum(field.config.options as [string, ...string[]])).min(1);
    case 'dropdown':
      return z.enum(field.config.options as [string, ...string[]]);
    case 'rating':
      return z
        .number()
        .int()
        .min(1)
        .max(field.config.max || 5);
    case 'date':
      return z.string();
    default:
      return z.unknown();
  }
}

export function buildSubmissionSchema(fields: SchematicField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    shape[field.id] = z.any().optional().nullable();
  }

  shape['_sendEmailCopy'] = z.boolean().optional();
  shape['_respondentEmail'] = z.string().optional().nullable();

  return z.object(shape).superRefine((data, ctx) => {
    const dataRecord = data as Record<string, unknown>;
    for (const field of fields) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const visible = isFieldVisible(field as any, dataRecord, fields as any);
      if (visible) {
        const val = dataRecord[field.id];
        const isEmpty = val === undefined || val === null || val === '';

        if (field.required && isEmpty) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'This field is required',
            path: [field.id],
          });
        } else if (!isEmpty) {
          const validator = getFieldValidator(field);
          const parsed = validator.safeParse(val);
          if (!parsed.success) {
            for (const issue of parsed.error.issues) {
              ctx.addIssue({
                ...issue,
                path: [field.id, ...issue.path],
              });
            }
          }
        }
      }
    }

    if (dataRecord._sendEmailCopy && !fields.some((f) => f.type === 'email')) {
      const email = dataRecord._respondentEmail;
      if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid email address to receive a copy of your responses',
          path: ['_respondentEmail'],
        });
      }
    }
  });
}
