/* eslint-disable no-useless-escape */
import pino from 'pino';
import path from 'path';
import fs from 'fs';
import { env } from './env.js';

const targets = [];

if (env.NODE_ENV !== 'production') {
  targets.push({
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:HH:MM:ss.l',
    },
    level: env.LOG_LEVEL,
  });
} else {
  targets.push({
    target: 'pino/file',
    options: { destination: 1 },
    level: env.LOG_LEVEL,
  });
}

targets.push({
  target: 'pino/file',
  options: {
    destination: path.join(process.cwd(), 'app.log'),
    mkdir: true,
  },
  level: env.LOG_LEVEL,
});

const transport = pino.transport({ targets });

function findWorkspaceRoot(startDir: string): string {
  let dir = startDir;
  while (true) {
    if (
      fs.existsSync(path.join(dir, 'pnpm-workspace.yaml')) ||
      fs.existsSync(path.join(dir, 'pnpm-lock.yaml'))
    ) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  return startDir;
}

function sanitizePaths(text: string): string {
  let sanitized = text.replace(/\\/g, '/');

  try {
    const workspaceRoot = findWorkspaceRoot(process.cwd()).replace(/\\/g, '/');
    const escapedRoot = workspaceRoot.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const rootRegex = new RegExp(escapedRoot, 'gi');
    sanitized = sanitized.replace(rootRegex, '.');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // Ignore error
  }

  const homeDir = process.env.USERPROFILE || process.env.HOME;
  if (homeDir) {
    const home = homeDir.replace(/\\/g, '/');
    const escapedHome = home.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const homeRegex = new RegExp(escapedHome, 'gi');
    sanitized = sanitized.replace(homeRegex, '~');
  }

  sanitized = sanitized.replace(/file:\/\/\/?/gi, '');

  return sanitized;
}

function cleanErrorSerializer(err: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serialized = pino.stdSerializers.err(err as any);
  if (serialized) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (serialized as any).stack;
    if (typeof serialized.message === 'string') {
      serialized.message = sanitizePaths(serialized.message);
    }
  }
  return serialized;
}

export const logger = pino(
  {
    level: env.LOG_LEVEL,
    base: undefined,
    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie', 'err.config.headers'],
      censor: '[REDACTED]',
    },
    serializers: {
      err: cleanErrorSerializer,
      error: cleanErrorSerializer,
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    },
  },
  transport,
);

export type Logger = pino.Logger;
export type ChildLoggerOptions = pino.ChildLoggerOptions;

export function createLogger(opts?: pino.LoggerOptions): pino.Logger {
  return pino(
    {
      level: env.LOG_LEVEL,
      base: undefined,
      ...opts,
    },
    transport,
  );
}
