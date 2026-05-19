import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  LOG_LEVEL: z.string().default('debug'),
});

const safeParseResult = envSchema.safeParse(process.env);
if (!safeParseResult.success) {
  throw new Error(`Invalid environment variables:\n${safeParseResult.error.message}`);
}

export const env = safeParseResult.data;
export type Env = z.infer<typeof envSchema>;
