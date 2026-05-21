import { router } from './trpc';

import { healthRouter } from './routes/health/route';
import { userRouter } from './routes/user/route';
import { formRouter } from './routes/form/route';
import { themeRouter } from './routes/theme/route';
import { submissionRouter } from './routes/submission/route';
import { analyticsRouter } from './routes/analytics/route';

export const serverRouter = router({
  health: healthRouter,
  user: userRouter,
  form: formRouter,
  theme: themeRouter,
  submission: submissionRouter,
  analytics: analyticsRouter,
});

export { createContext, createServerContext } from './context';
export type { Context } from './context';
export type ServerRouter = typeof serverRouter;
