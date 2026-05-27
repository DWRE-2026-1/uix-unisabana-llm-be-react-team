import { authService } from "../auth.service.js";
import { User } from "../../../database/models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../../../database/models/User.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const mockUser = {
  _id: { toString: () => "user123" },
  email: "test@test.com",
  name: "Test User",
  passwordHash: "hashed_password",
  role: "user",
  lastLoginAt: null,
  save: jest.fn().mockResolvedValue(true)
};

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────
  // login()
  // ─────────────────────────────────────────────
  describe("login()", () => {
    it("debe lanzar 401 si el usuario no existe", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(
        authService.login({ email: "noexiste@test.com", password: "123456" })
      ).rejects.toMatchObject({ message: "Invalid credentials", statusCode: 401 });
    });

    it("debe lanzar 401 si la contraseña no coincide", async () => {
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        authService.login({ email: "test@test.com", password: "wrongpass" })
      ).rejects.toMatchObject({ message: "Invalid credentials", statusCode: 401 });
    });

    it("debe retornar token y datos del usuario al hacer login exitoso", async () => {
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("fake.jwt.token");

      const result = await authService.login({
        email: "test@test.com",
        password: "123456"
      });

      expect(result).toHaveProperty("token", "fake.jwt.token");
      expect(result.user).toMatchObject({
        email: "test@test.com",
        name: "Test User"
      });
      expect(mockUser.save).toHaveBeenCalled();
    });

    it("debe llamar a bcrypt.compare con la contraseña y el hash", async () => {
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      await authService.login({ email: "test@test.com", password: "123456" });

      expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed_password");
    });

    it("debe actualizar lastLoginAt al hacer login exitoso", async () => {
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      await authService.login({ email: "test@test.com", password: "123456" });

      expect(mockUser.lastLoginAt).toBeInstanceOf(Date);
      expect(mockUser.save).toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────
  // register()
  // ─────────────────────────────────────────────
  describe("register()", () => {
    it("debe lanzar 409 si el email ya está en uso", async () => {
      User.findOne.mockResolvedValue(mockUser);

      await expect(
        authService.register({ email: "test@test.com", password: "123456", name: "Test" })
      ).rejects.toMatchObject({ message: "Email already in use", statusCode: 409 });
    });

    it("debe crear usuario y retornar token al registrar correctamente", async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("new_hashed_password");
      User.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("new.jwt.token");

      const result = await authService.register({
        email: "nuevo@test.com",
        password: "123456",
        name: "Nuevo Usuario"
      });

      expect(result).toHaveProperty("token", "new.jwt.token");
      expect(result.user).toMatchObject({ email: "test@test.com" });
    });

    it("debe hashear la contraseña antes de guardar", async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed");
      User.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("token");

      await authService.register({
        email: "nuevo@test.com",
        password: "mipassword",
        name: "Test"
      });

      expect(bcrypt.hash).toHaveBeenCalledWith("mipassword", 10);
      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({ passwordHash: "hashed" })
      );
    });
  });

  // ─────────────────────────────────────────────
  // logout()
  // ─────────────────────────────────────────────
  describe("logout()", () => {
    it("debe retornar mensaje de logout exitoso", async () => {
      const result = await authService.logout();
      expect(result).toEqual({ message: "Logged out successfully" });
    });
  });

  // ─────────────────────────────────────────────
  // me()
  // ─────────────────────────────────────────────
  describe("me()", () => {
    it("debe retornar el usuario si existe", async () => {
      const selectMock = jest.fn().mockResolvedValue(mockUser);
      User.findById.mockReturnValue({ select: selectMock });

      const result = await authService.me("user123");

      expect(User.findById).toHaveBeenCalledWith("user123");
      expect(selectMock).toHaveBeenCalledWith("-passwordHash");
      expect(result).toEqual(mockUser);
    });

    it("debe lanzar 404 si el usuario no existe", async () => {
      const selectMock = jest.fn().mockResolvedValue(null);
      User.findById.mockReturnValue({ select: selectMock });

      await expect(authService.me("noexiste")).rejects.toMatchObject({
        message: "User not found",
        statusCode: 404
      });
    });
  });

  // ─────────────────────────────────────────────
  // updateMe()
  // ─────────────────────────────────────────────
  describe("updateMe()", () => {
    it("debe actualizar el nombre del usuario", async () => {
      const updatedUser = { ...mockUser, name: "Nuevo Nombre" };
      const selectMock = jest.fn().mockResolvedValue(updatedUser);
      User.findByIdAndUpdate.mockReturnValue({ select: selectMock });

      const result = await authService.updateMe("user123", { name: "Nuevo Nombre" });

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "user123",
        { name: "Nuevo Nombre" },
        { new: true }
      );
      expect(result.name).toBe("Nuevo Nombre");
    });

    it("debe hashear la nueva contraseña al actualizar", async () => {
      bcrypt.hash.mockResolvedValue("nuevo_hash");
      const selectMock = jest.fn().mockResolvedValue(mockUser);
      User.findByIdAndUpdate.mockReturnValue({ select: selectMock });

      await authService.updateMe("user123", { password: "nuevapass" });

      expect(bcrypt.hash).toHaveBeenCalledWith("nuevapass", 10);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "user123",
        { passwordHash: "nuevo_hash" },
        { new: true }
      );
    });

    it("debe lanzar 404 si el usuario a actualizar no existe", async () => {
      const selectMock = jest.fn().mockResolvedValue(null);
      User.findByIdAndUpdate.mockReturnValue({ select: selectMock });

      await expect(
        authService.updateMe("noexiste", { name: "Test" })
      ).rejects.toMatchObject({ message: "User not found", statusCode: 404 });
    });

    it("no debe incluir campos vacíos en el update", async () => {
      const selectMock = jest.fn().mockResolvedValue(mockUser);
      User.findByIdAndUpdate.mockReturnValue({ select: selectMock });

      await authService.updateMe("user123", {});

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "user123",
        {},
        { new: true }
      );
    });
  });
});
