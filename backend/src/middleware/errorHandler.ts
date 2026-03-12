import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { AppError } from "../lib/errors";
import { ApiResponse } from "../lib/apiResponse";
import { HttpStatus } from "../constants/httpStatus";
import { env } from "../config";

/**
 * Global error-handling middleware.
 *
 * This is the single point where every unhandled error lands.
 * It translates errors into the standard API response envelope so
 * consumers always receive a predictable shape.
 *
 * Order of checks:
 *  1. Operational AppError  → use its own statusCode & message
 *  2. Multer file-upload    → 400 Bad Request
 *  3. Everything else       → 500 (hide details in production)
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // 1. Known operational errors thrown by our code
  if (err instanceof AppError) {
    ApiResponse.error(res, err.statusCode, err.message);
    return;
  }

  // 2. Multer errors (file too large, wrong MIME type, etc.)
  if (err instanceof multer.MulterError) {
    const messages: Record<string, string> = {
      LIMIT_FILE_SIZE: "File size exceeds the 5 MB limit",
      LIMIT_UNEXPECTED_FILE: "Unexpected file field",
    };
    ApiResponse.error(
      res,
      HttpStatus.BAD_REQUEST,
      messages[err.code] ?? err.message,
    );
    return;
  }

  // 3. Unexpected / programming errors — log full details, return generic message
  console.error("Unhandled error:", err);

  const message =
    env.NODE_ENV === "development"
      ? err.message
      : "Something went wrong. Please try again later.";

  ApiResponse.error(res, HttpStatus.INTERNAL_SERVER_ERROR, message);
}
