import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Skip rate limiting in test environment
const isTestEnv = process.env.NODE_ENV === 'test';

const skipRequestHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next();
};

export const globalApiLimiter = isTestEnv ? skipRequestHandler : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
  },
});

export const authLimiter = isTestEnv ? skipRequestHandler : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
});

export const refreshLimiter = isTestEnv ? skipRequestHandler : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many token refresh attempts, please try again later.',
  },
});

export const actionLimiter = isTestEnv ? skipRequestHandler : rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please slow down.',
  },
});
