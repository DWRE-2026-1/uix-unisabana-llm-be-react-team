import { conversationsService } from "../conversations.service.js";
import { conversationsRepository } from "../conversations.repository.js";

jest.mock("../conversations.repository.js");

const mockConversation = {
  _id: "conv123",
  title: "Mi conversación",
  user: "user123",
  model: null,
  deletedAt: null
};

describe("conversationsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────
  // create()
  // ─────────────────────────────────────────────
  describe("create()", () => {
    it("debe crear una conversación con los datos correctos", async () => {
      conversationsRepository.create.mockResolvedValue(mockConversation);

      const result = await conversationsService.create({
        title: "Mi conversación",
        userId: "user123",
        modelId: null
      });

      expect(conversationsRepository.create).toHaveBeenCalledWith({
        title: "Mi conversación",
        user: "user123",
        model: null
      });
      expect(result).toEqual(mockConversation);
    });

    it("debe usar null como model si no se proporciona modelId", async () => {
      conversationsRepository.create.mockResolvedValue(mockConversation);

      await conversationsService.create({ title: "Test", userId: "user123" });

      expect(conversationsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ model: null })
      );
    });

    it("debe pasar el modelId cuando se proporciona", async () => {
      conversationsRepository.create.mockResolvedValue(mockConversation);

      await conversationsService.create({
        title: "Test",
        userId: "user123",
        modelId: "model456"
      });

      expect(conversationsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ model: "model456" })
      );
    });
  });

  // ─────────────────────────────────────────────
  // listByUser()
  // ─────────────────────────────────────────────
  describe("listByUser()", () => {
    it("debe retornar la lista de conversaciones del usuario", async () => {
      const lista = [mockConversation, { ...mockConversation, _id: "conv456" }];
      conversationsRepository.listByUser.mockResolvedValue(lista);

      const result = await conversationsService.listByUser("user123");

      expect(conversationsRepository.listByUser).toHaveBeenCalledWith("user123");
      expect(result).toHaveLength(2);
    });

    it("debe retornar arreglo vacío si el usuario no tiene conversaciones", async () => {
      conversationsRepository.listByUser.mockResolvedValue([]);

      const result = await conversationsService.listByUser("user_sin_convs");

      expect(result).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────
  // getById()
  // ─────────────────────────────────────────────
  describe("getById()", () => {
    it("debe retornar la conversación si existe", async () => {
      conversationsRepository.findById.mockResolvedValue(mockConversation);

      const result = await conversationsService.getById("conv123");

      expect(conversationsRepository.findById).toHaveBeenCalledWith("conv123");
      expect(result).toEqual(mockConversation);
    });

    it("debe lanzar 404 si la conversación no existe", async () => {
      conversationsRepository.findById.mockResolvedValue(null);

      await expect(conversationsService.getById("noexiste")).rejects.toMatchObject({
        message: "Conversation not found",
        statusCode: 404
      });
    });
  });

  // ─────────────────────────────────────────────
  // rename()
  // ─────────────────────────────────────────────
  describe("rename()", () => {
    it("debe renombrar la conversación y retornarla actualizada", async () => {
      const updated = { ...mockConversation, title: "Nuevo título" };
      conversationsRepository.updateById.mockResolvedValue(updated);

      const result = await conversationsService.rename("conv123", "Nuevo título");

      expect(conversationsRepository.updateById).toHaveBeenCalledWith("conv123", {
        title: "Nuevo título"
      });
      expect(result.title).toBe("Nuevo título");
    });

    it("debe lanzar 404 si la conversación a renombrar no existe", async () => {
      conversationsRepository.updateById.mockResolvedValue(null);

      await expect(
        conversationsService.rename("noexiste", "Título")
      ).rejects.toMatchObject({ message: "Conversation not found", statusCode: 404 });
    });
  });

  // ─────────────────────────────────────────────
  // remove()
  // ─────────────────────────────────────────────
  describe("remove()", () => {
    it("debe eliminar la conversación (soft delete) y retornarla", async () => {
      const deleted = { ...mockConversation, deletedAt: new Date() };
      conversationsRepository.deleteById.mockResolvedValue(deleted);

      const result = await conversationsService.remove("conv123");

      expect(conversationsRepository.deleteById).toHaveBeenCalledWith("conv123");
      expect(result.deletedAt).not.toBeNull();
    });

    it("debe lanzar 404 si la conversación a eliminar no existe", async () => {
      conversationsRepository.deleteById.mockResolvedValue(null);

      await expect(conversationsService.remove("noexiste")).rejects.toMatchObject({
        message: "Conversation not found",
        statusCode: 404
      });
    });
  });
});
