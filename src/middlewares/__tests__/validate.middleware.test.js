import { validate } from "../validate.middleware.js";
import { z } from "zod";

const testSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email()
  })
});

describe("validate middleware", () => {
  let next;

  beforeEach(() => {
    next = jest.fn();
  });

  it("debe llamar next() sin error si el schema es válido", () => {
    const req = {
      body: { name: "Test", email: "test@test.com" },
      params: {},
      query: {}
    };

    validate(testSchema)(req, {}, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("debe llamar next(error) si la validación falla", () => {
    const req = {
      body: { name: "", email: "no-email" },
      params: {},
      query: {}
    };

    validate(testSchema)(req, {}, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    const error = next.mock.calls[0][0];
    expect(error.message).toBeTruthy();
  });

  it("debe pasar el mensaje de error de Zod como mensaje del error", () => {
    const req = {
      body: { name: "Test", email: "invalido" },
      params: {},
      query: {}
    };

    validate(testSchema)(req, {}, next);

    const error = next.mock.calls[0][0];
    expect(error.message).toContain("Invalid email");
  });

  it("debe llamar next() directamente si no se proporciona schema", () => {
    const req = { body: {}, params: {}, query: {} };

    validate(null)(req, {}, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("debe llamar next(error) si falta un campo requerido", () => {
    const req = {
      body: { name: "Test" }, // falta email
      params: {},
      query: {}
    };

    validate(testSchema)(req, {}, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
