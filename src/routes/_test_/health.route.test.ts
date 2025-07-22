import request from 'supertest';
import { app } from '../../app';

describe('Health API', () => {
  it('should return 200 and status OK for GET /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
  });
});
 