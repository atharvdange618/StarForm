import { count, and, eq, gte, inArray } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { db } from '@starform/database/client';
import { forms, submissions, users } from '@starform/database';
import type { Plan } from '@starform/database';

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

  const formCount = result?.count ?? 0;
  if (formCount >= limit) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: `Free plan limited to ${limit} published forms. Upgrade to Pro for unlimited forms.`,
    });
  }
}

export async function checkSubmissionLimit(creatorId: string): Promise<void> {
  const [user] = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, creatorId))
    .limit(1);

  if (!user) return;

  const limit = PLAN_LIMITS[user.plan].monthlySubmissions;
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

  const submissionCount = result?.count ?? 0;
  if (submissionCount >= limit) {
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

export async function getPlanUsage(
  userId: string,
  userPlan: Plan,
): Promise<{
  forms: { current: number; limit: number };
  submissions: { current: number; limit: number };
  customThemes: boolean;
}> {
  const limits = PLAN_LIMITS[userPlan];

  const [formResult] = await db
    .select({ count: count() })
    .from(forms)
    .where(and(eq(forms.creatorId, userId), eq(forms.status, 'published')));
  const formCount = formResult?.count ?? 0;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const creatorFormIds = await db
    .select({ id: forms.id })
    .from(forms)
    .where(eq(forms.creatorId, userId));

  let submissionCount = 0;
  if (creatorFormIds.length > 0) {
    const [submissionResult] = await db
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
    submissionCount = submissionResult?.count ?? 0;
  }

  return {
    forms: {
      current: formCount,
      limit: limits.forms === Infinity ? -1 : limits.forms,
    },
    submissions: {
      current: submissionCount,
      limit: limits.monthlySubmissions === Infinity ? -1 : limits.monthlySubmissions,
    },
    customThemes: limits.customThemes,
  };
}
