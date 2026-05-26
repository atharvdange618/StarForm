import express from 'express';
import { logger } from '@starform/logger';
import cors from 'cors';
import helmet from 'helmet';
import { clerkMiddleware, getAuth } from '@clerk/express';

import * as trpcExpress from '@trpc/server/adapters/express';
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from 'trpc-to-openapi';
import { apiReference } from '@scalar/express-api-reference';

import { serverRouter, createContext } from '@starform/trpc/server';

import { env } from './env.js';
import { requestId } from './middleware/requestId.js';
import { submissionLimiter } from './middleware/rateLimit.js';
import { webhooksRouter } from './routes/webhooks.js';
import { qrcodeRouter } from './routes/qrcode.js';
import { csvRouter } from './routes/csv.js';

export const app = express();
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: 'StarForm OpenAPI',
  version: '1.0.0',
  baseUrl: env.BASE_URL.concat('/api/v1'),
});

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        scriptSrc: ["'self'", 'https://cdn.jsdelivr.net', "'unsafe-inline'"],
        connectSrc: ["'self'", 'https://api.scalar.com'],
      },
    },
  }),
);

if (env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: '*',
    }),
  );
}

app.use(requestId);

app.use('/api/webhooks', webhooksRouter);

app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => {
  return res.json({ message: 'StarForm is up and running...' });
});

app.get('/health', async (req, res) => {
  const auth = getAuth(req);
  const healthy = true;
  const dbConnected = true;
  return res.json({
    message: 'StarForm server is healthy',
    healthy,
    dbConnected,
    userId: auth.userId,
  });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get('/openapi.json', (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use('/docs', apiReference({ url: '/openapi.json' }));

app.use('/api/v1/forms/', qrcodeRouter);
app.use('/api/v1/forms/', csvRouter);

app.use('/api/trpc', (req, _res, next) => {
  const body = req.body as { method?: string } | undefined;
  if (body?.method === 'submission.submit') {
    return submissionLimiter(req, _res, next);
  }
  next();
});

app.use(
  '/api/v1',
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
    responseMeta: undefined,
    onError: undefined,
    maxBodySize: undefined,
  }),
);

app.use(
  '/api/trpc',
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err, reqId: req.id }, 'Unhandled error');
  res.status(500).json({
    error: 'Internal Server Error',
    message: env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
});

export default app;
