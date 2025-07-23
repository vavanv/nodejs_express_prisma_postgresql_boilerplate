import { AnySchema } from 'yup';
import { Response } from 'express';

export function sendValidated<T>(
  res: Response,
  schema: AnySchema,
  data: unknown,
  status = 200
) {
  try {
    const validated = schema.validateSync(data, {
      abortEarly: false,
      stripUnknown: true,
    });
    return res.status(status).json(validated);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Internal server error: Response validation failed',
      details: err.errors || err.message,
    });
  }
}
