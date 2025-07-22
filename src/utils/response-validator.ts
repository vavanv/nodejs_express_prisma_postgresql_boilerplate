import { ZodSchema } from 'zod';
import { Response } from 'express';

export function sendValidated<T>(
  res: Response,
  schema: ZodSchema<T>,
  data: unknown,
  status = 200
) {
  const result = schema.safeParse(data);
  if (!result.success) {
    return res.status(500).json({
      error: 'Internal server error: Response validation failed',
      details: result.error.issues,
    });
  }
  return res.status(status).json(result.data);
}
