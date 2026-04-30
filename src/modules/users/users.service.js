import { notImplemented } from "../../utils/not-implemented.js";

export const usersService = {
  async list() {
    return notImplemented("usersService", "list()");
  },
  async getById(_id) {
    return notImplemented("usersService", "getById(id)");
  },
  async create(_payload) {
    return notImplemented("usersService", "create(payload)");
  },
  async update(_id, _payload) {
    return notImplemented("usersService", "update(id, payload)");
  },
  async remove(_id) {
    return notImplemented("usersService", "remove(id)");
  }
};
