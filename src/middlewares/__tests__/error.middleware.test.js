import { notFoundMiddleware, errorMiddleware } from "../error.middleware.js";

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("error.middleware", () => {
  // ─────────────────────────────────────────────
  // notFoundMiddleware()
  // ─────────────────────────────────────────────
  describe("notFoundMiddleware()", () => {
    it("debe responder 404 con mensaje 'Route not found'", () => {
      const req = {};
      const res = mockRes();
      const next = jest.fn();

      notFoundMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Route not found" });
    });
  });

  // ─────────────────────────────────────────────
  // errorMiddleware()
  // ─────────────────────────────────────────────
  describe("errorMiddleware()", () => {
    it("debe usar el statusCode del error si está definido", () => {
      const error = Object.assign(new Error("Not found"), { statusCode: 404 });
      const req = {};
      const res = mockRes();
      const next = jest.fn();

      errorMiddleware(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Not found" });
    });

    it("debe usar 500 por defecto si el error no tiene statusCode", () => {
      const error = new Error("Algo salió mal");
      const req = {};
      const res = mockRes();
      const next = jest.fn();

      errorMiddleware(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Algo salió mal" });
    });

    it("debe responder con 'Internal server error' si el error no tiene mensaje", () => {
      const error = {};
      const req = {};
      const res = mockRes();
      const next = jest.fn();

      errorMiddleware(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });

    it("debe usar statusCode 401 para errores de autenticación", () => {
      const error = Object.assign(new Error("Unauthorized"), { statusCode: 401 });
      const req = {};
      const res = mockRes();
      const next = jest.fn();

      errorMiddleware(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("debe usar statusCode 409 para errores de conflicto", () => {
      const error = Object.assign(new Error("Conflict"), { statusCode: 409 });
      const req = {};
      const res = mockRes();
      const next = jest.fn();

      errorMiddleware(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
    });
  });
});
