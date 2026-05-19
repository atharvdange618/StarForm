import { createTRPCReact } from '@trpc/react-query';
import type { ServerRouter } from '@starform/trpc/server';

export const trpc = createTRPCReact<ServerRouter>();
