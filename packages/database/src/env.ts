import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
});

const safeParseResult = envSchema.safeParse(process.env);
if (!safeParseResult.success) {
  throw new Error(`Invalid environment variables:\n${safeParseResult.error.message}`);
}

export const env = safeParseResult.data;
export type Env = z.infer<typeof envSchema>;
