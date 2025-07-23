import { AnySchema } from 'yup';
import { Request, Response, NextFunction } from 'express';

export const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      req.body = validated;
      next();
    } catch (err: any) {
      return res.status(400).json({
        error: 'Validation failed',
        details: err.errors || err.message,
      });
    }
  };
