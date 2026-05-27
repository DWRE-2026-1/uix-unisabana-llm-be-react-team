import { conversationsController } from "../conversations.controller.js";
import { conversationsService } from "../conversations.service.js";

jest.mock("../conversations.service.js");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockConversation = {
  _id: "conv123",
  title: "Mi conversación",
  user: "user123"
};

describe("conversationsController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────
  // create()
  // ─────────────────────────────────────────────
  describe("create()", () => {
    it("debe responder 201 con la conversación creada", async () => {
      conversationsService.create.mockResolvedValue(mockConversation);

      const req = {
        body: { title: "Mi conversación", modelId: null },
        user: { id: "user123" }
      };
      const res = mockRes();

      await conversationsController.create(req, res);

      expect(conversationsService.create).toHaveBeenCalledWith({
        title: "Mi conversación",
        modelId: null,
        userId: "user123"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Conversation created", data: mockConversation })
      );
    });
  });

  // ─────────────────────────────────────────────
  // list()
  // ─────────────────────────────────────────────
  describe("list()", () => {
    it("debe responder 200 con la lista de conversaciones del usuario", async () => {
      const lista = [mockConversation];
      conversationsService.listByUser.mockResolvedValue(lista);

      const req = { user: { id: "user123" } };
      const res = mockRes();

      await conversationsController.list(req, res);

      expect(conversationsService.listByUser).toHaveBeenCalledWith("user123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: lista })
      );
    });
  });

  // ─────────────────────────────────────────────
  // getById()
  // ─────────────────────────────────────────────
  describe("getById()", () => {
    it("debe responder 200 con la conversación encontrada", async () => {
      conversationsService.getById.mockResolvedValue(mockConversation);

      const req = { params: { id: "conv123" }, user: { id: "user123" } };
      const res = mockRes();

      await conversationsController.getById(req, res);

      expect(conversationsService.getById).toHaveBeenCalledWith("conv123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: mockConversation })
      );
    });
  });

  // ─────────────────────────────────────────────
  // rename()
  // ─────────────────────────────────────────────
  describe("rename()", () => {
    it("debe responder 200 con la conversación renombrada", async () => {
      const renamed = { ...mockConversation, title: "Nuevo título" };
      conversationsService.rename.mockResolvedValue(renamed);

      const req = {
        params: { id: "conv123" },
        body: { title: "Nuevo título" },
        user: { id: "user123" }
      };
      const res = mockRes();

      await conversationsController.rename(req, res);

      expect(conversationsService.rename).toHaveBeenCalledWith("conv123", "Nuevo título");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Conversation renamed" })
      );
    });
  });

  // ─────────────────────────────────────────────
  // remove()
  // ─────────────────────────────────────────────
  describe("remove()", () => {
    it("debe responder 200 con data null al eliminar una conversación", async () => {
      conversationsService.remove.mockResolvedValue({});

      const req = { params: { id: "conv123" }, user: { id: "user123" } };
      const res = mockRes();

      await conversationsController.remove(req, res);

      expect(conversationsService.remove).toHaveBeenCalledWith("conv123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Conversation deleted", data: null })
      );
    });
  });
});
