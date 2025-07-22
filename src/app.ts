import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';

import { getApiInfo } from './controllers/index.controller';
import logger from './lib/logger';
import prisma from './lib/prisma';
import morganMiddleware from './middleware/morgan';
import limiter from './middleware/rateLimit';
import { apiRoutes, healthRouter } from './routes/index.route';
import { swaggerSpec, swaggerUi } from './swagger';

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger docs
app.use('/api/v1-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API info route
app.get('/api/v1', (_: Request, res: Response) => {
  res.json(getApiInfo());
});

// Mount routes
app.use('/health', healthRouter);
app.use('/api/v1', apiRoutes);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response) => {
  logger.error(err.stack || err.message);
  res.status(500).json({ error: 'Something went wrong!' });
});

export { app, prisma };
