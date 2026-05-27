import { messagesRepository } from "./messages.repository.js";

export const messagesService = {
  async create(payload) {
    return messagesRepository.create({
      conversation: payload.conversationId,
      role: payload.role,
      content: payload.content
    });
  },

  async listByConversation(conversationId) {
    return messagesRepository.listByConversation(conversationId);
  }
};