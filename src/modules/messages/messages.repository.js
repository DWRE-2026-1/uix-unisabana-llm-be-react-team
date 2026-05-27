import { Message } from "../../database/models/Message.js";

export const messagesRepository = {
  async create(payload) {
    const message = new Message(payload);
    return message.save();
  },

  async listByConversation(conversationId) {
    return Message.find({ conversation: conversationId, deletedAt: null })
      .sort({ createdAt: 1 });
  }
};