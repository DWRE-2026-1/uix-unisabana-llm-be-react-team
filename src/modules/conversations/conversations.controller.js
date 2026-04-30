import { scaffoldResponse } from "../../utils/scaffold-response.js";

export const conversationsController = {
  async create(_req, res) {
    return scaffoldResponse(res, "conversations", "create");
  },
  async list(_req, res) {
    return scaffoldResponse(res, "conversations", "list");
  },
  async getById(_req, res) {
    return scaffoldResponse(res, "conversations", "get_by_id");
  },
  async rename(_req, res) {
    return scaffoldResponse(res, "conversations", "rename");
  },
  async remove(_req, res) {
    return scaffoldResponse(res, "conversations", "remove");
  }
};
