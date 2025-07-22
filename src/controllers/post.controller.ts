import { Request, Response } from 'express';

import prisma from '../lib/prisma';
import { PostService } from '../services/post.service';
import { getErrorMessage } from '../utils/error-handler';

const postService = new PostService(prisma);

export async function getAllPosts(req: Request, res: Response) {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}

export async function getPostById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const post = await postService.getPostById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
}

export async function getPublishedPosts(req: Request, res: Response) {
  try {
    const posts = await postService.getPublishedPosts();
    res.json(posts);
  } catch {
    res.status(500).json({ error: 'Failed to fetch published posts' });
  }
}

export async function createPost(req: Request, res: Response) {
  try {
    const { title, content, authorId } = req.body;
    const post = await postService.createPost({ title, content, authorId });
    res.status(201).json(post);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage === 'Author not found') {
      return res.status(400).json({ error: errorMessage });
    }
    if (
      errorMessage === 'Post title is required' ||
      errorMessage === 'Post title must be less than 200 characters'
    ) {
      return res.status(400).json({ error: errorMessage });
    }
    res.status(500).json({ error: 'Failed to create post' });
  }
}

export async function updatePost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;
    const post = await postService.updatePost(id, {
      title,
      content,
      published,
    });
    res.json(post);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage === 'Post not found') {
      return res.status(404).json({ error: errorMessage });
    }
    if (
      errorMessage === 'Post title is required' ||
      errorMessage === 'Post title must be less than 200 characters'
    ) {
      return res.status(400).json({ error: errorMessage });
    }
    res.status(500).json({ error: 'Failed to update post' });
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const post = await postService.deletePost(id);
    res.json({ message: 'Post deleted successfully', post });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage === 'Post not found') {
      return res.status(404).json({ error: errorMessage });
    }
    res.status(500).json({ error: 'Failed to delete post' });
  }
}

export async function publishPost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const post = await postService.publishPost(id);
    res.json(post);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage === 'Post not found') {
      return res.status(404).json({ error: errorMessage });
    }
    if (
      errorMessage ===
      'Post must have content (at least 10 characters) before publishing'
    ) {
      return res.status(400).json({ error: errorMessage });
    }
    res.status(500).json({ error: 'Failed to publish post' });
  }
}

export async function unpublishPost(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const post = await postService.unpublishPost(id);
    res.json(post);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage === 'Post not found') {
      return res.status(404).json({ error: errorMessage });
    }
    res.status(500).json({ error: 'Failed to unpublish post' });
  }
}

export async function getPostsByAuthor(req: Request, res: Response) {
  try {
    const { authorId } = req.params;
    const posts = await postService.getPostsByAuthor(authorId);
    res.json(posts);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage === 'Author not found') {
      return res.status(404).json({ error: errorMessage });
    }
    res.status(500).json({ error: 'Failed to fetch posts by author' });
  }
}

export async function getPublishedPostsByAuthor(req: Request, res: Response) {
  try {
    const { authorId } = req.params;
    const posts = await postService.getPublishedPostsByAuthor(authorId);
    res.json(posts);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    if (errorMessage === 'Author not found') {
      return res.status(404).json({ error: errorMessage });
    }
    res
      .status(500)
      .json({ error: 'Failed to fetch published posts by author' });
  }
}

export async function searchPosts(req: Request, res: Response) {
  try {
    const { q } = req.query;
    const query = typeof q === 'string' ? q : '';
    const posts = await postService.searchPosts(query);
    res.json(posts);
  } catch {
    res.status(500).json({ error: 'Failed to search posts' });
  }
}
