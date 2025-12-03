import { Request, Response, NextFunction } from "express";

// Client-specific middleware
// Ensures user is authenticated and has CLIENT role
export const clientMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Make sure authMiddleware ran first
  const user = req.user; // populated by authMiddleware
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Ensure user has CLIENT role
  if (user.role !== "CLIENT") {
    return res.status(403).json({ message: "Forbidden: Only clients can access this resource" });
  }

  // Attach client ID for easy access
  (req as any).clientId = user.id;

  next();
};
