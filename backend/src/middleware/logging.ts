import { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../types';

const logger = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const startedAt = Date.now();
  const userTag = req.user ? `${req.user.type}:${req.user.id}` : 'anonymous';

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    console.log(`[${new Date().toISOString()}] ${res.statusCode} ${req.method} ${req.originalUrl} user=${userTag} ${durationMs}ms`);
  });

  next();
};

export default logger;
