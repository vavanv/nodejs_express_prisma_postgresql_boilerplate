import { PostService } from '../services/post.service';
import { PrismaClient } from '@prisma/client';

const prisma = {
  post: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
} as unknown as PrismaClient;

const postService = new PostService(prisma);

describe('PostService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a post', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
    (prisma.post.create as jest.Mock).mockResolvedValue({ id: '1', title: 'Test', authorId: '1' });
    const post = await postService.createPost({ title: 'Test', authorId: '1' });
    expect(post.title).toBe('Test');
  });

  it('should throw if author not found', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(postService.createPost({ title: 'Test', authorId: '1' })).rejects.toThrow('Author not found');
  });

  it('should throw if title is empty', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
    await expect(postService.createPost({ title: '', authorId: '1' })).rejects.toThrow('Post title is required');
  });

  it('should throw if title is too long', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
    await expect(postService.createPost({ title: 'a'.repeat(201), authorId: '1' })).rejects.toThrow('Post title must be less than 200 characters');
  });

  it('should update a post', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: '1', title: 'Old' });
    (prisma.post.update as jest.Mock).mockResolvedValue({ id: '1', title: 'New' });
    const post = await postService.updatePost('1', { title: 'New' });
    expect(post.title).toBe('New');
  });

  it('should throw if post not found on update', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(postService.updatePost('1', { title: 'New' })).rejects.toThrow('Post not found');
  });

  it('should throw if updated title is empty', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: '1', title: 'Old' });
    await expect(postService.updatePost('1', { title: '' })).rejects.toThrow('Post title is required');
  });

  it('should throw if updated title is too long', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: '1', title: 'Old' });
    await expect(postService.updatePost('1', { title: 'a'.repeat(201) })).rejects.toThrow('Post title must be less than 200 characters');
  });

  it('should delete a post', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
    (prisma.post.delete as jest.Mock).mockResolvedValue({ id: '1' });
    const post = await postService.deletePost('1');
    expect(post.id).toBe('1');
  });

  it('should throw if post not found on delete', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(postService.deletePost('1')).rejects.toThrow('Post not found');
  });

  it('should publish a post', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: '1', content: '1234567890' });
    (prisma.post.update as jest.Mock).mockResolvedValue({ id: '1', published: true });
    const post = await postService.publishPost('1');
    expect(post.published).toBe(true);
  });

  it('should throw if post not found on publish', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(postService.publishPost('1')).rejects.toThrow('Post not found');
  });

  it('should throw if post content is too short on publish', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: '1', content: 'short' });
    await expect(postService.publishPost('1')).rejects.toThrow('Post must have content (at least 10 characters) before publishing');
  });

  it('should unpublish a post', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
    (prisma.post.update as jest.Mock).mockResolvedValue({ id: '1', published: false });
    const post = await postService.unpublishPost('1');
    expect(post.published).toBe(false);
  });

  it('should throw if post not found on unpublish', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(postService.unpublishPost('1')).rejects.toThrow('Post not found');
  });

  it('should get all posts', async () => {
    (prisma.post.findMany as jest.Mock).mockResolvedValue([{ id: '1', title: 'Test' }]);
    const posts = await postService.getAllPosts();
    expect(posts.length).toBe(1);
  });

  it('should get post by id', async () => {
    (prisma.post.findUnique as jest.Mock).mockResolvedValue({ id: '1', title: 'Test' });
    const post = await postService.getPostById('1');
    expect(post?.id).toBe('1');
  });

  it('should get published posts', async () => {
    (prisma.post.findMany as jest.Mock).mockResolvedValue([{ id: '1', published: true }]);
    const posts = await postService.getPublishedPosts();
    expect(posts[0].published).toBe(true);
  });

  it('should get posts by author', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
    (prisma.post.findMany as jest.Mock).mockResolvedValue([{ id: '1', authorId: '1' }]);
    const posts = await postService.getPostsByAuthor('1');
    expect(posts[0].authorId).toBe('1');
  });

  it('should throw if author not found for posts by author', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(postService.getPostsByAuthor('1')).rejects.toThrow('Author not found');
  });

  it('should get published posts by author', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
    (prisma.post.findMany as jest.Mock).mockResolvedValue([{ id: '1', authorId: '1', published: true }]);
    const posts = await postService.getPublishedPostsByAuthor('1');
    expect(posts[0].published).toBe(true);
  });

  it('should throw if author not found for published posts by author', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(postService.getPublishedPostsByAuthor('1')).rejects.toThrow('Author not found');
  });

  it('should search posts', async () => {
    (prisma.post.findMany as jest.Mock).mockResolvedValue([{ id: '1', title: 'Test' }]);
    const posts = await postService.searchPosts('Test');
    expect(posts.length).toBe(1);
  });
}); 