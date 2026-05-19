# StarForm

A form builder SaaS where authenticated users (Creators) build dynamic forms, share them via public/unlisted links, and collect submissions from Respondents who may or may not be authenticated.

## Tech Stack

| Layer          | Technology                  |
| -------------- | --------------------------- |
| **Runtime**    | Node.js                     |
| **Monorepo**   | Turborepo + pnpm            |
| **Backend**    | Express v5 + tRPC           |
| **Frontend**   | Next.js 16 (App Router)     |
| **Database**   | PostgreSQL + Drizzle ORM    |
| **Auth**       | Clerk                       |
| **Validation** | Zod                         |
| **Styling**    | Tailwind CSS v4 + shadcn/ui |
| **API Docs**   | Scalar                      |

## Architecture

```
starform/
  apps/
    api/          # Express v5 server with tRPC, OpenAPI, Scalar docs
    web/          # Next.js 16 frontend (server & client components)
  packages/
    database/     # Drizzle ORM schema, client, migrations
    logger/       # Pino logger (structured, async)
    trpc/         # tRPC router, context (Clerk auth), procedures
    services/     # Business logic (user, form, submission, analytics)
    eslint-config/    # Shared ESLint configs
    typescript-config/ # Shared TS configs
```

### Key Decisions

- **Express v5 + tRPC all-in** - business logic lives in tRPC procedures. Express handles HTTP mount, health check, and CSV export.
- **Next.js is always the client. Express is always the server.** No server actions.
- **Drizzle ORM** with JSONB for flexible field definitions and responses (no EAV pattern).
- **Immutable form versions** - publishing a form creates an immutable snapshot for historical traceability.
- **No pre-aggregated analytics** - Recharts + compute-on-read from raw submissions.
- **IP-hash respondent dedup** - SHA-256(ip + formId) instead of requiring userId for anonymous respondents.

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 11
- PostgreSQL 16+

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment files
cp apps/api/.env apps/api/.env.local

# Set up the database
pnpm --filter @starform/database db:generate
pnpm --filter @starform/database db:migrate

# Start development
pnpm dev
```

This starts both the API (port 8000) and web app (port 3000) in dev mode with hot reload.

### Available Scripts

| Script           | Description                    |
| ---------------- | ------------------------------ |
| `pnpm dev`       | Start all apps in development  |
| `pnpm build`     | Build all apps and packages    |
| `pnpm lint`      | Lint all workspaces            |
| `pnpm typecheck` | Run TypeScript type checking   |
| `pnpm format`    | Format all files with Prettier |

## Packages

### `@starform/database`

PostgreSQL schema with 5 tables: `users`, `themes`, `forms`, `form_versions`, `submissions`. Drizzle ORM with `postgres` driver.

```bash
pnpm --filter @starform/database db:studio  # Open Drizzle Studio
pnpm --filter @starform/database db:generate # Generate migration
pnpm --filter @starform/database db:migrate  # Apply migration
```

### `@starform/trpc`

Shared tRPC setup - routers, procedures (public + protected), context with Clerk auth, and client type exports. Dual-entry: `@starform/trpc/server` and `@starform/trpc/client`.

### `@starform/logger`

Pino-based structured logging with request ID propagation, async emission, and dev-friendly formatting via `pino-pretty`.

## API

The API is documented automatically via Scalar:

- **Docs UI:** `http://localhost:8000/docs`
- **OpenAPI JSON:** `http://localhost:8000/openapi.json`
- **Health Check:** `GET http://localhost:8000/health`
- **tRPC:** `POST http://localhost:8000/trpc`

## Domain Model

| Term           | Definition                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------ |
| **User**       | Clerk-authenticated account                                                                      |
| **Creator**    | Role with permission to build and manage forms                                                   |
| **Respondent** | Person who fills and submits a form (may be anonymous)                                           |
| **Form**       | Dynamic collection of fields with schema, visibility, and config                                 |
| **Field**      | Single input element (text, textarea, number, email, phone, select, multiselect, checkbox, file) |
| **Submission** | A completed form with response data                                                              |
| **Response**   | Value for a specific field within a submission                                                   |

## Planned Features

- 4-step form builder wizard (Details → Fields → Configure → Preview & Publish)
- Single-page form filler
- Submission analytics with Recharts
- CSV export
- Rate limiting with express-rate-limit
- Transactional emails (Nodemailer + EJS)
- Theme system with JSONB config
- Soft deletes on forms and submissions
