import { describe, expect, it } from "vitest";

import { db } from "../database/db.js";

import { loginAs } from "./helpers/auth.helper.js";

describe("Sesiones - Integración", () => {
  it("rechaza una sesión expirada", async () => {
    const { agent, account } = await loginAs("Administrador");

    db.prepare(
      `
      UPDATE sessions
      SET expires_at = ?
      WHERE account_id = ?
    `,
    ).run(Date.now() - 1000, account.id);

    const response = await agent.get("/api/auth/me");

    expect(response.status).toBe(401);
  });

  it("rechaza una cuenta desactivada", async () => {
    const { agent, account } = await loginAs("Administrador");

    db.prepare(
      `
      UPDATE auth_accounts
      SET status = 'Inactivo'
      WHERE id = ?
    `,
    ).run(account.id);

    const response = await agent.get("/api/auth/me");

    expect(response.status).toBe(401);
  });
});
