import { eq, or } from 'drizzle-orm';
import { db } from '@starform/database/client';
import { themes } from '@starform/database';
import type { NewTheme } from '@starform/database';
import { TRPCError } from '@trpc/server';

export async function list(creatorId?: string) {
  const whereClause = creatorId
    ? or(eq(themes.isGlobal, true), eq(themes.creatorId, creatorId))
    : eq(themes.isGlobal, true);

  return await db.query.themes.findMany({
    where: whereClause,
  });
}

export async function getById(themeId: string) {
  const theme = await db.query.themes.findFirst({
    where: eq(themes.id, themeId),
  });

  if (!theme) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Theme not found' });
  }

  return theme;
}

export async function create(
  creatorId: string,
  data: Omit<NewTheme, 'id' | 'creatorId' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
) {
  const [theme] = await db
    .insert(themes)
    .values({
      ...data,
      creatorId,
    })
    .returning();

  return theme;
}
