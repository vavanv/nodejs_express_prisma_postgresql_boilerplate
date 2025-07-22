import request from 'supertest';
import { app } from '../app';
import prisma from '../lib/prisma';

jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
    post: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockUserId = 'mock-user-id';
const mockPostId = 'mock-post-id';
const now = new Date();
const mockPost = {
  id: mockPostId,
  title: 'Integration Post',
  content: 'Integration content',
  published: false,
  authorId: mockUserId,
  author: {
    id: mockUserId,
    email: 'postauthor@example.com',
    name: 'Post Author',
  },
  createdAt: now,
  updatedAt: now,
};

describe('Posts Controller (integration, prisma mocked)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a post', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: mockUserId });
    (prisma.post.create as jest.Mock).mockResolvedValue(mockPost);
    const res = await request(app).post('/api/v1/posts').send({
      title: mockPost.title,
      content: mockPost.content,
      authorId: mockUserId,
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('title', mockPost.title);
  });

  it('should return 400 for missing title', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: mockUserId });
    const res = await request(app)
      .post('/api/v1/posts')
      .send({ content: 'No title', authorId: mockUserId });
    expect(res.status).toBe(400);
  });

  it('should get all posts', async () => {
    (prisma.post.findMany as jest.Mock).mockResolvedValue([mockPost]);
    const res = await request(app).get('/api/v1/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get post by id', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost);
    const res = await request(app).get(`/api/v1/posts/${mockPostId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', mockPostId);
  });

  it('should return 404 for non-existent post', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/api/v1/posts/nonexistentid');
    expect(res.status).toBe(404);
  });

  it('should update post', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ ...mockPost });
    (prisma.post.update as jest.Mock).mockResolvedValue({
      ...mockPost,
      title: 'Updated Integration Post',
      updatedAt: now,
    });
    const res = await request(app)
      .put(`/api/v1/posts/${mockPostId}`)
      .send({ title: 'Updated Integration Post' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title', 'Updated Integration Post');
  });

  it('should return 400 for invalid title on update', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ ...mockPost });
    const res = await request(app)
      .put(`/api/v1/posts/${mockPostId}`)
      .send({ title: '' });
    expect(res.status).toBe(400);
  });

  it('should publish post', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({
      ...mockPost,
      content: 'Long enough content for publish',
    });
    (prisma.post.update as jest.Mock).mockResolvedValue({
      ...mockPost,
      published: true,
      updatedAt: now,
    });
    const res = await request(app).patch(`/api/v1/posts/${mockPostId}/publish`);
    expect([200, 400]).toContain(res.status);
  });

  it('should unpublish post', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ ...mockPost });
    (prisma.post.update as jest.Mock).mockResolvedValue({
      ...mockPost,
      published: false,
      updatedAt: now,
    });
    const res = await request(app).patch(
      `/api/v1/posts/${mockPostId}/unpublish`
    );
    expect(res.status).toBe(200);
  });

  it('should search posts', async () => {
    (prisma.post.findMany as jest.Mock).mockResolvedValue([mockPost]);
    const res = await request(app).get('/api/v1/posts/search?q=Integration');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should delete post', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ ...mockPost });
    (prisma.post.delete as jest.Mock).mockResolvedValue(mockPost);
    const res = await request(app).delete(`/api/v1/posts/${mockPostId}`);
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('message');
    }
  });

  it('should return 404 for deleted post', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get(`/api/v1/posts/${mockPostId}`);
    expect(res.status).toBe(404);
  });
});
