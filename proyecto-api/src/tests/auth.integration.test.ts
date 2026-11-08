import request from "supertest";

import { describe, expect, it } from "vitest";

import { app } from "../app.js";

import { loginAs, TEST_ORIGIN } from "./helpers/auth.helper.js";

describe("Autenticación real - Integración", () => {
  it("Administrador puede iniciar sesión", async () => {
    const { response } = await loginAs("Administrador");

    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe("Administrador");
    expect(response.body.user.password_hash).toBeUndefined();

    const cookies = response.headers["set-cookie"];

    expect(cookies).toBeDefined();
  });

  it("GET /auth/me devuelve el usuario autenticado", async () => {
    const { agent } = await loginAs("Administrador");

    const response = await agent.get("/api/auth/me");

    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe("Administrador");
  });

  it("GET /auth/me sin sesión devuelve 401", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
  });

  it("Logout invalida la sesión", async () => {
    const { agent } = await loginAs("Administrador");

    const logout = await agent
      .post("/api/auth/logout")
      .set("Origin", TEST_ORIGIN);

    expect(logout.status).toBe(204);

    const me = await agent.get("/api/auth/me");

    expect(me.status).toBe(401);
  });
});
