import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";

import { db } from "../database/db.js";

import { requireAuth } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";

export const productsRouter = Router();
productsRouter.use(requireAuth);

const productSchema = z
  .object({
    name: z.string().trim().min(3).max(100),
    price: z.number().min(0),
    status: z.enum(['Activo', 'Inactivo']),
  })
  .strict();

type ProductData = z.infer<typeof productSchema>;

interface Product extends ProductData {
  id: string;
}

const columns = "id, name, price, status";

// GET /api/products Consultar productos
productsRouter.get("/", requirePermission("products.view"), (_req, res) => {
  const products = db
    .prepare(`SELECT ${columns} FROM products ORDER BY created_at DESC`)
    .all();

  res.json(products);
});


// GET /api/products/:id Consultar un producto por ID
productsRouter.get("/:id", requirePermission("products.view"), (req, res) => {
  if (typeof req.params.id !== "string") {
    res.status(400).json({
      message: "ID de producto inválido.",
    });
    return;
  }
  const product = db
    .prepare(`SELECT ${columns} FROM products WHERE id = ?`)
    .get(req.params.id);

  if (!product) {
    res.status(404).json({
      message: "Producto no encontrado",
    });
    return;
  }

  res.json(product);
});

// POST /api/products Registrar productos
productsRouter.post("/", requirePermission("products.create"), (req, res) => {
  const parsed = productSchema.safeParse(req.body);

  if (!parsed.success) {
    console.error('Error al validar producto:', parsed.error.issues);

    res.status(400).json({
      message: "Datos inválidos",
      errors: z.flattenError(parsed.error),
    });
    return;
  }

  const data = parsed.data;

  const exists = db
    .prepare("SELECT id FROM products WHERE name = ?")
    .get(data.name);

  if (exists) {
    res.status(409).json({
      message: "El producto ya está registrado",
    });
    return;
  }

  const id = randomUUID();

  db.prepare(
    `
    INSERT INTO products (id, name, price, status)
    VALUES (?, ?, ?, ?)
  `,
  ).run(id, data.name, data.price, data.status);

  res.status(201).json({ id, ...data });
});

// PUT /api/products/:id Editar productos
productsRouter.put("/:id", requirePermission("products.edit"), (req, res) => {
  const parsed = productSchema.safeParse(req.body);

  if (!parsed.success) {
    console.error('Error al validar producto:', parsed.error.issues);

    res.status(400).json({
      message: "Datos inválidos",
      errors: z.flattenError(parsed.error),
    });
    return;
  }

  if (typeof req.params.id !== "string") {
    res.status(400).json({
      message: "ID de producto inválido.",
    });
    return;
  }
  const existing = db
    .prepare("SELECT id FROM products WHERE id = ?")
    .get(req.params.id);

  if (!existing) {
    res.status(404).json({
      message: "Producto no encontrado",
    });
    return;
  }

  const data = parsed.data;

  const duplicate = db
    .prepare("SELECT id FROM products WHERE name = ? AND id != ?")
    .get(data.name, req.params.id);

  if (duplicate) {
    res.status(409).json({
      message: "El producto ya está registrado",
    });
    return;
  }

  db.prepare(
    `
    UPDATE products
    SET name = ?, price = ?, status = ?
    WHERE id = ?
  `,
  ).run(data.name, data.price, data.status, req.params.id);

  res.json({
    id: req.params.id,
    ...data,
  });
});

// DELETE /api/products/:id Eliminar productos
productsRouter.delete("/:id", requirePermission("products.delete"), (req, res) => {
  if (typeof req.params.id !== "string") {
    res.status(400).json({
      message: "ID de producto inválido.",
    });
    return;
  }
  const result = db
    .prepare("DELETE FROM products WHERE id = ?")
    .run(req.params.id);

  if (result.changes === 0) {
    res.status(404).json({
      message: "Producto no encontrado",
    });
    return;
  }

  res.status(204).send();
});
