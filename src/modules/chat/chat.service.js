import { llmService } from "../../services/llm.service.js";

export const chatService = {
  async createCompletion(payload) {
    const result = await llmService.complete({
      provider: payload.provider,
      model: payload.model,
      prompt: payload.prompt,
      messages: payload.messages
    });

    return {
      content: result.content,
      provider: result.provider,
      model: result.model,
      usage: result.usage
    };
  },

  async streamCompletion(payload, onChunk) {
    return llmService.stream(
      {
        provider: payload.provider,
        model: payload.model,
        prompt: payload.prompt,
        messages: payload.messages
      },
      onChunk
    );
  }
};
