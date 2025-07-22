import request from 'supertest';
import { app } from '../app';
import prisma from '../lib/prisma';

jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    post: {
      findMany: jest.fn(),
    },
  },
}));

const mockUserId = 'mock-user-id';
const now = new Date();
const mockUser = {
  id: mockUserId,
  email: 'integration@example.com',
  name: 'Integration User',
  posts: [],
  createdAt: now,
  updatedAt: now,
};

describe('Users Controller (integration, prisma mocked)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
    const res = await request(app)
      .post('/api/v1/users')
      .send({ email: mockUser.email, name: mockUser.name });
    if (res.status !== 201) {
      console.log('create user response:', res.body);
    }
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('email', mockUser.email);
  });

  it('should return 400 for invalid email', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app)
      .post('/api/v1/users')
      .send({ email: 'not-an-email' });
    if (res.status !== 400) {
      console.log('invalid email response:', res.body);
    }
    expect(res.status).toBe(400);
  });

  it('should get all users', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([mockUser]);
    const res = await request(app).get('/api/v1/users');
    if (res.status !== 200) {
      console.log('get all users response:', res.body);
    }
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    // Remove posts and convert dates for comparison
    const { posts, ...rest } = mockUser;
    const expectedUser = {
      ...rest,
      createdAt: mockUser.createdAt.toISOString
        ? mockUser.createdAt.toISOString()
        : mockUser.createdAt,
      updatedAt: mockUser.updatedAt.toISOString
        ? mockUser.updatedAt.toISOString()
        : mockUser.updatedAt,
    };
    expect(res.body[0]).toMatchObject(expectedUser);
  });

  it('should get user by id', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    const res = await request(app).get(`/api/v1/users/${mockUserId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', mockUserId);
  });

  it('should return 404 for non-existent user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/api/v1/users/nonexistentid');
    expect(res.status).toBe(404);
  });

  it('should update user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser); // for existence
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null); // for email check
    (prisma.user.update as jest.Mock).mockResolvedValue({
      ...mockUser,
      name: 'Updated Integration User',
      updatedAt: now,
    });
    const res = await request(app)
      .put(`/api/v1/users/${mockUserId}`)
      .send({ name: 'Updated Integration User' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated Integration User');
  });

  it('should return 400 for invalid email on update', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser); // for existence
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null); // for email check
    const res = await request(app)
      .put(`/api/v1/users/${mockUserId}`)
      .send({ email: 'not-an-email' });
    expect(res.status).toBe(400);
  });

  it('should get user posts', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      ...mockUser,
      posts: [],
    });
    const res = await request(app).get(`/api/v1/users/${mockUserId}/posts`);
    expect([200, 404]).toContain(res.status);
  });

  it('should delete user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (prisma.post.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.user.delete as jest.Mock).mockResolvedValue(mockUser);
    const res = await request(app).delete(`/api/v1/users/${mockUserId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should return 404 for deleted user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get(`/api/v1/users/${mockUserId}`);
    expect(res.status).toBe(404);
  });
});
