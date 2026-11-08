import type { Request, Response, NextFunction } from "express";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function csrfProtection(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }

  const allowedOrigin = process.env.FRONTEND_URL ?? "http://localhost:4200";

  const origin = req.get("Origin");

  if (origin !== allowedOrigin) {
    res.status(403).json({
      message: "Origen de solicitud no autorizado.",
    });
    return;
  }

  next();
}
