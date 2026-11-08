import { randomUUID } from "node:crypto";

import { db } from "../database/db.js";
import { initializeAuthDatabase } from "../database/auth-db.js";
import { hashPassword } from "../auth/password.js";

async function main(): Promise<void> {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  if (!email || !password) {
    throw new Error("Faltan E2E_EMAIL o E2E_PASSWORD");
  }

  initializeAuthDatabase();

  const passwordHash = await hashPassword(password);

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
  ).run(
    randomUUID(),
    "Administrador E2E",
    email,
    passwordHash,
    "Administrador",
    "Activo",
  );

  console.log("Cuenta E2E creada correctamente.");
  db.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
