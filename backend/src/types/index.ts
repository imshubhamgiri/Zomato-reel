import { Request } from 'express';

/**
 * Standard API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Extended Request with authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    type: 'user' | 'partner';
  };
}

/**
 * Pagination params
 */
export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Standard paginated response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationParams;
}

/**
 * Error response
 */
export interface ErrorResponse extends ApiResponse {
  success: false;
  error: string;
}
