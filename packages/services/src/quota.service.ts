import { count, and, eq, gte, inArray } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { db, forms, submissions, type Plan } from '@starform/database';

const PLAN_LIMITS: Record<
  Plan,
  { forms: number; monthlySubmissions: number; customThemes: boolean }
> = {
  free: { forms: 3, monthlySubmissions: 100, customThemes: false },
  pro: { forms: Infinity, monthlySubmissions: 10_000, customThemes: false },
  enterprise: { forms: Infinity, monthlySubmissions: Infinity, customThemes: true },
};

export async function checkFormLimit(userId: string, userPlan: Plan): Promise<void> {
  const limit = PLAN_LIMITS[userPlan].forms;
  if (limit === Infinity) return;

  const [result] = await db
    .select({ count: count() })
    .from(forms)
    .where(and(eq(forms.creatorId, userId), eq(forms.status, 'published')));

  if (result.count >= limit) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Free plan limited to ${limit} published forms. Upgrade to Pro for unlimited forms.`,
    });
  }
}

export async function checkSubmissionLimit(creatorId: string, userPlan: Plan): Promise<void> {
  const limit = PLAN_LIMITS[userPlan].monthlySubmissions;
  if (limit === Infinity) return;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const creatorFormIds = await db
    .select({ id: forms.id })
    .from(forms)
    .where(eq(forms.creatorId, creatorId));

  if (creatorFormIds.length === 0) return;

  const [result] = await db
    .select({ count: count() })
    .from(submissions)
    .where(
      and(
        gte(submissions.createdAt, startOfMonth),
        inArray(
          submissions.formId,
          creatorFormIds.map((f) => f.id),
        ),
      ),
    );

  if (result.count >= limit) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Free plan limited to ${limit} submissions per month. Upgrade to Pro for more.`,
    });
  }
}

export function checkThemeAccess(userPlan: Plan, isCustomTheme: boolean): void {
  if (isCustomTheme && !PLAN_LIMITS[userPlan].customThemes) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message:
        'Custom themes are only available on the Enterprise plan. Contact sales for details.',
    });
  }
}

export function getPlanLimits(plan: Plan) {
  return PLAN_LIMITS[plan];
}
