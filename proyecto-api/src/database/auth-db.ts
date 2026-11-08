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
}
