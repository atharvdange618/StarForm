import pino from 'pino';

const level = process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'prod' ? 'info' : 'debug');

const transport =
  process.env.NODE_ENV !== 'prod'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined;

export const logger = pino({
  level,
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
    level,
    transport,
    ...opts,
  });
}
