import { z } from 'zod';

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