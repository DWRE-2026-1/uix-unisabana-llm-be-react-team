import { scaffoldResponse } from "../../utils/scaffold-response.js";

export const rolesController = {
  async list(_req, res) {
    return scaffoldResponse(res, "roles", "list");
  },
  async create(_req, res) {
    return scaffoldResponse(res, "roles", "create");
  }
};
