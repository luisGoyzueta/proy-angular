import type { AuthRole } from "../auth/auth.types.js";

export type Permission =
  | "dashboard.view"
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  | "settings.view";

export const ROLE_PERMISSIONS: Record<AuthRole, readonly Permission[]> = {
  Administrador: [
    "dashboard.view",
    "users.view",
    "users.create",
    "users.edit",
    "users.delete",
    "settings.view",
  ],

  Editor: ["dashboard.view", "users.view", "users.edit"],

  Usuario: ["dashboard.view"],
};
