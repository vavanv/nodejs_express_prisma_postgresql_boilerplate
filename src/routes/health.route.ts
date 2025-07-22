import { Router, Request, Response } from 'express';

import { getHealth } from '../controllers/health.controller';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json(getHealth());
});

export default router;
