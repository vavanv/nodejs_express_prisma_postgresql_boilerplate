import { UserService } from '../services/user.service';
import { PrismaClient } from '@prisma/client';

const prisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(), // Add this line to mock findMany
  },
  post: {
    findMany: jest.fn(),
  },
} as unknown as PrismaClient;

const userService = new UserService(prisma);

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: '1', email: 'a@b.com' });
    const user = await userService.createUser({ email: 'a@b.com' });
    expect(user.email).toBe('a@b.com');
  });

  it('should throw if email exists', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: 'a@b.com' });
    await expect(userService.createUser({ email: 'a@b.com' })).rejects.toThrow('User with this email already exists');
  });

  it('should throw if email is invalid', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(userService.createUser({ email: 'invalid' })).rejects.toThrow('Invalid email format');
  });

  it('should update a user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: '1', email: 'a@b.com' });
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    (prisma.user.update as jest.Mock).mockResolvedValue({ id: '1', email: 'b@b.com' });
    const user = await userService.updateUser('1', { email: 'b@b.com' });
    expect(user.email).toBe('b@b.com');
  });

  it('should throw if user not found on update', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(userService.updateUser('1', { email: 'b@b.com' })).rejects.toThrow('User not found');
  });

  it('should throw if new email already in use on update', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: '1', email: 'a@b.com' });
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: '2', email: 'b@b.com' });
    await expect(userService.updateUser('1', { email: 'b@b.com' })).rejects.toThrow('Email already in use');
  });

  it('should throw if new email is invalid on update', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: '1', email: 'a@b.com' });
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    await expect(userService.updateUser('1', { email: 'invalid' })).rejects.toThrow('Invalid email format');
  });

  it('should delete a user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: 'a@b.com' });
    (prisma.post.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.user.delete as jest.Mock).mockResolvedValue({ id: '1', email: 'a@b.com' });
    const user = await userService.deleteUser('1');
    expect(user.id).toBe('1');
  });

  it('should throw if user not found on delete', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(userService.deleteUser('1')).rejects.toThrow('User not found');
  });

  it('should throw if user has posts on delete', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: 'a@b.com' });
    (prisma.post.findMany as jest.Mock).mockResolvedValue([{}]);
    await expect(userService.deleteUser('1')).rejects.toThrow('Cannot delete user with existing posts');
  });

  it('should get all users', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([{ id: '1', email: 'a@b.com' }]);
    const users = await userService.getAllUsers();
    expect(users.length).toBe(1);
  });

  it('should get user by id', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: 'a@b.com' });
    const user = await userService.getUserById('1');
    expect(user?.id).toBe('1');
  });

  it('should get user posts', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: 'a@b.com', posts: [] });
    const user = await userService.getUserPosts('1');
    expect(user?.id).toBe('1');
  });
}); 