import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const message = err instanceof Error ? err.message : "Server error";
  return res.status(500).json({ message });
};
