import { Request, Response, NextFunction } from "express";

/**
 * Wraps an async Express route handler so that any rejected promise
 * is automatically forwarded to `next()`, eliminating repetitive
 * try/catch blocks in every controller method.
 *
 * Usage:
 *   router.get("/photos", catchAsync(async (req, res) => { ... }));
 */
type AsyncRequestHandler<P = any> = (
  req: Request<P>,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export const catchAsync =
  <P = any>(fn: AsyncRequestHandler<P>) =>
  (req: Request<P>, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
