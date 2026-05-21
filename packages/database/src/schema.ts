import {
  pgTable,
  pgEnum,
  uuid,
  text,
  jsonb,
  timestamp,
  integer,
  boolean,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const visibilityEnum = pgEnum('visibility', ['public', 'unlisted']);

export const statusEnum = pgEnum('status', ['draft', 'published', 'archived']);

export const planEnum = pgEnum('plan', ['free', 'pro', 'enterprise']);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clerkId: text('clerk_id').notNull().unique(),
    email: text('email').unique(),
    name: text('name'),
    roles: text('roles').array().notNull().default(['respondent']),
    plan: planEnum('plan').notNull().default('free'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    uniqueIndex('users_clerk_id_idx').on(table.clerkId),
    uniqueIndex('users_email_idx').on(table.email),
  ],
);

export const themes = pgTable(
  'themes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    config: jsonb('config').notNull(),
    isGlobal: boolean('is_global').notNull().default(false),
    creatorId: uuid('creator_id').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [index('themes_creator_id_idx').on(table.creatorId)],
);

export const forms = pgTable(
  'forms',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    creatorId: uuid('creator_id')
      .notNull()
      .references(() => users.id),
    title: text('title').notNull(),
    description: text('description'),
    slug: text('slug').notNull().unique(),
    visibility: visibilityEnum('visibility').notNull().default('public'),
    status: statusEnum('status').notNull().default('draft'),
    fields: jsonb('fields').notNull().default([]),
    themeId: uuid('theme_id').references(() => themes.id),
    config: jsonb('config').default({}),
    publishedVersion: integer('published_version'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('forms_creator_id_idx').on(table.creatorId),
    uniqueIndex('forms_slug_idx').on(table.slug),
    index('forms_status_idx').on(table.status),
    index('forms_creator_status_idx').on(table.creatorId, table.status),
  ],
);

export const formVersions = pgTable(
  'form_versions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    formId: uuid('form_id')
      .notNull()
      .references(() => forms.id, { onDelete: 'cascade' }),
    version: integer('version').notNull(),
    fields: jsonb('fields').notNull(),
    config: jsonb('config'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('form_versions_form_id_idx').on(table.formId),
    uniqueIndex('form_versions_form_id_version_idx').on(table.formId, table.version),
  ],
);

export const submissions = pgTable(
  'submissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    formId: uuid('form_id')
      .notNull()
      .references(() => forms.id),
    formVersionId: uuid('form_version_id')
      .notNull()
      .references(() => formVersions.id),
    respondentHash: text('respondent_hash'),
    data: jsonb('data').notNull(),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('submissions_form_id_idx').on(table.formId),
    index('submissions_form_version_id_idx').on(table.formVersionId),
    index('submissions_respondent_hash_idx').on(table.respondentHash),
    index('submissions_form_created_idx').on(table.formId, table.createdAt),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  forms: many(forms),
  themes: many(themes),
}));

export const themesRelations = relations(themes, ({ one }) => ({
  creator: one(users, {
    fields: [themes.creatorId],
    references: [users.id],
  }),
}));

export const formsRelations = relations(forms, ({ one, many }) => ({
  creator: one(users, {
    fields: [forms.creatorId],
    references: [users.id],
  }),
  theme: one(themes, {
    fields: [forms.themeId],
    references: [themes.id],
  }),
  versions: many(formVersions),
  submissions: many(submissions),
}));

export const formVersionsRelations = relations(formVersions, ({ one, many }) => ({
  form: one(forms, {
    fields: [formVersions.formId],
    references: [forms.id],
  }),
  submissions: many(submissions),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  form: one(forms, {
    fields: [submissions.formId],
    references: [forms.id],
  }),
  formVersion: one(formVersions, {
    fields: [submissions.formVersionId],
    references: [formVersions.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Form = typeof forms.$inferSelect;
export type NewForm = typeof forms.$inferInsert;
export type FormVersion = typeof formVersions.$inferSelect;
export type NewFormVersion = typeof formVersions.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type Theme = typeof themes.$inferSelect;
export type NewTheme = typeof themes.$inferInsert;
export type Plan = 'free' | 'pro' | 'enterprise';
