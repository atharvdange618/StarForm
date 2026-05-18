import express from 'express';
import { logger } from '@starform/logger';
import cors from 'cors';

import * as trpcExpress from '@trpc/server/adapters/express';
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from 'trpc-to-openapi';
import { apiReference } from '@scalar/express-api-reference';

import { serverRouter, createContext } from '@starform/trpc/server';

import { env } from './env';

export const app = express();
const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: 'StarForm OpenAPI',
  version: '1.0.0',
  baseUrl: env.BASE_URL.concat('/api'),
});

if (env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: '*',
    }),
  );
}

app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ message: 'StarForm is up and running...' });
});

app.get('/health', (req, res) => {
  return res.json({ message: 'StarForm server is healthy', healthy: true });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get('/openapi.json', (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use('/docs', apiReference({ url: '/openapi.json' }));

app.use(
  '/api',
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
    responseMeta: undefined,
    onError: undefined,
    maxBodySize: undefined,
  }),
);

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;
