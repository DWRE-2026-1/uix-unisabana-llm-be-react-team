import { notImplemented } from "../../utils/not-implemented.js";

export const conversationsService = {
  create: async (_payload) => notImplemented("conversationsService", "create(payload)"),
  listByUser: async (_userId) => notImplemented("conversationsService", "listByUser(userId)"),
  getById: async (_id) => notImplemented("conversationsService", "getById(id)"),
  rename: async (_id, _title) => notImplemented("conversationsService", "rename(id, title)"),
  remove: async (_id) => notImplemented("conversationsService", "remove(id)")
};
