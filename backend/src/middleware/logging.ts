import { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from '../types';
import appLogger from '../logger';

const logger = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const startedAt = Date.now();
  const userTag = req.user ? `${req.user.type}:${req.user.id}` : 'anonymous';

  // console.log('🔵 MIDDLEWARE: Request started', req.method, req.originalUrl);

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    // console.log(`[${new Date().toISOString()}] ${res.statusCode} ${req.method} ${req.originalUrl} user=${userTag} ${durationMs}ms`);
    appLogger.info('HTTP request completed', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      user: userTag,
      ip: req.ip
    });
  });

  res.on('error', (error: Error) => {
    appLogger.error('HTTP response error', {
      method: req.method,
      path: req.originalUrl,
      user: userTag,
      error: error.message
    });
  });

  next();
};

export default logger;
