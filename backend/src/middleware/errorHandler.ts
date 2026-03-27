import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/error';

interface ClientErrorResponse {
  success: false;
  message: string;
  name?: string;
  error?: string | object;
  timestamp?: string;
}

export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ClientErrorResponse = {
    success: false,
    message: 'Route not found',
    error: `${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  };
  res.status(404).json(response);
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {

  if (err instanceof AppError) {
    console.error(`[${err.name}] ${err.message}`);

    const response: ClientErrorResponse = {
      success: false,
      message: err.message,
      name: err.name,
      timestamp: new Date().toISOString(),
    };

    //  Safe to send full message for operational errors
    if (err.isOperational) {
      res.status(err.statusCode).json(response);
      return;
    }

    // Programming error (shouldn't happen!) 
    if (process.env.NODE_ENV === 'development') {
      response.error = err.stack;
    }
    res.status(err.statusCode).json(response);
    return;
  }


  console.error(' Unhandled error - this should not happen!', err);

  const response: ClientErrorResponse = {
    success: false,
    message: 'Internal server error',
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === 'development') {
    response.error = err instanceof Error ? err.stack : String(err);
  }

  res.status(500).json(response);
};
