import { scaffoldResponse } from "../../utils/scaffold-response.js";

export const authController = {
  async login(_req, res) {
    return scaffoldResponse(res, "auth", "login");
  },
  async register(_req, res) {
    return scaffoldResponse(res, "auth", "register");
  },
  async logout(_req, res) {
    return scaffoldResponse(res, "auth", "logout");
  },
  async me(_req, res) {
    return scaffoldResponse(res, "auth", "me");
  },
  async updateMe(_req, res) {
    return scaffoldResponse(res, "auth", "update_me");
  }
};
