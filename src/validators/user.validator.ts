import { z } from 'zod';

// Restore all Zod schemas at the top to avoid circular import issues
export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const userListResponseSchema = z.array(userResponseSchema);

export const userIdParamSchema = z.object({
  id: z.string().uuid().or(z.string().min(1)), // Use uuid() if IDs are UUIDs, else min(1)
});

export const userListQuerySchema = z.object({
  page: z
    .string()
    .regex(/^[0-9]+$/)
    .optional(),
  limit: z
    .string()
    .regex(/^[0-9]+$/)
    .optional(),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  name: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
