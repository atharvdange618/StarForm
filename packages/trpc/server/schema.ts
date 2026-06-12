import { z } from 'zod';

export const fieldTypeEnum = z.enum([
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

export type FieldType = z.infer<typeof fieldTypeEnum>;

const conditionalVisibilitySchema = z
  .object({
    fieldId: z.string().uuid(),
    value: z.string(),
  })
  .optional();

export const fieldConfigs = {
  shortText: z.object({
    maxLength: z.number().int().positive().max(1000).optional(),
    pattern: z.string().optional(),
    conditionalVisibility: conditionalVisibilitySchema,
  }),
  longText: z.object({
    maxLength: z.number().int().positive().max(10000).optional(),
    conditionalVisibility: conditionalVisibilitySchema,
  }),
  email: z.object({
    conditionalVisibility: conditionalVisibilitySchema,
  }),
  number: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().positive().optional(),
    conditionalVisibility: conditionalVisibilitySchema,
  }),
  singleSelect: z.object({
    options: z.array(z.string()).min(1),
    conditionalVisibility: conditionalVisibilitySchema,
  }),
  multiSelect: z.object({
    options: z.array(z.string()).min(1),
    conditionalVisibility: conditionalVisibilitySchema,
  }),
  dropdown: z.object({
    options: z.array(z.string()).min(1),
    conditionalVisibility: conditionalVisibilitySchema,
  }),
  rating: z.object({
    max: z.union([z.literal(5), z.literal(10)]),
    conditionalVisibility: conditionalVisibilitySchema,
  }),
  date: z.object({
    min: z.string().optional(),
    max: z.string().optional(),
    conditionalVisibility: conditionalVisibilitySchema,
  }),
};

export const fieldDefinitionSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string().uuid(),
    type: z.literal('shortText'),
    label: z.string().min(1),
    required: z.boolean().default(false),
    config: fieldConfigs.shortText,
    order: z.number().int().min(0),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('longText'),
    label: z.string().min(1),
    required: z.boolean().default(false),
    config: fieldConfigs.longText,
    order: z.number().int().min(0),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('email'),
    label: z.string().min(1),
    required: z.boolean().default(false),
    config: fieldConfigs.email,
    order: z.number().int().min(0),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('number'),
    label: z.string().min(1),
    required: z.boolean().default(false),
    config: fieldConfigs.number,
    order: z.number().int().min(0),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('singleSelect'),
    label: z.string().min(1),
    required: z.boolean().default(false),
    config: fieldConfigs.singleSelect,
    order: z.number().int().min(0),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('multiSelect'),
    label: z.string().min(1),
    required: z.boolean().default(false),
    config: fieldConfigs.multiSelect,
    order: z.number().int().min(0),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('dropdown'),
    label: z.string().min(1),
    required: z.boolean().default(false),
    config: fieldConfigs.dropdown,
    order: z.number().int().min(0),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('rating'),
    label: z.string().min(1),
    required: z.boolean().default(false),
    config: fieldConfigs.rating,
    order: z.number().int().min(0),
  }),
  z.object({
    id: z.string().uuid(),
    type: z.literal('date'),
    label: z.string().min(1),
    required: z.boolean().default(false),
    config: fieldConfigs.date,
    order: z.number().int().min(0),
  }),
]);

export type FieldDefinition = z.infer<typeof fieldDefinitionSchema>;

export const formBaseSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens')
    .optional(),
});

export const formConfigSchema = z.object({
  expiryDate: z.string().datetime().nullable().optional(),
  responseLimit: z.number().int().positive().nullable().optional(),
  password: z.string().min(4).nullable().optional(),
  thankYouMessage: z.string().max(1000).nullable().optional(),
  webhookUrl: z.string().nullable().optional(),
});

export const formCreateSchema = formBaseSchema.extend({
  fields: z.array(fieldDefinitionSchema).min(1),
});

export const formUpdateSchema = formCreateSchema.partial().extend({
  themeId: z.string().uuid().nullable().optional(),
  visibility: z.enum(['public', 'unlisted']).optional(),
  config: formConfigSchema.optional(),
});

export const publishConfigSchema = z.object({
  themeId: z.string().uuid().optional(),
  visibility: z.enum(['public', 'unlisted']).optional(),
  expiryDate: z.string().datetime().optional(),
  responseLimit: z.number().int().positive().optional(),
  password: z.string().min(4).optional(),
  thankYouMessage: z.string().max(1000).optional(),
});

export type PublishConfig = z.infer<typeof publishConfigSchema>;

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

function getFieldValidator(field: FieldDefinition): z.ZodTypeAny {
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

export function buildSubmissionSchema(fields: FieldDefinition[]) {
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

export const formVisibilityEnum = z.enum(['public', 'unlisted']);
export const formStatusEnum = z.enum(['draft', 'published', 'archived']);
export const planEnum = z.enum(['free', 'pro', 'enterprise']);

export const zodUndefinedModel = z.undefined().describe('undefined');

export const userOutputSchema = z.object({
  id: z.string().uuid(),
  clerkId: z.string(),
  email: z.string().nullable(),
  name: z.string().nullable(),
  roles: z.array(z.string()),
  plan: planEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const userUsageOutputSchema = z.object({
  forms: z.object({
    current: z.number(),
    limit: z.number(),
  }),
  submissions: z.object({
    current: z.number(),
    limit: z.number(),
  }),
  customThemes: z.boolean(),
});

export const themeOutputSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  config: z.unknown(),
  isGlobal: z.boolean(),
  creatorId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type Theme = z.infer<typeof themeOutputSchema>;

export const formOutputSchema = z.object({
  id: z.string().uuid(),
  creatorId: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  visibility: formVisibilityEnum,
  status: formStatusEnum,
  fields: z.unknown(),
  themeId: z.string().uuid().nullable(),
  config: z.unknown(),
  publishedVersion: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  submissionCount: z.number().int().optional(),
  theme: z.unknown().optional(),
  versions: z.unknown().optional(),
});

export type Form = z.infer<typeof formOutputSchema>;

export const publicFormOutputSchema = z.object({
  id: z.string().uuid(),
  creatorId: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  fields: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date(),
  submissionCount: z.number().int().optional(),
  theme: z.unknown().optional(),
  creator: z
    .object({
      name: z.string().nullable(),
    })
    .optional(),
});

export type PublicForm = z.infer<typeof publicFormOutputSchema>;

export const submissionOutputSchema = z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  formVersionId: z.string().uuid(),
  respondentHash: z.string().nullable(),
  data: z.unknown(),
  metadata: z.unknown(),
  createdAt: z.date(),
  deletedAt: z.date().nullable(),
  form: z.unknown().optional(),
});

export { z };
