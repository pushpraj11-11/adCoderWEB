import { NextFunction, Response } from "express";
import { Role } from "@prisma/client";
import { AuthRequest } from "../types";

export const requireRole = (role: Role) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
};
