import { Router } from 'express';

import {
  getAllPosts,
  getPostById,
  getPublishedPosts,
  createPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
  getPostsByAuthor,
  getPublishedPostsByAuthor,
  searchPosts,
} from '../controllers/post.controller';
import { validate } from '../middleware/validate';
import { createPostSchema, updatePostSchema } from '../validators/post.validator';

const router = Router();

router.get('/', getAllPosts);
router.get('/published', getPublishedPosts);
router.get('/search', searchPosts);
router.get('/:id', getPostById);
router.post('/', validate(createPostSchema), createPost);
router.put('/:id', validate(updatePostSchema), updatePost);
router.delete('/:id', deletePost);
router.patch('/:id/publish', publishPost);
router.patch('/:id/unpublish', unpublishPost);
router.get('/author/:authorId', getPostsByAuthor);
router.get('/author/:authorId/published', getPublishedPostsByAuthor);

export default router;
