import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import type { AuthenticatedRequest, AuthTokenPayload } from '../types';

const parsePayload = (decoded: JwtPayload): AuthenticatedRequest['user'] | null => {
  const id = decoded.Id;
  const email = decoded.email;
  const type = decoded.type;

  if (!id || !email || (type !== 'user' && type !== 'partner')) {
    return null;
  }

  return {
    id: String(id),
    email: String(email),
    type,
  };
};

export const extractToken = (req: Request): string | null => {
  const accessCookieToken = req.cookies?.accessToken;
  if (accessCookieToken) {
    return accessCookieToken;
  }

  const cookieToken = req.cookies?.token;
  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return null;
};

export const decodeAccessToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as AuthTokenPayload;
};

export const attachAuthContext = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    if (!token) {
      next();
      return;
    }

    const decoded = decodeAccessToken(token) as JwtPayload;
    const principal = parsePayload(decoded);

    if (principal) {
      req.user = principal;
    }
  } catch (_error) {
    // Keep this middleware non-blocking; protected routes still enforce auth.
  }

  next();
};

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ message: 'Please login first' });
    return;
  }

  try {
    const decoded = decodeAccessToken(token) as JwtPayload;
    const principal = parsePayload(decoded);

    if (!principal) {
      res.status(401).json({ message: 'Invalid token payload' });
      return;
    }

    req.user = principal;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
    });
  }
};

export const requireRole = (allowedRoles: Array<'user' | 'partner'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Please login first' });
      return;
    }

    if (!allowedRoles.includes(req.user.type)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };
};

export const FoodPartnerAuthMiddleware = [requireAuth, requireRole(['partner'])];
export const userAuthMiddleware = [requireAuth, requireRole(['user'])];
export const combineAuth = requireAuth;