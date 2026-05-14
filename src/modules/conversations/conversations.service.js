import { conversationsRepository } from "./conversations.repository.js";

export const conversationsService = {
  async create({ title, userId, modelId }) {
    return conversationsRepository.create({ title, user: userId, model: modelId || null });
  },

  async listByUser(userId) {
    return conversationsRepository.listByUser(userId);
  },

  async getById(id) {
    const conversation = await conversationsRepository.findById(id);
    if (!conversation) {
      throw Object.assign(new Error("Conversation not found"), { statusCode: 404 });
    }
    return conversation;
  },

  async rename(id, title) {
    const conversation = await conversationsRepository.updateById(id, { title });
    if (!conversation) {
      throw Object.assign(new Error("Conversation not found"), { statusCode: 404 });
    }
    return conversation;
  },

  async remove(id) {
    const conversation = await conversationsRepository.deleteById(id);
    if (!conversation) {
      throw Object.assign(new Error("Conversation not found"), { statusCode: 404 });
    }
    return conversation;
  }
};