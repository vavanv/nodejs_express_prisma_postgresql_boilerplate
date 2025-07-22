import request from 'supertest';
import { app } from '../../app';

describe('Posts API', () => {
  it('should return 200 and an array for GET /api/posts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for POST /api/posts with missing title or authorId', async () => {
    const res = await request(app).post('/api/posts').send({ content: 'Test' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
}); 