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

const normalizeAddressPayload = (raw: unknown): unknown => {
  if (!raw || typeof raw !== 'object') {
    return raw;
  }

  const body = { ...(raw as Record<string, unknown>) };

  if (typeof body.postalcode === 'string' && typeof body.postalCode !== 'string') {
    body.postalCode = body.postalcode;
  }

  if (typeof body.label === 'string') {
    body.label = body.label.trim().toLowerCase();
  }

  return body;
};

const requiredTrimmedString = (field: string, min = 1, max = 250, lowercase = false) =>
  z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      return lowercase ? trimmed.toLowerCase() : trimmed;
    },
    z.string().min(min, `${field} is required`).max(max, `${field} is too long`)
  );

const optionalTrimmedString = (max = 250, lowercase = false) =>
  z.preprocess(
    (value) => {
      if (value === undefined || value === null) return undefined;
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      if (!trimmed) return undefined;
      return lowercase ? trimmed.toLowerCase() : trimmed;
    },
    z.string().max(max, 'Field is too long').optional()
  );

const normalizedLabelSchema = z
  .enum(['home', 'work', 'other'], { message: 'Label must be Home, Work, or Other' })
  .transform((label) => {
    if (label === 'home') return 'Home' as const;
    if (label === 'work') return 'Work' as const;
    return 'Other' as const;
  });

const addAddressSchema = z.preprocess(
  normalizeAddressPayload,
  z.object({
    fullName: requiredTrimmedString('Full name', 2, 100),
    phone: z.preprocess(
      (value) => (typeof value === 'string' ? value.trim() : value),
      z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits')
    ),
    postalCode: z.preprocess(
      (value) => (typeof value === 'string' ? value.trim() : value),
      z.string().regex(/^[0-9]{6}$/, 'Postal code must be 6 digits')
    ),
    locality: requiredTrimmedString('Locality', 2, 120, true),
    address: requiredTrimmedString('Address', 3, 250, true),
    city: requiredTrimmedString('City', 2, 80, true),
    state: requiredTrimmedString('State', 2, 80, true),
    country: optionalTrimmedString(80, true),
    landmark: optionalTrimmedString(120, true),
    alternatePhone: z.preprocess(
      (value) => {
        if (value === undefined || value === null) return undefined;
        if (typeof value !== 'string') return value;
        const trimmed = value.trim();
        return trimmed || undefined;
      },
      z
        .string()
        .regex(/^[0-9]{10}$/, 'Alternate phone must be 10 digits')
        .optional()
    ),
    label: normalizedLabelSchema.default('Home'),
    isDefault: z.boolean().optional(),
  })
);

const updateAddressSchema = z.preprocess(
  normalizeAddressPayload,
  z
    .object({
      fullName: optionalTrimmedString(100),
      phone: z.preprocess(
        (value) => {
          if (value === undefined || value === null) return undefined;
          if (typeof value !== 'string') return value;
          const trimmed = value.trim();
          return trimmed || undefined;
        },
        z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits').optional()
      ),
      postalCode: z.preprocess(
        (value) => {
          if (value === undefined || value === null) return undefined;
          if (typeof value !== 'string') return value;
          const trimmed = value.trim();
          return trimmed || undefined;
        },
        z.string().regex(/^[0-9]{6}$/, 'Postal code must be 6 digits').optional()
      ),
      locality: optionalTrimmedString(120, true),
      address: optionalTrimmedString(250, true),
      city: optionalTrimmedString(80, true),
      state: optionalTrimmedString(80, true),
      country: optionalTrimmedString(80, true),
      landmark: optionalTrimmedString(120, true),
      alternatePhone: z.preprocess(
        (value) => {
          if (value === undefined || value === null) return undefined;
          if (typeof value !== 'string') return value;
          const trimmed = value.trim();
          return trimmed || undefined;
        },
        z
          .string()
          .regex(/^[0-9]{10}$/, 'Alternate phone must be 10 digits')
          .optional()
      ),
      label: z.preprocess(
        (value) => {
          if (value === undefined || value === null) return undefined;
          if (typeof value !== 'string') return value;
          const trimmed = value.trim();
          return trimmed ? trimmed.toLowerCase() : undefined;
        },
        normalizedLabelSchema.optional()
      ),
      isDefault: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one address field is required for update',
    })
);


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

export const validateAddAddressRequest = (
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  validateSchema(addAddressSchema, req, res, next);
};

export const validateUpdateAddressRequest = (
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  validateSchema(updateAddressSchema, req, res, next);
};