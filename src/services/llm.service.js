import { env } from "../config/env.js";
import { LlmError } from "../utils/llm-error.js";
import { normalizeMessages, truncateMessages } from "../utils/llm-messages.js";
import * as ollamaService from "./ollama.service.js";
import * as openaiService from "./openai-compatible.service.js";

const PROVIDERS = {
  ollama: {
    complete: ollamaService.complete,
    stream: ollamaService.stream,
    defaultModel: () => env.OLLAMA_MODEL,
    contextWindow: () => env.OLLAMA_CONTEXT_WINDOW
  },
  openai: {
    complete: openaiService.complete,
    stream: openaiService.stream,
    defaultModel: () => env.OPENAI_MODEL,
    contextWindow: () => env.OPENAI_CONTEXT_WINDOW
  }
};

function resolveProvider(provider) {
  const slug = (provider || env.LLM_DEFAULT_PROVIDER || "ollama").toLowerCase();
  const adapter = PROVIDERS[slug];

  if (!adapter) {
    throw new LlmError(`Unsupported LLM provider: ${slug}`, {
      statusCode: 400,
      code: "unsupported_provider"
    });
  }

  return { slug, adapter };
}

function prepareMessages(input, contextWindow) {
  const messages = normalizeMessages(input);
  return truncateMessages(messages, contextWindow);
}

function parseCompletion(data) {
  const content = data?.choices?.[0]?.message?.content ?? "";
  return {
    content,
    usage: data?.usage || null,
    model: data?.model || null
  };
}

export const llmService = {
  async complete({ provider, model, prompt, messages }) {
    const { slug, adapter } = resolveProvider(provider);
    const resolvedModel = model || adapter.defaultModel();
    const preparedMessages = prepareMessages({ prompt, messages }, adapter.contextWindow());

    const data = await adapter.complete({
      model: resolvedModel,
      messages: preparedMessages
    });

    const parsed = parseCompletion(data);

    return {
      provider: slug,
      model: parsed.model || resolvedModel,
      content: parsed.content,
      usage: parsed.usage
    };
  },

  async stream({ provider, model, prompt, messages }, onChunk) {
    const { slug, adapter } = resolveProvider(provider);
    const resolvedModel = model || adapter.defaultModel();
    const preparedMessages = prepareMessages({ prompt, messages }, adapter.contextWindow());

    const result = await adapter.stream({
      model: resolvedModel,
      messages: preparedMessages,
      onChunk
    });

    return {
      provider: slug,
      model: result?.model || resolvedModel,
      usage: result?.usage || null
    };
  }
};
