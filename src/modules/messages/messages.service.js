import { notImplemented } from "../../utils/not-implemented.js";

export const messagesService = {
  create: async (_payload) => notImplemented("messagesService", "create(payload)"),
  listByConversation: async (_conversationId) =>
    notImplemented("messagesService", "listByConversation(conversationId)")
};
