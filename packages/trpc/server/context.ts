import { CreateExpressContextOptions } from '@trpc/server/adapters/express';

export interface Context {
  user: { userId: string } | null;
}

export async function createContext(_opts: CreateExpressContextOptions): Promise<Context> {
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

  return { user: null };
}
