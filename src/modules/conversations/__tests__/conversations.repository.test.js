import { conversationsRepository } from "../conversations.repository.js";

// Mock del modelo Conversation antes de importar el repositorio
jest.mock("../../../database/models/Conversation.js", () => ({
  Conversation: {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn()
  }
}));

import { Conversation } from "../../../database/models/Conversation.js";

const mockConversation = {
  _id: "conv123",
  title: "Test",
  user: "user123",
  model: null,
  deletedAt: null
};

describe("conversationsRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────
  // create()
  // ─────────────────────────────────────────────
  describe("create()", () => {
    it("debe llamar a Conversation.create con el payload correcto", async () => {
      Conversation.create.mockResolvedValue(mockConversation);

      const payload = { title: "Test", user: "user123", model: null };
      const result = await conversationsRepository.create(payload);

      expect(Conversation.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockConversation);
    });
  });

  // ─────────────────────────────────────────────
  // listByUser()
  // ─────────────────────────────────────────────
  describe("listByUser()", () => {
    it("debe buscar conversaciones no eliminadas del usuario ordenadas por fecha", async () => {
      const sortMock = jest.fn().mockResolvedValue([mockConversation]);
      Conversation.find.mockReturnValue({ sort: sortMock });

      const result = await conversationsRepository.listByUser("user123");

      expect(Conversation.find).toHaveBeenCalledWith({
        user: "user123",
        deletedAt: null
      });
      expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual([mockConversation]);
    });
  });

  // ─────────────────────────────────────────────
  // findById()
  // ─────────────────────────────────────────────
  describe("findById()", () => {
    it("debe buscar conversación no eliminada por ID", async () => {
      Conversation.findOne.mockResolvedValue(mockConversation);

      const result = await conversationsRepository.findById("conv123");

      expect(Conversation.findOne).toHaveBeenCalledWith({
        _id: "conv123",
        deletedAt: null
      });
      expect(result).toEqual(mockConversation);
    });

    it("debe retornar null si no existe la conversación", async () => {
      Conversation.findOne.mockResolvedValue(null);

      const result = await conversationsRepository.findById("noexiste");

      expect(result).toBeNull();
    });
  });

  // ─────────────────────────────────────────────
  // updateById()
  // ─────────────────────────────────────────────
  describe("updateById()", () => {
    it("debe actualizar y retornar el documento nuevo", async () => {
      const updated = { ...mockConversation, title: "Nuevo" };
      Conversation.findByIdAndUpdate.mockResolvedValue(updated);

      const result = await conversationsRepository.updateById("conv123", { title: "Nuevo" });

      expect(Conversation.findByIdAndUpdate).toHaveBeenCalledWith(
        "conv123",
        { title: "Nuevo" },
        { new: true }
      );
      expect(result.title).toBe("Nuevo");
    });
  });

  // ─────────────────────────────────────────────
  // deleteById()
  // ─────────────────────────────────────────────
  describe("deleteById()", () => {
    it("debe hacer soft delete seteando deletedAt y retornar el documento", async () => {
      const deletedDoc = { ...mockConversation, deletedAt: new Date() };
      Conversation.findByIdAndUpdate.mockResolvedValue(deletedDoc);

      const result = await conversationsRepository.deleteById("conv123");

      expect(Conversation.findByIdAndUpdate).toHaveBeenCalledWith(
        "conv123",
        expect.objectContaining({ deletedAt: expect.any(Date) }),
        { new: true }
      );
      expect(result.deletedAt).not.toBeNull();
    });
  });
});
