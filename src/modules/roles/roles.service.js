import { rolesRepository } from "./roles.repository.js";
import { notImplemented } from "../../utils/not-implemented.js";

export const rolesService = {
  list: () => notImplemented("rolesService", "list()"),
  create: async (_payload) => notImplemented("rolesService", "create(payload)")
};
