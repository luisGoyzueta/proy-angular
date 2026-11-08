import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../app.js";

describe("API REST - Seguridad", () => {
  it("GET /api/health devuelve 200", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("GET /api/users sin sesión devuelve 401", async () => {
    const response = await request(app).get("/api/users");

    expect(response.status).toBe(401);
  });

  it("POST /api/users sin sesión devuelve 401", async () => {
    const response = await request(app)
      .post("/api/users")
      .set("Origin", "http://localhost:4200")
      .send({
        name: "Usuario de prueba",
        email: "prueba@example.com",
        role: "Usuario",
        status: "Activo",
      });

    expect(response.status).toBe(401);
  });

  it("DELETE /api/users sin sesión devuelve 401", async () => {
    const response = await request(app)
      .delete("/api/users/123")
      .set("Origin", "http://localhost:4200");

    expect(response.status).toBe(401);
  });

  it("Login incorrecto devuelve 401", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .set("Origin", "http://localhost:4200")
      .send({
        email: "noexiste@example.com",
        password: "PasswordIncorrecta123!",
      });

    expect(response.status).toBe(401);
  });

  it("Una ruta inexistente devuelve 404", async () => {
    const response = await request(app).get("/api/ruta-inexistente");

    expect(response.status).toBe(404);
  });
});
