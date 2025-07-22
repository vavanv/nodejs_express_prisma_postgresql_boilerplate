import { PrismaClient, Post } from '@prisma/client';

export interface CreatePostData {
  title: string;
  content?: string;
  authorId: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  published?: boolean;
}

export class PostService {
  constructor(private prisma: PrismaClient) {}

  async getAllPosts(): Promise<Post[]> {
    return this.prisma.post.findMany({
      include: { author: true },
    });
  }

  async getPostById(id: string): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  async getPublishedPosts(): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: { published: true },
      include: { author: true },
    });
  }

  async createPost(data: CreatePostData): Promise<Post> {
    // Business logic: Validate author exists
    const author = await this.prisma.user.findUnique({
      where: { id: data.authorId },
    });

    if (!author) {
      throw new Error('Author not found');
    }

    // Business logic: Validate title is not empty
    if (!data.title.trim()) {
      throw new Error('Post title is required');
    }

    // Business logic: Validate title length
    if (data.title.length > 200) {
      throw new Error('Post title must be less than 200 characters');
    }

    return this.prisma.post.create({
      data,
      include: { author: true },
    });
  }

  async updatePost(id: string, data: UpdatePostData): Promise<Post> {
    // Business logic: Check if post exists
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    // Business logic: Validate title if provided
    if (data.title !== undefined) {
      if (!data.title.trim()) {
        throw new Error('Post title is required');
      }

      if (data.title.length > 200) {
        throw new Error('Post title must be less than 200 characters');
      }
    }

    return this.prisma.post.update({
      where: { id },
      data,
      include: { author: true },
    });
  }

  async deletePost(id: string): Promise<Post> {
    // Business logic: Check if post exists
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    return this.prisma.post.delete({
      where: { id },
    });
  }

  async publishPost(id: string): Promise<Post> {
    // Business logic: Check if post exists
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    // Business logic: Check if post has content before publishing
    if (!existingPost.content || existingPost.content.trim().length < 10) {
      throw new Error(
        'Post must have content (at least 10 characters) before publishing'
      );
    }

    return this.prisma.post.update({
      where: { id },
      data: { published: true },
      include: { author: true },
    });
  }

  async unpublishPost(id: string): Promise<Post> {
    // Business logic: Check if post exists
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    return this.prisma.post.update({
      where: { id },
      data: { published: false },
      include: { author: true },
    });
  }

  async getPostsByAuthor(authorId: string): Promise<Post[]> {
    // Business logic: Validate author exists
    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      throw new Error('Author not found');
    }

    return this.prisma.post.findMany({
      where: { authorId },
      include: { author: true },
    });
  }

  async getPublishedPostsByAuthor(authorId: string): Promise<Post[]> {
    // Business logic: Validate author exists
    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!author) {
      throw new Error('Author not found');
    }

    return this.prisma.post.findMany({
      where: {
        authorId,
        published: true,
      },
      include: { author: true },
    });
  }

  async searchPosts(query: string): Promise<Post[]> {
    if (!query.trim()) {
      return this.getAllPosts();
    }

    return this.prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { author: true },
    });
  }
}
