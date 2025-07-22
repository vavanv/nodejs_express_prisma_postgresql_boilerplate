import { Router } from 'express';

import healthRouter from './health.route';
import postsRouter from './posts.route';
import usersRouter from './users.route';

const router = Router();

// Mount route modules
router.use('/users', usersRouter);
router.use('/posts', postsRouter);

export { router as apiRoutes, healthRouter };
