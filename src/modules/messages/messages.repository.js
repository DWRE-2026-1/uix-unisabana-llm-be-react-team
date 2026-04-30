import { notImplemented } from "../../utils/not-implemented.js";

export const messagesRepository = {
  async create(_payload) {
    return notImplemented("messagesRepository", "create(payload)");
  },
  async listByConversation(_conversationId) {
    return notImplemented("messagesRepository", "listByConversation(conversationId)");
  }
};
