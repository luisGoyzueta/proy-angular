import type { Request, Response, NextFunction } from "express";

import { SESSION_COOKIE, getSessionUser } from "../auth/session.js";

import type { PublicAuthUser } from "../auth/auth.types.js";

// Extender el tipo Request de Express
declare global {
  namespace Express {
    interface Request {
      authUser?: PublicAuthUser;
    }
  }
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.[SESSION_COOKIE];

  if (typeof token !== "string") {
    res.status(401).json({
      message: "Debes iniciar sesión.",
    });
    return;
  }

  const user = getSessionUser(token);

  if (!user) {
    res.status(401).json({
      message: "Sesión inválida o expirada.",
    });
    return;
  }

  req.authUser = user;

  next();
}
