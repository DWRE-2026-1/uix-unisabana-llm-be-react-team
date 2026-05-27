import { asyncHandler } from "../async-handler.js";
import { scaffoldResponse } from "../scaffold-response.js";
import { notImplemented } from "../not-implemented.js";

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─────────────────────────────────────────────
// asyncHandler()
// ─────────────────────────────────────────────
describe("asyncHandler()", () => {
  it("debe ejecutar la función y llamar next() si hay error", async () => {
    const error = new Error("Async error");
    const fn = jest.fn().mockRejectedValue(error);
    const next = jest.fn();

    const handler = asyncHandler(fn);
    await handler({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("debe ejecutar la función normalmente si no hay error", async () => {
    const fn = jest.fn().mockResolvedValue("ok");
    const next = jest.fn();

    const handler = asyncHandler(fn);
    await handler({ body: {} }, {}, next);

    expect(fn).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("debe pasar req, res y next a la función envuelta", async () => {
    const fn = jest.fn().mockResolvedValue(undefined);
    const req = { body: { test: true } };
    const res = mockRes();
    const next = jest.fn();

    await asyncHandler(fn)(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
  });
});

// ─────────────────────────────────────────────
// scaffoldResponse()
// ─────────────────────────────────────────────
describe("scaffoldResponse()", () => {
  it("debe responder con status 501", () => {
    const res = mockRes();
    scaffoldResponse(res, "users", "list");
    expect(res.status).toHaveBeenCalledWith(501);
  });

  it("debe incluir el moduleName en la respuesta", () => {
    const res = mockRes();
    scaffoldResponse(res, "users", "list");
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ module: "users" })
    );
  });

  it("debe incluir el action en la respuesta", () => {
    const res = mockRes();
    scaffoldResponse(res, "users", "create");
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ action: "create" })
    );
  });

  it("debe incluir status 'not_implemented' en la respuesta", () => {
    const res = mockRes();
    scaffoldResponse(res, "roles", "list");
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: "not_implemented" })
    );
  });

  it("debe incluir el mensaje 'Scaffolding endpoint'", () => {
    const res = mockRes();
    scaffoldResponse(res, "chat", "stream");
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Scaffolding endpoint" })
    );
  });
});

// ─────────────────────────────────────────────
// notImplemented()
// ─────────────────────────────────────────────
describe("notImplemented()", () => {
  it("debe lanzar un error con el nombre del módulo y método", () => {
    expect(() => notImplemented("usersService", "list()")).toThrow(
      "[usersService] list() not implemented"
    );
  });

  it("debe lanzar una instancia de Error", () => {
    expect(() => notImplemented("chatService", "send()")).toThrow(Error);
  });

  it("debe incluir el módulo y método en el mensaje del error", () => {
    try {
      notImplemented("rolesService", "create(payload)");
    } catch (e) {
      expect(e.message).toContain("rolesService");
      expect(e.message).toContain("create(payload)");
    }
  });
});
