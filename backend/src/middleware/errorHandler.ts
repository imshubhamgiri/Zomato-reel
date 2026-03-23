import { NextFunction, Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: `${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = 500;
  const errorMessage = err instanceof Error ? err.message : 'Internal server error';

  console.error('Unhandled error:', err);
  res.status(statusCode).json({
    success: false,
    message: 'Server error',
    error: errorMessage,
  });
};
