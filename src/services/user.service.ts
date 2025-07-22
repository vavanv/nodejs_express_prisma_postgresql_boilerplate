import { PrismaClient, User } from '@prisma/client';

export interface CreateUserData {
  email: string;
  name?: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
}

export class UserService {
  constructor(private prisma: PrismaClient) {}

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: { posts: true },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { posts: true },
    });
  }

  async createUser(data: CreateUserData): Promise<User> {
    // Business logic: Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Business logic: Validate email format
    if (!this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    return this.prisma.user.create({
      data,
      include: { posts: true },
    });
  }

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    // Business logic: Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    // Business logic: If updating email, check if new email already exists
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        throw new Error('Email already in use');
      }

      if (!this.isValidEmail(data.email)) {
        throw new Error('Invalid email format');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data,
      include: { posts: true },
    });
  }

  async deleteUser(id: string): Promise<User> {
    // Business logic: Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error('User not found');
    }

    // Business logic: Check if user has posts (optional: prevent deletion if has posts)
    const userPosts = await this.prisma.post.findMany({
      where: { authorId: id },
    });

    if (userPosts.length > 0) {
      throw new Error('Cannot delete user with existing posts');
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserPosts(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { posts: true },
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
