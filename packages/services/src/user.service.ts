import { eq } from 'drizzle-orm';
import { db } from '@starform/database/client';
import { users } from '@starform/database';
import type { User } from '@starform/database';

export async function upsertUser(
  clerkId: string,
  email: string | null,
  name?: string | null,
): Promise<User> {
  const [user] = await db
    .insert(users)
    .values({
      clerkId,
      email,
      name,
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: {
        email,
        name,
        updatedAt: new Date(),
      },
    })
    .returning();

  if (!user) throw new Error('Failed to upsert user');
  return user;
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
