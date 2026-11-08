import { createHash, randomBytes } from "node:crypto";
import type { CookieOptions } from "express";
import { db } from "../database/db.js";
import type { AuthAccount } from "./auth.types.js";
export const SESSION_COOKIE = "app_session";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 8;


const isProduction = process.env.NODE_ENV === 'production';

export const sessionCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  path: '/',
};

// export const sessionCookieOptions: CookieOptions = {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   sameSite: "lax",
//   path: "/",
//   maxAge: SESSION_DURATION_MS,
// };

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createSession(accountId: string): string {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  db.prepare(
    `
    INSERT INTO sessions (id, account_id, expires_at)
    VALUES (?, ?, ?)
  `,
  ).run(tokenHash, accountId, expiresAt);
  return token;
}

export function getSessionUser(
  token: string,
): Omit<AuthAccount, "password_hash"> | null {
  if (!/^[0-9a-f]{64}$/.test(token)) {
    return null;
  }

  const tokenHash = hashToken(token);
  const account = db
    .prepare(
      `
    SELECT
      a.id,
      a.name,
      a.email,
      a.role,
      a.status
    FROM sessions s
    INNER JOIN auth_accounts a
      ON a.id = s.account_id
    WHERE s.id = ?
      AND s.expires_at > ?
      AND a.status = 'Activo'
  `,
    )
    .get(tokenHash, Date.now());

  return (account as Omit<AuthAccount, "password_hash"> | undefined) ?? null;
}

export function deleteSession(token: string): void {
  if (!/^[0-9a-f]{64}$/.test(token)) {
    return;
  }
  db.prepare(
    `
    DELETE FROM sessions WHERE id = ?
  `,
  ).run(hashToken(token));
}

export function deleteExpiredSessions(): void {
  db.prepare(
    `
    DELETE FROM sessions WHERE expires_at <= ?
  `,
  ).run(Date.now());
}
