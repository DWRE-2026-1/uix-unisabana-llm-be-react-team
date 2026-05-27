import { loginSchema, registerSchema, updateMeSchema } from "../auth.validation.js";

describe("auth.validation", () => {
  // ─────────────────────────────────────────────
  // loginSchema
  // ─────────────────────────────────────────────
  describe("loginSchema", () => {
    it("debe pasar con email y contraseña válidos", () => {
      const result = loginSchema.safeParse({
        body: { email: "user@test.com", password: "123456" }
      });
      expect(result.success).toBe(true);
    });

    it("debe fallar con email inválido", () => {
      const result = loginSchema.safeParse({
        body: { email: "no-es-email", password: "123456" }
      });
      expect(result.success).toBe(false);
    });

    it("debe fallar con contraseña menor a 6 caracteres", () => {
      const result = loginSchema.safeParse({
        body: { email: "user@test.com", password: "123" }
      });
      expect(result.success).toBe(false);
    });

    it("debe fallar si falta el email", () => {
      const result = loginSchema.safeParse({
        body: { password: "123456" }
      });
      expect(result.success).toBe(false);
    });

    it("debe fallar si falta la contraseña", () => {
      const result = loginSchema.safeParse({
        body: { email: "user@test.com" }
      });
      expect(result.success).toBe(false);
    });
  });

  // ─────────────────────────────────────────────
  // registerSchema
  // ─────────────────────────────────────────────
  describe("registerSchema", () => {
    it("debe pasar con email, contraseña y nombre válidos", () => {
      const result = registerSchema.safeParse({
        body: { email: "user@test.com", password: "123456", name: "Test User" }
      });
      expect(result.success).toBe(true);
    });

    it("debe fallar si falta el nombre", () => {
      const result = registerSchema.safeParse({
        body: { email: "user@test.com", password: "123456" }
      });
      expect(result.success).toBe(false);
    });

    it("debe fallar con nombre vacío", () => {
      const result = registerSchema.safeParse({
        body: { email: "user@test.com", password: "123456", name: "" }
      });
      expect(result.success).toBe(false);
    });

    it("debe fallar con email inválido", () => {
      const result = registerSchema.safeParse({
        body: { email: "invalido", password: "123456", name: "Test" }
      });
      expect(result.success).toBe(false);
    });
  });

  // ─────────────────────────────────────────────
  // updateMeSchema
  // ─────────────────────────────────────────────
  describe("updateMeSchema", () => {
    it("debe pasar con cuerpo vacío (todos los campos son opcionales)", () => {
      const result = updateMeSchema.safeParse({ body: {} });
      expect(result.success).toBe(true);
    });

    it("debe pasar con solo el nombre", () => {
      const result = updateMeSchema.safeParse({ body: { name: "Nuevo Nombre" } });
      expect(result.success).toBe(true);
    });

    it("debe pasar con solo la contraseña", () => {
      const result = updateMeSchema.safeParse({ body: { password: "nueva123" } });
      expect(result.success).toBe(true);
    });

    it("debe fallar con nombre vacío", () => {
      const result = updateMeSchema.safeParse({ body: { name: "" } });
      expect(result.success).toBe(false);
    });

    it("debe fallar con contraseña menor a 6 caracteres", () => {
      const result = updateMeSchema.safeParse({ body: { password: "123" } });
      expect(result.success).toBe(false);
    });
  });
});
