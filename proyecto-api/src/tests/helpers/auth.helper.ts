import request from "supertest";
import { randomUUID } from "node:crypto";

import { app } from "../../app.js";
import { db } from "../../database/db.js";
import { hashPassword } from "../../auth/password.js";
import type { AuthRole } from "../../auth/auth.types.js";

export const TEST_ORIGIN = "http://localhost:4200";

const TEST_PASSWORD = "PasswordPrueba123!";

export async function createTestAccount(role: AuthRole): Promise<{
  id: string;
  email: string;
  password: string;
}> {
  const id = randomUUID();

  const email = `${role.toLowerCase()}-${id}@test.local`;

  const passwordHash = await hashPassword(TEST_PASSWORD);

  db.prepare(
    `
    INSERT INTO auth_accounts (
      id,
      name,
      email,
      password_hash,
      role,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  ).run(id, `Cuenta ${role}`, email, passwordHash, role, "Activo");

  return {
    id,
    email,
    password: TEST_PASSWORD,
  };
}

export async function loginAs(role: AuthRole) {
  const account = await createTestAccount(role);

  const agent = request.agent(app);

  const response = await agent
    .post("/api/auth/login")
    .set("Origin", TEST_ORIGIN)
    .send({
      email: account.email,
      password: account.password,
    });

  if (response.status !== 200) {
    throw new Error(`Falló el Login de ${role}: HTTP ${response.status}`);
  }

  return {
    agent,
    account,
    response,
  };
}
