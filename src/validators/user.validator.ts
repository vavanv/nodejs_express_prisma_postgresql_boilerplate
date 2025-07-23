import * as yup from 'yup';

export const createUserSchema = yup.object({
  email: yup.string().email().required(),
  name: yup.string().optional(),
});

export const updateUserSchema = yup.object({
  email: yup.string().email('Invalid email address').optional(),
  name: yup.string().optional(),
});

export const userIdParamSchema = yup.object({
  id: yup.string().required(), // Use .uuid() if IDs are UUIDs
});

export const userListQuerySchema = yup.object({
  page: yup
    .string()
    .matches(/^[0-9]+$/)
    .optional(),
  limit: yup
    .string()
    .matches(/^[0-9]+$/)
    .optional(),
});

export const userResponseSchema = yup.object({
  id: yup.string().required(),
  email: yup.string().email().required(),
  name: yup.string().nullable().optional(),
  createdAt: yup.string().required(),
  updatedAt: yup.string().required(),
});

export const userListResponseSchema = yup.array().of(userResponseSchema);
