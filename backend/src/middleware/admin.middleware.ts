import { Request, Response, NextFunction } from "express";

const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Access denied. Admin privileges required." });
    return;
  }

  next();
};

export default adminMiddleware;
