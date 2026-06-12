import { eq } from 'drizzle-orm';
import { db } from '@starform/database/client';
import { users } from '@starform/database';
import type { User, Plan } from '@starform/database';

export async function upsertUser(
  clerkId: string,
  email: string | null,
  name?: string | null,
  plan?: Plan,
): Promise<User> {
  const [existingByClerk] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  if (existingByClerk) {
    const updateValues = {
      email,
      name,
      updatedAt: new Date(),
      ...(plan ? { plan } : {}),
    };
    const [updated] = await db
      .update(users)
      .set(updateValues)
      .where(eq(users.clerkId, clerkId))
      .returning();
    if (!updated) throw new Error('Failed to update user');
    return updated;
  }

  if (email) {
    const [existingByEmail] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingByEmail) {
      const updateValues = {
        clerkId,
        name,
        updatedAt: new Date(),
        ...(plan ? { plan } : {}),
      };
      const [updated] = await db
        .update(users)
        .set(updateValues)
        .where(eq(users.id, existingByEmail.id))
        .returning();
      if (!updated) throw new Error('Failed to update user');
      return updated;
    }
  }

  const insertValues = {
    clerkId,
    email,
    name,
    roles: ['creator', 'respondent'] as string[],
    ...(plan ? { plan } : {}),
  };

  const [inserted] = await db.insert(users).values(insertValues).returning();

  if (!inserted) throw new Error('Failed to upsert user');
  return inserted;
}

export async function me(clerkId: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));
  return user;
}

export async function updateProfile(
  clerkId: string,
  data: Partial<Pick<User, 'name'>>,
): Promise<User | undefined> {
  const [user] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.clerkId, clerkId))
    .returning();
  return user;
}

export async function updatePlan(clerkId: string, plan: Plan): Promise<User | undefined> {
  const [user] = await db
    .update(users)
    .set({ plan, updatedAt: new Date() })
    .where(eq(users.clerkId, clerkId))
    .returning();
  return user;
}
