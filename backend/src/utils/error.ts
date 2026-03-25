/**
 * Base application error class
 * isOperational = true: expected errors (bad input, user not found)
 * isOperational = false: programming errors (should crash!)
 */
export abstract class AppError extends Error {
  abstract statusCode: number;
  abstract isOperational: boolean;

  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 - Bad Request (validation, malformed data)
export class ValidationError extends AppError {
  statusCode = 400;
  isOperational = true;

  constructor(message: string = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
  }
}

// 401 - Unauthorized (invalid credentials, expired token)
export class AuthError extends AppError {
  statusCode = 401;
  isOperational = true;

  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthError';
  }
}

// 403 - Forbidden (insufficient permissions)
export class ForbiddenError extends AppError {
  statusCode = 403;
  isOperational = true;

  constructor(message: string = 'Access forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

// 404 - Not Found
export class NotFoundError extends AppError {
  statusCode = 404;
  isOperational = true;

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

// 409 - Conflict (duplicate entry, conflicting data)
export class ConflictError extends AppError {
  statusCode = 409;
  isOperational = true;

  constructor(message: string = 'Conflict with existing data') {
    super(message);
    this.name = 'ConflictError';
  }
}

// 500 - Internal Server Error (programming error)
export class InternalError extends AppError {
  statusCode = 500;
  isOperational = false;

  constructor(message: string = 'Internal server error') {
    super(message);
    this.name = 'InternalError';
  }
}