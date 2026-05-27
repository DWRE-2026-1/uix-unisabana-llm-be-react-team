import jwt from "jsonwebtoken";
import {
  authMiddleware,
  requireAuth,
  requireAdmin,
  requireOwnership
} from "../auth.middleware.js";

jest.mock("jsonwebtoken");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("auth.middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────
  // authMiddleware()
  // ─────────────────────────────────────────────
  describe("authMiddleware()", () => {
    it("debe establecer req.user en null si no hay token", () => {
      const req = { headers: {} };
      const res = mockRes();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
    });

    it("debe establecer req.user en null si el header no empieza con Bearer", () => {
      const req = { headers: { authorization: "Basic abc123" } };
      const res = mockRes();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
    });

    it("debe poblar req.user si el token es válido", () => {
      const payload = { sub: "user123", email: "test@test.com", role: "admin" };
      jwt.verify.mockReturnValue(payload);

      const req = { headers: { authorization: "Bearer valid.token" } };
      const res = mockRes();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(req.user).toEqual({
        id: "user123",
        email: "test@test.com",
        role: "admin"
      });
      expect(next).toHaveBeenCalled();
    });

    it("debe establecer req.user en null si el token es inválido", () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("invalid token");
      });

      const req = { headers: { authorization: "Bearer token.invalido" } };
      const res = mockRes();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
    });

    it("debe asignar role 'user' por defecto si el payload no tiene rol", () => {
      jwt.verify.mockReturnValue({ sub: "user123", email: "test@test.com" });

      const req = { headers: { authorization: "Bearer valid.token" } };
      const res = mockRes();
      const next = jest.fn();

      authMiddleware(req, res, next);

      expect(req.user.role).toBe("user");
    });
  });

  // ─────────────────────────────────────────────
  // requireAuth()
  // ─────────────────────────────────────────────
  describe("requireAuth()", () => {
    it("debe llamar next() si req.user está definido", () => {
      const req = { user: { id: "user123", email: "test@test.com", role: "user" } };
      const res = mockRes();
      const next = jest.fn();

      requireAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("debe responder 401 si req.user es null", () => {
      const req = { user: null };
      const res = mockRes();
      const next = jest.fn();

      requireAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Authentication required" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────
  // requireAdmin()
  // ─────────────────────────────────────────────
  describe("requireAdmin()", () => {
    it("debe llamar next() si el usuario tiene rol admin", () => {
      const req = { user: { id: "user123", role: "admin" } };
      const res = mockRes();
      const next = jest.fn();

      requireAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it("debe responder 401 si req.user es null", () => {
      const req = { user: null };
      const res = mockRes();
      const next = jest.fn();

      requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Authentication required" });
    });

    it("debe responder 403 si el usuario no tiene rol admin", () => {
      const req = { user: { id: "user123", role: "user" } };
      const res = mockRes();
      const next = jest.fn();

      requireAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Admin role required" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────
  // requireOwnership()
  // ─────────────────────────────────────────────
  describe("requireOwnership()", () => {
    it("debe llamar next() si el usuario es el dueño del recurso", async () => {
      const getOwnerId = jest.fn().mockResolvedValue("user123");
      const middleware = requireOwnership(getOwnerId);

      const req = { user: { id: "user123" }, params: {} };
      const res = mockRes();
      const next = jest.fn();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it("debe responder 401 si req.user es null", async () => {
      const getOwnerId = jest.fn();
      const middleware = requireOwnership(getOwnerId);

      const req = { user: null };
      const res = mockRes();
      const next = jest.fn();

      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Authentication required" });
    });

    it("debe responder 404 si el recurso no existe (ownerId null)", async () => {
      const getOwnerId = jest.fn().mockResolvedValue(null);
      const middleware = requireOwnership(getOwnerId);

      const req = { user: { id: "user123" }, params: {} };
      const res = mockRes();
      const next = jest.fn();

      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Resource not found" });
    });

    it("debe responder 403 si el usuario no es el dueño del recurso", async () => {
      const getOwnerId = jest.fn().mockResolvedValue("otro_usuario");
      const middleware = requireOwnership(getOwnerId);

      const req = { user: { id: "user123" }, params: {} };
      const res = mockRes();
      const next = jest.fn();

      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Access denied" });
    });

    it("debe llamar next(error) si getOwnerId lanza una excepción", async () => {
      const error = new Error("DB error");
      const getOwnerId = jest.fn().mockRejectedValue(error);
      const middleware = requireOwnership(getOwnerId);

      const req = { user: { id: "user123" }, params: {} };
      const res = mockRes();
      const next = jest.fn();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
