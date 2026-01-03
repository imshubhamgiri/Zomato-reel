import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { FoodPartner } from '../models/foodPartner.model';
import User from '../models/userModel';
import type { AuthenticatedRequest } from '../types';

export const FoodPartnerAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: 'Please Login first' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const foodPartner = await FoodPartner.findById(decoded.Id);

    if (!foodPartner) {
      res.status(401).json({ message: 'Partner Invalid token' });
      return;
    }

    req.user = {
      id: foodPartner._id.toString(),
      email: foodPartner.email,
      type: 'partner',
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export const userAuthMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: 'Please login first' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const user = await User.findById(decoded.Id);

    if (!user) {
      res.status(401).json({ message: 'User Invalid token' });
      return;
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      type: 'user',
    };

    next();
  } catch (error) {
    res.status(401).json({
      message: 'Authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
    });
  }
};

export const loginMiddleware = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: 'Please Login First' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const user = (await User.findById(decoded.Id)) || (await FoodPartner.findById(decoded.Id));

    if (!user) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    const userType = (user as any).restaurantName ? 'partner' : 'user';
    const responseData: any = {
      message: 'User found',
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      userType: userType,
    };

    if (userType === 'partner') {
      responseData.restaurantName = (user as any).restaurantName;
      responseData.phone = (user as any).phone;
      responseData.address = (user as any).address;
    }

    res.status(200).json(responseData);
  } catch (error) {
    res.status(401).json({
      message: 'Authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
    });
  }
};

export const combineAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: 'Please Login first' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // FoodPartner check
    const foodPartner = await FoodPartner.findById(decoded.Id);
    if (foodPartner) {
      req.user = {
        id: foodPartner._id.toString(),
        email: foodPartner.email,
        type: 'partner',
      };
      return next();
    }

    // If not a partner, check for User
    const user = await User.findById(decoded.Id);
    if (user) {
      req.user = {
        id: user._id.toString(),
        email: user.email,
        type: 'user',
      };
      return next();
    }

    res.status(401).json({ message: 'Invalid token' });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};