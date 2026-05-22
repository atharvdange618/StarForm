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

export const fieldConfigs = {
  shortText: z.object({
    maxLength: z.number().int().positive().max(1000).optional(),
    pattern: z.string().optional(),
  }),
  longText: z.object({
    maxLength: z.number().int().positive().max(10000).optional(),
  }),
  email: z.object({}),
  number: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().positive().optional(),
  }),
  singleSelect: z.object({
    options: z.array(z.string()).min(1),
  }),
  multiSelect: z.object({
    options: z.array(z.string()).min(1),
  }),
  dropdown: z.object({
    options: z.array(z.string()).min(1),
  }),
  rating: z.object({
    max: z.union([z.literal(5), z.literal(10)]),
  }),
  date: z.object({
    min: z.string().optional(),
    max: z.string().optional(),
  }),
} as const;

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

export const formCreateSchema = formBaseSchema.extend({
  fields: z.array(fieldDefinitionSchema).min(1),
});

export const formUpdateSchema = formCreateSchema.partial().extend({
  themeId: z.string().uuid().nullable().optional(),
  visibility: z.enum(['public', 'unlisted']).optional(),
  config: z
    .object({
      expiryDate: z.string().datetime().nullable().optional(),
      responseLimit: z.number().int().positive().nullable().optional(),
      password: z.string().min(4).nullable().optional(),
      thankYouMessage: z.string().max(1000).nullable().optional(),
      webhookUrl: z.string().nullable().optional(),
    })
    .optional(),
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

export function buildSubmissionSchema(fields: FieldDefinition[]) {
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
        fieldSchema = z.number().int().min(1).max(field.config.max);
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

  return z.object(shape);
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

export const formOutputSchema = z.object({
  id: z.string().uuid(),
  creatorId: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
  visibility: formVisibilityEnum,
  status: formStatusEnum,
  fields: z.any(),
  themeId: z.string().uuid().nullable(),
  config: z.any(),
  publishedVersion: z.number().int().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
  submissionCount: z.number().int().optional(),
  theme: z.any().optional(),
  versions: z.any().optional(),
});

export const submissionOutputSchema = z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  formVersionId: z.string().uuid(),
  respondentHash: z.string().nullable(),
  data: z.any(),
  metadata: z.any(),
  createdAt: z.date(),
  deletedAt: z.date().nullable(),
  form: z.any().optional(),
});

export const themeOutputSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  config: z.any(),
  isGlobal: z.boolean(),
  creatorId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export { z };
