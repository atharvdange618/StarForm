import { randomUUID } from 'node:crypto';

import type { RequestHandler } from 'express';

export const requestId: RequestHandler = (req, res, next) => {
  const existing = req.headers['x-request-id'];
  const id = (Array.isArray(existing) ? existing[0] : existing) ?? randomUUID();
  (req as { id?: string }).id = id;
  res.setHeader('x-request-id', id);
  next();
};
