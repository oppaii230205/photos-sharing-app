import { HttpStatus } from "../constants/httpStatus";

/**
 * Base application error.
 *
 * All custom errors extend this class so the global error handler
 * can distinguish operational (expected) errors from programming bugs.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace in V8
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, HttpStatus.CONFLICT);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, false);
  }
}
