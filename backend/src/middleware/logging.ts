import { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../types';

const logger = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  const startedAt = Date.now();
  const userTag = req.user ? `${req.user.type}:${req.user.id}` : 'anonymous';

  req.on('end', () => {
    const durationMs = Date.now() - startedAt;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} user=${userTag} ${durationMs}ms`);
  });

  next();
};

export default logger;
