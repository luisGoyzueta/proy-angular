import request from "supertest";
import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import { app } from "../app.js";
import { db } from "../database/db.js";

import { loginAs, TEST_ORIGIN } from "./helpers/auth.helper.js";

function createUserRecord(): string {
  const id = randomUUID();

  db.prepare(
    `
    INSERT INTO users (id, name, email, role, status)
    VALUES (?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    "Usuario de prueba",
    `usuario-${id}@test.local`,
    "Usuario",
    "Activo",
  );

  return id;
}

describe("Permisos RBAC - Integración", () => {
  it("Administrador puede consultar usuarios", async () => {
    const { agent } = await loginAs("Administrador");

    const response = await agent.get("/api/users");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("Administrador puede registrar usuarios", async () => {
    const { agent } = await loginAs("Administrador");

    const response = await agent
      .post("/api/users")
      .set("Origin", TEST_ORIGIN)
      .send({
        name: "Carlos Pérez",
        email: "carlos@example.com",
        role: "Usuario",
        status: "Activo",
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();

    const stored = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get("carlos@example.com");

    expect(stored).toBeDefined();
  });

  it("Editor puede consultar usuarios", async () => {
    const { agent } = await loginAs("Editor");

    const response = await agent.get("/api/users");

    expect(response.status).toBe(200);
  });

  it("Editor puede editar usuarios", async () => {
    const id = createUserRecord();
    const { agent } = await loginAs("Editor");

    const response = await agent
      .put(`/api/users/${id}`)
      .set("Origin", TEST_ORIGIN)
      .send({
        name: "Usuario actualizado",
        email: "actualizado@example.com",
        role: "Usuario",
        status: "Activo",
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Usuario actualizado");
  });

  it("Editor no puede eliminar usuarios", async () => {
    const id = createUserRecord();
    const { agent } = await loginAs("Editor");

    const response = await agent
      .delete(`/api/users/${id}`)
      .set("Origin", TEST_ORIGIN);

    expect(response.status).toBe(403);

    const stored = db.prepare("SELECT id FROM users WHERE id = ?").get(id);

    expect(stored).toBeDefined();
  });

  it("Usuario no puede consultar usuarios", async () => {
    const { agent } = await loginAs("Usuario");

    const response = await agent.get("/api/users");

    expect(response.status).toBe(403);
  });

  it("Sin sesión no se puede eliminar usuarios", async () => {
    const id = createUserRecord();

    const response = await request(app)
      .delete(`/api/users/${id}`)
      .set("Origin", TEST_ORIGIN);

    expect(response.status).toBe(401);
  });

  it("Administrador recibe 404 para usuario inexistente", async () => {
    const { agent } = await loginAs("Administrador");

    const response = await agent.get(`/api/users/${randomUUID()}`);

    expect(response.status).toBe(404);
  });
});
