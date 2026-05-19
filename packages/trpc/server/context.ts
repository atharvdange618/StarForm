import { randomUUID } from 'node:crypto';

import { eq } from 'drizzle-orm';
import { getAuth } from '@clerk/express';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

import { logger, type Logger } from '@starform/logger';
import { db, users } from '@starform/database';

type ExpressReq = CreateExpressContextOptions['req'] & {
  id?: string;
};

export interface ContextUser {
  userId: string;
  roles: string[];
  plan: 'free' | 'pro' | 'enterprise';
  email: string;
  name: string | null;
}

export interface Context {
  user: ContextUser | null;
  req: ExpressReq;
  log: Logger;
}

export async function createContext(opts: CreateExpressContextOptions): Promise<Context> {
  const req = opts.req as ExpressReq;
  const log = logger.child({ reqId: req.id });

  try {
    const auth = getAuth(req);
    const clerkUserId = auth.userId;

    if (!clerkUserId) {
      return { user: null, req, log };
    }

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUserId))
      .limit(1);

    if (existingUser) {
      return {
        user: {
          userId: existingUser.id,
          roles: existingUser.roles,
          plan: existingUser.plan as ContextUser['plan'],
          email: existingUser.email,
          name: existingUser.name,
        },
        req,
        log,
      };
    }

    const inserted = await db
      .insert(users)
      .values({
        clerkId: clerkUserId,
        email: `${clerkUserId}@placeholder.starform.dev`,
        name: null,
      })
      .returning();

    if (!inserted[0]) {
      return { user: null, req, log };
    }

    const newUser = inserted[0];

    return {
      user: {
        userId: newUser.id,
        roles: newUser.roles,
        plan: newUser.plan as ContextUser['plan'],
        email: newUser.email,
        name: newUser.name,
      },
      req,
      log,
    };
  } catch {
    return { user: null, req, log };
  }
}

export function createServerContext(): Context {
  const reqId = randomUUID();
  return {
    user: null,
    req: { id: reqId } as ExpressReq,
    log: logger.child({ reqId }),
  };
}
