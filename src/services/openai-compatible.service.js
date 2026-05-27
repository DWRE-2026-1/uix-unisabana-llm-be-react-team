import { env } from "../config/env.js";
import { fetchJsonWithRetry, fetchWithRetry } from "../utils/llm-http.js";
import { LlmError } from "../utils/llm-error.js";
import { logger } from "../utils/logger.js";

const META = { provider: "openai" };

function buildHeaders() {
  if (!env.OPENAI_API_KEY) {
    throw new LlmError("OPENAI_API_KEY is not configured", {
      statusCode: 500,
      code: "missing_api_key"
    });
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.OPENAI_API_KEY}`
  };
}

export async function complete({ model, messages }) {
  return fetchJsonWithRetry(
    `${env.OPENAI_BASE_URL}/chat/completions`,
    {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({
        model,
        messages,
        stream: false
      })
    },
    { ...META, model }
  );
}

function parseSseLine(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) {
    return null;
  }

  const payload = trimmed.slice(5).trim();
  if (!payload || payload === "[DONE]") {
    return { done: true };
  }

  return { done: false, data: JSON.parse(payload) };
}

export async function stream({ model, messages, onChunk }) {
  const response = await fetchWithRetry(
    `${env.OPENAI_BASE_URL}/chat/completions`,
    {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        stream_options: { include_usage: true }
      })
    },
    { ...META, model }
  );

  if (!response.body) {
    throw new LlmError("OpenAI stream body is empty", { statusCode: 502 });
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let usage = null;
  let responseModel = model;

  for await (const chunk of response.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      let parsed;
      try {
        parsed = parseSseLine(line);
      } catch (error) {
        logger.warn("[LLM] failed to parse SSE line", { line, message: error.message });
        continue;
      }

      if (!parsed) continue;
      if (parsed.done) {
        return { model: responseModel, usage };
      }

      const delta = parsed.data?.choices?.[0]?.delta?.content;
      if (delta) {
        onChunk(delta);
      }

      if (parsed.data?.model) {
        responseModel = parsed.data.model;
      }
      if (parsed.data?.usage) {
        usage = parsed.data.usage;
      }
    }
  }

  return { model: responseModel, usage };
}
