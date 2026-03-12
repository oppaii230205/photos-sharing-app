import { Request } from "express";

/** Default and maximum values for pagination. */
const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 12,
  MAX_LIMIT: 100,
} as const;

export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

/**
 * Extracts and validates pagination params from the request query string.
 *
 * Accepts `?page=2&limit=20`. Clamps values to safe ranges.
 */
export function parsePagination(req: Request): PaginationQuery {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || PAGINATION_DEFAULTS.PAGE);
  const limit = Math.min(
    PAGINATION_DEFAULTS.MAX_LIMIT,
    Math.max(1, parseInt(req.query.limit as string, 10) || PAGINATION_DEFAULTS.LIMIT),
  );

  return { page, limit, skip: (page - 1) * limit };
}

/**
 * Wraps a data array + total count into a standardised paginated envelope.
 */
export function paginate<T>(
  items: T[],
  totalItems: number,
  query: PaginationQuery,
): PaginatedResult<T> {
  return {
    items,
    meta: {
      page: query.page,
      limit: query.limit,
      totalItems,
      totalPages: Math.ceil(totalItems / query.limit),
    },
  };
}
