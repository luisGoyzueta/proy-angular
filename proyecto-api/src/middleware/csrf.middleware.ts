import type { Request, Response, NextFunction } from "express";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const DEFAULT_ALLOWED = [
  "http://localhost:4200",
  "http://127.0.0.1:4200",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

export function csrfProtection(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }

  const allowedOrigins = new Set([
    ...DEFAULT_ALLOWED,
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ]);

  const origin = req.get("Origin");

  // Si se envía el header Origin, debe ser un origen permitido
  if (origin && !allowedOrigins.has(origin)) {
    res.status(403).json({
      message: "Origen de solicitud no autorizado.",
    });
    return;
  }

  next();
}
