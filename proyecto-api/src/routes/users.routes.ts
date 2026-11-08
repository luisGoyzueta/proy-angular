import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";

import { db } from "../database/db.js";

import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";


export const usersRouter = Router();
usersRouter.use(requireAuth);

const userSchema = z
  .object({
    name: z.string().trim().min(3).max(100),
    email: z.email().trim().toLowerCase(),
    role: z.enum(["Administrador", "Editor", "Usuario"]),
    status: z.enum(["Activo", "Inactivo"]),
  })
  .strict();

type UserData = z.infer<typeof userSchema>;

interface User extends UserData {
  id: string;
}

const columns = "id, name, email, role, status";

// GET /api/users Consultar usuarios
usersRouter.get("/", requirePermission("users.view"), (_req, res) => {
  const users = db
    .prepare(`SELECT ${columns} FROM users ORDER BY created_at DESC`)
    .all();

  res.json(users);
});


// GET /api/users/:id Consultar un usuario por ID
usersRouter.get("/:id", requirePermission("users.view"), (req, res) => {
  if (typeof req.params.id !== "string") {
    res.status(400).json({
      message: "ID de usuario inválido.",
    });
    return;
  }
  const user = db
    .prepare(`SELECT ${columns} FROM users WHERE id = ?`)
    .get(req.params.id);

  if (!user) {
    res.status(404).json({
      message: "Usuario no encontrado",
    });
    return;
  }

  res.json(user);
});

// POST /api/users Registrar usuarios
usersRouter.post("/", requirePermission("users.create"), (req, res) => {
  const parsed = userSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Datos inválidos",
      errors: z.flattenError(parsed.error),
    });
    return;
  }

  const data = parsed.data;

  const exists = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(data.email);

  if (exists) {
    res.status(409).json({
      message: "El correo ya está registrado",
    });
    return;
  }

  const id = randomUUID();

  db.prepare(
    `
    INSERT INTO users (id, name, email, role, status)
    VALUES (?, ?, ?, ?, ?)
  `,
  ).run(id, data.name, data.email, data.role, data.status);

  res.status(201).json({ id, ...data });
});

// PUT /api/users/:id Editar usuarios
usersRouter.put("/:id", requirePermission("users.edit"), (req, res) => {
  const parsed = userSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Datos inválidos",
      errors: z.flattenError(parsed.error),
    });
    return;
  }

  if (typeof req.params.id !== "string") {
    res.status(400).json({
      message: "ID de usuario inválido.",
    });
    return;
  }
  const existing = db
    .prepare("SELECT id FROM users WHERE id = ?")
    .get(req.params.id);

  if (!existing) {
    res.status(404).json({
      message: "Usuario no encontrado",
    });
    return;
  }

  const data = parsed.data;

  const duplicate = db
    .prepare("SELECT id FROM users WHERE email = ? AND id != ?")
    .get(data.email, req.params.id);

  if (duplicate) {
    res.status(409).json({
      message: "El correo ya está registrado",
    });
    return;
  }

  db.prepare(
    `
    UPDATE users
    SET name = ?, email = ?, role = ?, status = ?
    WHERE id = ?
  `,
  ).run(data.name, data.email, data.role, data.status, req.params.id);

  res.json({
    id: req.params.id,
    ...data,
  });
});

// DELETE /api/users/:id Eliminar usuarios
usersRouter.delete("/:id", requirePermission("users.delete"), (req, res) => {
  if (typeof req.params.id !== "string") {
    res.status(400).json({
      message: "ID de usuario inválido.",
    });
    return;
  }
  const result = db
    .prepare("DELETE FROM users WHERE id = ?")
    .run(req.params.id);

  if (result.changes === 0) {
    res.status(404).json({
      message: "Usuario no encontrado",
    });
    return;
  }

  res.status(204).send();
});
