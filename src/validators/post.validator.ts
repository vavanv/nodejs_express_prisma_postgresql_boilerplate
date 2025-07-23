import * as yup from 'yup';

export const createPostSchema = yup.object({
  title: yup
    .string()
    .required('Post title is required')
    .max(200, 'Post title must be less than 200 characters'),
  content: yup.string().optional(),
  authorId: yup.string().required(),
});

export const updatePostSchema = yup.object({
  title: yup
    .string()
    .max(200, 'Post title must be less than 200 characters')
    .optional(),
  content: yup.string().optional(),
  published: yup.boolean().optional(),
});

export const postIdParamSchema = yup.object({
  id: yup.string().required(),
});

export const postSearchQuerySchema = yup.object({
  q: yup.string().optional(),
});

export const postResponseSchema = yup.object({
  id: yup.string().required(),
  title: yup.string().required(),
  content: yup.string().nullable().optional(),
  published: yup.boolean().required(),
  authorId: yup.string().required(),
  createdAt: yup.string().required(),
  updatedAt: yup.string().required(),
  author: yup
    .object({
      id: yup.string().required(),
      email: yup.string().email().required(),
      name: yup.string().nullable().optional(),
      createdAt: yup.string().required(),
      updatedAt: yup.string().required(),
    })
    .optional(),
});

export const postListResponseSchema = yup.array().of(postResponseSchema);
