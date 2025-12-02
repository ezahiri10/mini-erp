import { Request, Response, NextFunction } from "express";

// Middleware factory
export const roleMiddleware = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Make sure authMiddleware ran first
    const user = req.user; // populated by authMiddleware
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next(); // role is allowed, continue
  };
};