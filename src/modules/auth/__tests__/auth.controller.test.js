import { authController } from "../auth.controller.js";
import { authService } from "../auth.service.js";

jest.mock("../auth.service.js");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockReq = (overrides = {}) => ({
  body: {},
  params: {},
  user: { id: "user123", email: "test@test.com", role: "user" },
  ...overrides
});

describe("authController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────
  // login()
  // ─────────────────────────────────────────────
  describe("login()", () => {
    it("debe responder 200 con token al hacer login exitoso", async () => {
      const fakeResult = { token: "jwt.token", user: { id: "1", email: "a@b.com", name: "A" } };
      authService.login.mockResolvedValue(fakeResult);

      const req = mockReq({ body: { email: "a@b.com", password: "123456" } });
      const res = mockRes();

      await authController.login(req, res);

      expect(authService.login).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Login successful", data: fakeResult })
      );
    });
  });

  // ─────────────────────────────────────────────
  // register()
  // ─────────────────────────────────────────────
  describe("register()", () => {
    it("debe responder 201 al registrar correctamente", async () => {
      const fakeResult = { token: "jwt.token", user: { id: "1", email: "a@b.com", name: "A" } };
      authService.register.mockResolvedValue(fakeResult);

      const req = mockReq({ body: { email: "a@b.com", password: "123456", name: "A" } });
      const res = mockRes();

      await authController.register(req, res);

      expect(authService.register).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Registration successful" })
      );
    });
  });

  // ─────────────────────────────────────────────
  // logout()
  // ─────────────────────────────────────────────
  describe("logout()", () => {
    it("debe responder 200 con mensaje de logout", async () => {
      authService.logout.mockResolvedValue({ message: "Logged out successfully" });

      const req = mockReq();
      const res = mockRes();

      await authController.logout(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Logged out successfully" })
      );
    });
  });

  // ─────────────────────────────────────────────
  // me()
  // ─────────────────────────────────────────────
  describe("me()", () => {
    it("debe responder 200 con los datos del usuario autenticado", async () => {
      const fakeUser = { id: "user123", email: "test@test.com", name: "Test" };
      authService.me.mockResolvedValue(fakeUser);

      const req = mockReq();
      const res = mockRes();

      await authController.me(req, res);

      expect(authService.me).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: fakeUser })
      );
    });
  });

  // ─────────────────────────────────────────────
  // updateMe()
  // ─────────────────────────────────────────────
  describe("updateMe()", () => {
    it("debe responder 200 con usuario actualizado", async () => {
      const updatedUser = { id: "user123", email: "test@test.com", name: "Nuevo Nombre" };
      authService.updateMe.mockResolvedValue(updatedUser);

      const req = mockReq({ body: { name: "Nuevo Nombre" } });
      const res = mockRes();

      await authController.updateMe(req, res);

      expect(authService.updateMe).toHaveBeenCalledWith("user123", req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Profile updated", data: updatedUser })
      );
    });
  });
});
