import pino from 'pino';
import { env } from './env.js';

const transport =
  env.NODE_ENV !== 'production'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: true,
          ignore: 'pid,hostname',
          translateTime: 'SYS:HH:MM:ss.l',
        },
      }
    : undefined;

export const logger = pino({
  level: env.LOG_LEVEL,
  transport,
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'err.config.headers'],
    censor: '[REDACTED]',
  },
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
});

export type Logger = pino.Logger;
export type ChildLoggerOptions = pino.ChildLoggerOptions;

export function createLogger(opts?: pino.LoggerOptions): pino.Logger {
  return pino({
    level: env.LOG_LEVEL,
    transport,
    ...opts,
  });
}
