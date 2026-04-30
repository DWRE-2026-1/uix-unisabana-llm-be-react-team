import { scaffoldResponse } from "../../utils/scaffold-response.js";

export const messagesController = {
  async create(_req, res) {
    return scaffoldResponse(res, "messages", "create");
  },
  async list(_req, res) {
    return scaffoldResponse(res, "messages", "list");
  }
};
