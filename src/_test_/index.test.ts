import { app } from '../app';
import { startServer } from '../index';

jest.mock('../lib/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: {
    $connect: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('index.ts', () => {
  it('should start the server and log messages', async () => {
    const logger = require('../lib/logger').default;
    const prisma = require('../lib/prisma').default;
    const listenMock = jest.fn((port, cb) => cb());
    (app.listen as any) = listenMock;
    await startServer();
    expect(listenMock).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalled();
    expect(prisma.$connect).toBeDefined();
  });
}); 