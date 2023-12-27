import { Request, Response, NextFunction } from 'express';
import { generateCorrelationId } from './log';

// Add custom property to Request type definition
declare global {
  namespace Express {
    interface Request {
      correlationId: string;
    }
  }
}

export function correlationIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.correlationId = generateCorrelationId();
  next();
}
