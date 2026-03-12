import { Response } from "express";
import { HttpStatus, HttpStatusCode } from "../constants/httpStatus";

interface ApiResponsePayload<T> {
  success: boolean;
  message: string;
  httpCode: HttpStatusCode;
  data: T | null;
}

/**
 * Builds a consistent envelope object.
 * Used by both `ApiResponse` helpers and the global error handler.
 */
function buildPayload<T>(
  success: boolean,
  message: string,
  httpCode: HttpStatusCode,
  data: T | null = null,
): ApiResponsePayload<T> {
  return { success, message, httpCode, data };
}

/**
 * Thin wrapper around Express `res.json()` that enforces
 * a uniform response shape across every endpoint.
 *
 * Usage:
 *   ApiResponse.ok(res, photos, "Photos retrieved successfully");
 *   ApiResponse.created(res, photo, "Photo uploaded");
 *   ApiResponse.noContent(res);
 *   ApiResponse.error(res, 400, "Validation failed");
 */
export class ApiResponse {
  static ok<T>(res: Response, data: T, message = "Success") {
    return res
      .status(HttpStatus.OK)
      .json(buildPayload(true, message, HttpStatus.OK, data));
  }

  static created<T>(res: Response, data: T, message = "Created successfully") {
    return res
      .status(HttpStatus.CREATED)
      .json(buildPayload(true, message, HttpStatus.CREATED, data));
  }

  static noContent(res: Response) {
    return res.status(HttpStatus.NO_CONTENT).send();
  }

  static error(
    res: Response,
    httpCode: HttpStatusCode,
    message: string,
    data: unknown = null,
  ) {
    return res
      .status(httpCode)
      .json(buildPayload(false, message, httpCode, data));
  }
}
