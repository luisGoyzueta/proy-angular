import { beforeEach, vi } from "vitest";

// Configurar el entorno antes de importar la aplicación.
vi.hoisted(() => {
  process.env.DATABASE_PATH = ":memory:";
  process.env.FRONTEND_URL = "http://localhost:4200";
  process.env.NODE_ENV = "test";
});

import { db } from "../database/db.js";
import { initializeAuthDatabase } from "../database/auth-db.js";

initializeAuthDatabase();

beforeEach(() => {
  db.exec(`
    DELETE FROM sessions;
    DELETE FROM auth_accounts;
    DELETE FROM users;
  `);
});
