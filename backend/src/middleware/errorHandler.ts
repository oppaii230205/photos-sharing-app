import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../lib/errors";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error("Error:", err.message);

  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
    return;
  }

  if (err.message?.includes("Only image files")) {
    res.status(400).json({ error: err.message });
    return;
  }

  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
}
