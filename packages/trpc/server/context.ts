import { randomUUID } from 'node:crypto';
import { logger, type Logger } from '@starform/logger';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';

type ExpressReq = CreateExpressContextOptions['req'] & {
  id?: string;
};

export interface Context {
  user: { userId: string } | null;
  req: ExpressReq;
  log: Logger;
}

export async function createContext(opts: CreateExpressContextOptions): Promise<Context> {
  // Never throw here. Auth enforcement happens in protectedProcedure.
  // This function only builds context - attach user if token is valid, null otherwise.
  //
  // When Clerk is wired up:
  //   try {
  //     const { req } = opts;
  //     const session = await clerkClient.sessions.verifySession(token);
  //     return { user: { userId: session.userId } };
  //   } catch {
  //     return { user: null };
  //   }

  const req = opts.req as ExpressReq;
  const log = logger.child({ reqId: req.id });

  return { user: null, req, log };
}

export function createServerContext(): Context {
  const reqId = randomUUID();
  return {
    user: null,
    req: { id: reqId } as ExpressReq,
    log: logger.child({ reqId }),
  };
}
