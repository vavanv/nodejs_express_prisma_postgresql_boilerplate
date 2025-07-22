import request from 'supertest';
import { app } from '../app';
import express, { Request, Response, NextFunction } from 'express';

describe('App', () => {
  it('should return API info for GET /api', async () => {
    const res = await request(app).get('/api');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('version');
  });

  it('should handle errors with error middleware (isolated)', async () => {
    const errorApp = express();
    errorApp.get('/error', () => {
      throw new Error('Test error');
    });
    // Add error handler
    errorApp.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      res.status(500).json({ error: err.message });
    });
    const res = await request(errorApp).get('/error');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Test error');
  });
}); 