import { serverRouter, createServerContext } from '@starform/trpc/server';

export const api = serverRouter.createCaller(createServerContext());
