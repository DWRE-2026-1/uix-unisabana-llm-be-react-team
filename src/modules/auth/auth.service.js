import { notImplemented } from "../../utils/not-implemented.js";

export const authService = {
  async login(_payload) {
    return notImplemented("authService", "login(payload)");
  },
  async register(_payload) {
    return notImplemented("authService", "register(payload)");
  },
  async logout() {
    return notImplemented("authService", "logout()");
  },
  async me(_userId) {
    return notImplemented("authService", "me(userId)");
  },
  async updateMe(_userId, _payload) {
    return notImplemented("authService", "updateMe(userId, payload)");
  }
};
