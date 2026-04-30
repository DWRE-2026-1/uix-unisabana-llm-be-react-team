import { scaffoldResponse } from "../../utils/scaffold-response.js";

export const modelsController = {
  async list(_req, res) {
    return scaffoldResponse(res, "models", "list");
  },
  async setDefaultProvider(_req, res) {
    return scaffoldResponse(res, "models", "set_default_provider");
  }
};
