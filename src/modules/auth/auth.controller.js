import { apiResponse } from "../../utils/api-response.js";
import { authService } from "./auth.service.js";

export const authController = {
  async login(req, res) {
    const result = await authService.login(req.body);
    return apiResponse(res, { status: 200, message: "Login successful", data: result });
  },

  async register(req, res) {
    const result = await authService.register(req.body);
    return apiResponse(res, { status: 201, message: "Registration successful", data: result });
  },

  async logout(_req, res) {
    const result = await authService.logout();
    return apiResponse(res, { status: 200, message: result.message, data: null });
  },

  async me(req, res) {
    const user = await authService.me(req.user.id);
    return apiResponse(res, { status: 200, message: "OK", data: user });
  },

  async updateMe(req, res) {
    const user = await authService.updateMe(req.user.id, req.body);
    return apiResponse(res, { status: 200, message: "Profile updated", data: user });
  }
};