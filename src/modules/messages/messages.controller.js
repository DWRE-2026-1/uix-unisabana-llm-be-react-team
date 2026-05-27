import { messagesService } from "./messages.service.js";
import { apiResponse } from "../../utils/api-response.js";

export const messagesController = {
  async create(req, res) {
    const message = await messagesService.create(req.body);
    return apiResponse(res, { status: 201, message: "Mensaje guardado", data: message });
  },

  async list(req, res) {
    const { conversationId } = req.query;
    if (!conversationId) return apiResponse(res, { status: 400, message: "conversationId es requerido" });
    const messages = await messagesService.listByConversation(conversationId);
    return apiResponse(res, { status: 200, message: "OK", data: messages });
  }
};