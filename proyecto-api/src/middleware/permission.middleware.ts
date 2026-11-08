import type { Request, Response, NextFunction } from "express";

import { ROLE_PERMISSIONS, type Permission } from "../config/permissions.js";

export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.authUser;

    if (!user) {
      res.status(401).json({
        message: "Usuario no autenticado.",
      });
      return;
    }

    const permissions = ROLE_PERMISSIONS[user.role] ?? [];

    if (!permissions.includes(permission)) {
      res.status(403).json({
        message: "No tienes permisos para esta operación.",
      });
      return;
    }

    next();
  };
}
