import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Wrap promise to catch any rejection and pass to next()
    // next(error) triggers error middleware automatically
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
