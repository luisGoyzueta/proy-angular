import { Router } from "express";
import { z } from "zod";
import { db } from "../database/db.js";
import type { AuthAccount } from "../auth/auth.types.js";
import { verifyPassword } from "../auth/password.js";
import {
  SESSION_COOKIE,
  createSession,
  deleteSession,
  getSessionUser,
  sessionCookieOptions,
} from "../auth/session.js";

export const authRouter = Router();

const loginSchema = z
  .object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(1).max(1024),
  })
  .strict();

// POST /api/auth/login
authRouter.post("/login", async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        message: "Datos de inicio de sesión inválidos.",
      });
      return;
    }

    const { email, password } = parsed.data;
    const account = db
      .prepare(
        `
      SELECT id, name, email, password_hash, role, status
      FROM auth_accounts
      WHERE email = ?
    `,
      )
      .get(email) as AuthAccount | undefined;

    const validPassword = account
      ? await verifyPassword(password, account.password_hash)
      : false;

    if (!account || !validPassword || account.status !== "Activo") {
      res.status(401).json({
        message: "Credenciales incorrectas.",
      });
      return;
    }

    // Invalidar la sesión anterior si existe
    const oldToken = req.cookies?.[SESSION_COOKIE];

    if (typeof oldToken === "string") {
      deleteSession(oldToken);
    }

    const token = createSession(account.id);
    res.cookie(SESSION_COOKIE, token, sessionCookieOptions);
    res.json({
      user: {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        status: account.status,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
authRouter.get("/me", (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE];
  const user = typeof token === "string" ? getSessionUser(token) : null;

  if (!user) {
    res.status(401).json({
      message: "No autenticado.",
    });
    return;
  }

  res.json({ user });
});

// POST /api/auth/logout
authRouter.post("/logout", (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE];

  if (typeof token === "string") {
    deleteSession(token);
  }

  res.clearCookie(SESSION_COOKIE, {
    httpOnly: sessionCookieOptions.httpOnly,
    secure: sessionCookieOptions.secure,
    sameSite: sessionCookieOptions.sameSite,
    path: sessionCookieOptions.path,
  });

  res.status(204).send();
});
