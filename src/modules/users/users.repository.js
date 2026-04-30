import { notImplemented } from "../../utils/not-implemented.js";

export const usersRepository = {
  async findAll() {
    return notImplemented("usersRepository", "findAll()");
  },
  async findById(_id) {
    return notImplemented("usersRepository", "findById(id)");
  },
  async create(_payload) {
    return notImplemented("usersRepository", "create(payload)");
  },
  async updateById(_id, _payload) {
    return notImplemented("usersRepository", "updateById(id, payload)");
  },
  async deleteById(_id) {
    return notImplemented("usersRepository", "deleteById(id)");
  },
  async findByEmail(_email) {
    return notImplemented("usersRepository", "findByEmail(email)");
  }
};
