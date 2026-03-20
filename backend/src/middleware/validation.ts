import { NextFunction, Request, Response } from 'express';
import type { ErrorResponse, ProfileRegister } from '../types';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const nameRegex = /^[a-zA-Z]{2,}\s[a-zA-Z]{2,}$/;

type RegisterRequest = Request<{}, {}, Partial<ProfileRegister>>;

export const validateUserRegister = (
  req: RegisterRequest,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  const { name, email, password } = req.body;

  if (typeof name !== 'string' || !nameRegex.test(name.trim())) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: 'Name must be at least 2 characters and contain only letters and a space (e.g., "John Doe")',
    });
    return;
  }

  if (typeof email !== 'string' || !emailRegex.test(email.trim().toLowerCase())) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: 'Please provide a valid email',
    });
    return;
  }

  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    });
    return;
  }

  req.body = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
  };

  next();
};