import request from 'supertest';
import { app } from '../../app';

describe('Users API', () => {
  it('should return 200 and an array for GET /api/users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 400 for POST /api/users with missing email', async () => {
    const res = await request(app).post('/api/users').send({ name: 'Test' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
}); 