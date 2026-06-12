import { randomUUID } from 'node:crypto';

import { eq } from 'drizzle-orm';
import { getAuth, clerkClient } from '@clerk/express';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

import { logger, type Logger } from '@starform/logger';
import { db } from '@starform/database/client';
import { users } from '@starform/database';
import { userService } from '@starform/services';

type ExpressReq = CreateExpressContextOptions['req'] & {
  id?: string;
};

export interface ContextUser {
  userId: string;
  clerkId: string;
  roles: string[];
  plan: 'free' | 'pro' | 'enterprise';
  email: string | null;
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
          clerkId: existingUser.clerkId,
          roles: existingUser.roles,
          plan: existingUser.plan as ContextUser['plan'],
          email: existingUser.email,
          name: existingUser.name,
        },
        req,
        log,
      };
    }

    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const primaryEmailObj = clerkUser.emailAddresses?.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    );
    const email = primaryEmailObj?.emailAddress ?? null;
    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null;
    const plan =
      clerkUser.unsafeMetadata?.plan === 'free' ||
      clerkUser.unsafeMetadata?.plan === 'pro' ||
      clerkUser.unsafeMetadata?.plan === 'enterprise'
        ? (clerkUser.unsafeMetadata.plan as ContextUser['plan'])
        : 'free';

    const newUser = await userService.upsertUser(clerkUserId, email, name, plan);

    return {
      user: {
        userId: newUser.id,
        clerkId: newUser.clerkId,
        roles: newUser.roles,
        plan: newUser.plan as ContextUser['plan'],
        email: newUser.email,
        name: newUser.name,
      },
      req,
      log,
    };
  } catch (error) {
    log.error({ err: error }, 'Error in createContext');
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
