import dotenv from 'dotenv';

import { app, prisma } from './app';
import logger from './lib/logger';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Start server
export async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('✅ Database connected successfully');

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📊 Health check: http://localhost:${PORT}/health`);
      logger.info(`🔧 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

if (require.main === module) {
  startServer();
}