import { scaffoldResponse } from "../../utils/scaffold-response.js";

export const usersController = {
  async list(_req, res) {
    return scaffoldResponse(res, "users", "list");
  },
  async getById(_req, res) {
    return scaffoldResponse(res, "users", "get_by_id");
  },
  async create(_req, res) {
    return scaffoldResponse(res, "users", "create");
  },
  async update(_req, res) {
    return scaffoldResponse(res, "users", "update");
  },
  async remove(_req, res) {
    return scaffoldResponse(res, "users", "remove");
  }
};
