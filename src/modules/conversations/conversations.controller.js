import { apiResponse } from "../../utils/api-response.js";
import { conversationsService } from "./conversations.service.js";

export const conversationsController = {
  async create(req, res) {
    const conversation = await conversationsService.create({
      ...req.body,
      userId: req.user.id
    });
    return apiResponse(res, { status: 201, message: "Conversation created", data: conversation });
  },

  async list(req, res) {
    const conversations = await conversationsService.listByUser(req.user.id);
    return apiResponse(res, { status: 200, message: "OK", data: conversations });
  },

  async getById(req, res) {
    const conversation = await conversationsService.getById(req.params.id);
    return apiResponse(res, { status: 200, message: "OK", data: conversation });
  },

  async rename(req, res) {
    const conversation = await conversationsService.rename(req.params.id, req.body.title);
    return apiResponse(res, { status: 200, message: "Conversation renamed", data: conversation });
  },

  async remove(req, res) {
    await conversationsService.remove(req.params.id);
    return apiResponse(res, { status: 200, message: "Conversation deleted", data: null });
  }
};