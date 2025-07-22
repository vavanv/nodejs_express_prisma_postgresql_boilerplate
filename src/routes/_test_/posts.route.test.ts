import request from 'supertest';
import { app } from '../../app';

describe('Posts API', () => {
  it('should return 200 and an array for GET /api/v1/posts', async () => {
    const res = await request(app).get('/api/v1/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for POST /api/v1/posts with missing title or authorId', async () => {
    const res = await request(app)
      .post('/api/v1/posts')
      .send({ content: 'Test' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
