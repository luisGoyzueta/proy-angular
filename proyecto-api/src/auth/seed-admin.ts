import "dotenv/config";
import { randomUUID } from "node:crypto";

import { db } from "../database/db.js";
import { initializeAuthDatabase } from "../database/auth-db.js";
import { hashPassword } from "./password.js";

async function main(): Promise<void> {
  initializeAuthDatabase();

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password || password.length < 12) {
    throw new Error(
      "Configura ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 12 caracteres).",
    );
  }

  const exists = db
    .prepare(
      `
    SELECT id FROM auth_accounts WHERE email = ?
  `,
    )
    .get(email);

  if (exists) {
    console.log("La cuenta ya existe. No se modificó.");
    return;
  }

  const passwordHash = await hashPassword(password);

  db.prepare(
    `
    INSERT INTO auth_accounts (
      id, name, email, password_hash, role, status
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  ).run(
    randomUUID(),
    "Administrador",
    email,
    passwordHash,
    "Administrador",
    "Activo",
  );

  console.log("Administrador creado correctamente.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
