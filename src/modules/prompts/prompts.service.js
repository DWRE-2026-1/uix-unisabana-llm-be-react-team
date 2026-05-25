import { sendToOllama, streamFromOllama } from "../../services/ollama.service.js";
import { sendToOpenAICompatible } from "../../services/openai-compatible.service.js";
import { env } from "../../config/env.js";

export const promptsService = {
  async generate(prompt, provider) {
    const selectedProvider = provider || env.LLM_DEFAULT_PROVIDER || "ollama";
    const messages = [{ role: "user", content: prompt }];

    let response;

    if (selectedProvider === "openai") {
      response = await sendToOpenAICompatible(messages);
    } else {
      response = await sendToOllama(messages);
    }

    const content = response?.choices?.[0]?.message?.content;
    if (!content) throw new Error(`No se obtuvo respuesta del proveedor: ${selectedProvider}`);
    return { response: content, provider: selectedProvider };
  },

  async stream(prompt, provider, onChunk) {
    const selectedProvider = provider || env.LLM_DEFAULT_PROVIDER || "ollama";
    const messages = [{ role: "user", content: prompt }];

    if (selectedProvider === "ollama") {
      await streamFromOllama(messages, onChunk);
    } else {
      // fallback sin stream para openai
      const response = await sendToOpenAICompatible(messages);
      const content = response?.choices?.[0]?.message?.content || "";
      onChunk(content);
    }
  }
};