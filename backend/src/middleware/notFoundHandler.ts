import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../lib/errors";

/**
 * Catch-all middleware for undefined routes.
 * Must be registered after all valid route handlers.
 */
export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
}
