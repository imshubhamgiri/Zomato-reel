import { NextFunction, Request, Response } from 'express';
import type { ProfileRegister, UserLogin, FoodPartnerRegister, FoodPartnerLogin, AddFoodRequest, UpdateFoodRequest } from '../types';
import * as z from 'zod';

type ErrorResponse = {
  success: boolean;
  message: string;
  error?: string | Array<{ field: string; message: string }>;
};

const registerSchema = z.object({
   name: z.string()
    .min(1, 'Name is required') // Catches empty strings
    .regex(/^[a-zA-Z]{2,}\s[a-zA-Z]{2,}$/, 'Name must be First and Last name (e.g., John Doe)'),
  
  email: z.string()
    .min(1, 'Email is required') // Specific message for empty
    .email('Please provide a valid email format') // Handles regex for you
    .toLowerCase()
    .trim(),
    
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
});

const userLoginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please provide a valid email format').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

const partnerRegisterSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().min(1, 'Email is required').email('Please provide a valid email format').toLowerCase().trim(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password is too long'),
  restaurantName: z.string().min(2, 'Restaurant name is required').max(120, 'Restaurant name is too long').trim(),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  address: z.string().min(3, 'Address is required').max(250, 'Address is too long').trim(),
});

const partnerLoginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please provide a valid email format').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

const addFoodSchema = z.object({
  name: z.string().min(2, 'Food name is required').max(120, 'Food name is too long').trim(),
  description: z.string().min(3, 'Description is required').max(500, 'Description is too long').trim(),
  price: z.coerce.number().positive('Price must be greater than 0'),
  type: z.enum(['standard', 'reel'], { message: 'Type must be either standard or reel' }),
});

const updateFoodSchema = z.object({
  foodId: z.string().min(1, 'Food id is required'),
  name: z.string().min(2, 'Food name is required').max(120, 'Food name is too long').trim(),
  description: z.string().min(3, 'Description is required').max(500, 'Description is too long').trim(),
  price: z.coerce.number().positive('Price must be greater than 0'),
  type: z.enum(['standard', 'reel'], { message: 'Type must be either standard or reel' }),
});

const foodActionSchema = z.object({
  foodId: z.string().min(1, 'Food id is required'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});


type RegisterRequest = Request<{}, {}, ProfileRegister>;

const validateSchema = <T>(
  schema: z.ZodType<T>,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((err) => ({
      field: String(err.path[0]),
      message: err.message,
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: errors,
    });
    return;
  }

  req.body = result.data as Record<string, unknown>;
  next();
};

export const validateUserRegister = (
  req: RegisterRequest,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  validateSchema<ProfileRegister>(registerSchema, req, res, next);
};

export const validateUserLogin = (
  req: Request<{}, {}, UserLogin>,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  validateSchema<UserLogin>(userLoginSchema, req, res, next);
};

export const validatePartnerRegister = (
  req: Request<{}, {}, FoodPartnerRegister>,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  validateSchema<FoodPartnerRegister>(partnerRegisterSchema, req, res, next);
};

export const validatePartnerLogin = (
  req: Request<{}, {}, FoodPartnerLogin>,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  validateSchema<FoodPartnerLogin>(partnerLoginSchema, req, res, next);
};

export const validateAddFoodRequest = (
  req: Request<{}, {}, AddFoodRequest>,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  validateSchema<AddFoodRequest>(addFoodSchema, req, res, next);
};

export const validateUpdateFoodRequest = (
  req: Request<{}, {}, UpdateFoodRequest>,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  validateSchema<UpdateFoodRequest>(updateFoodSchema, req, res, next);
};

export const validateFoodActionBody = (
  req: Request<{}, {}, { foodId: string }>,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  validateSchema<{ foodId: string }>(foodActionSchema, req, res, next);
};

export const validateRefreshTokenRequest = (
  req: Request<{}, {}, { refreshToken?: string }>,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  validateSchema<{ refreshToken?: string }>(refreshTokenSchema, req, res, next);
};