import { Request, Response, NextFunction } from 'express';

/**
 * ⚡ ASYNC ERROR WRAPPER
 * 
 * What it does:
 * - Wraps async route handlers to automatically catch errors
 * - Eliminates repetitive try-catch blocks
 * - Passes caught errors to error middleware
 * 
 * Why use it:
 * ✅ Less boilerplate code
 * ✅ Consistent error handling
 * ✅ Promise rejections automatically caught
 * ✅ Errors go to centralized error middleware
 * 
 * Usage:
 *   export const register = asyncHandler(async (req, res) => {
 *     const user = await registerUser(req.body);
 *     res.status(201).json({ success: true, user });
 *   });
 * 
 * That's it! No try-catch needed. Errors automatically handled.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Wrap promise to catch any rejection and pass to next()
    // next(error) triggers error middleware automatically
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
