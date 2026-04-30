import { notImplemented } from "../../utils/not-implemented.js";

export const chatService = {
  async createCompletion(_payload) {
    return notImplemented("chatService", "createCompletion(payload)");
  },
  async streamCompletion(_payload, _onChunk) {
    return notImplemented("chatService", "streamCompletion(payload, onChunk)");
  }
};
