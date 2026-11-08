// import { DatabaseSync } from "node:sqlite";
// import { mkdirSync } from "node:fs";
// import { join } from "node:path";

// const dataDirectory = join(process.cwd(), "data");

// mkdirSync(dataDirectory, { recursive: true });

// export const db = new DatabaseSync(join(dataDirectory, "database.sqlite"));

// db.exec(`
//   PRAGMA journal_mode = WAL;

//   CREATE TABLE IF NOT EXISTS users (
//     id TEXT PRIMARY KEY,
//     name TEXT NOT NULL,
//     email TEXT NOT NULL COLLATE NOCASE UNIQUE,
//     role TEXT NOT NULL CHECK (
//       role IN ('Administrador', 'Editor', 'Usuario')
//     ),
//     status TEXT NOT NULL CHECK (
//       status IN ('Activo', 'Inactivo')
//     ),
//     created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
//   );
// `);


import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const databasePath =
  process.env.DATABASE_PATH ?? join(process.cwd(), "data", "database.sqlite");

if (databasePath !== ":memory:") {
  mkdirSync(dirname(databasePath), {
    recursive: true,
  });
}

export const db = new DatabaseSync(databasePath);

db.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    role TEXT NOT NULL CHECK (
      role IN ('Administrador', 'Editor', 'Usuario')
    ),
    status TEXT NOT NULL CHECK (
      status IN ('Activo', 'Inactivo')
    ),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);
