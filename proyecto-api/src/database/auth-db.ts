import { randomBytes, scryptSync, randomUUID } from "node:crypto";
import { db } from "./db.js";

export function initializeAuthDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS auth_accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (
        role IN ('Administrador', 'Editor', 'Usuario')
      ),
      status TEXT NOT NULL DEFAULT 'Activo'
        CHECK (status IN ('Activo', 'Inactivo')),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (account_id)
        REFERENCES auth_accounts(id)
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_account
      ON sessions(account_id);

    CREATE INDEX IF NOT EXISTS idx_sessions_expiry
      ON sessions(expires_at);
  `);

  // Sembrar cuenta inicial de demostración si la base de datos está vacía
  const countRow = db.prepare("SELECT count(*) as count FROM auth_accounts").get() as { count: number } | undefined;
  if (!countRow || countRow.count === 0) {
    const salt = randomBytes(16).toString("hex");
    const key = scryptSync("Admin123!", salt, 64).toString("hex");
    const passwordHash = `${salt}:${key}`;
    const adminId = randomUUID();

    db.prepare(`
      INSERT OR IGNORE INTO auth_accounts (id, name, email, password_hash, role, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(adminId, "Administrador", "admin@demo.com", passwordHash, "Administrador", "Activo");

    db.prepare(`
      INSERT OR IGNORE INTO users (id, name, email, role, status)
      VALUES (?, ?, ?, ?, ?)
    `).run(adminId, "Administrador", "admin@demo.com", "Administrador", "Activo");
  }
}
