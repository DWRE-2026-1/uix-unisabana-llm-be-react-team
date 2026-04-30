import { notImplemented } from "../../utils/not-implemented.js";

export const conversationsRepository = {
  async create(_payload) {
    return notImplemented("conversationsRepository", "create(payload)");
  },
  async listByUser(_userId) {
    return notImplemented("conversationsRepository", "listByUser(userId)");
  },
  async findById(_id) {
    return notImplemented("conversationsRepository", "findById(id)");
  },
  async updateById(_id, _payload) {
    return notImplemented("conversationsRepository", "updateById(id, payload)");
  },
  async deleteById(_id) {
    return notImplemented("conversationsRepository", "deleteById(id)");
  }
};
