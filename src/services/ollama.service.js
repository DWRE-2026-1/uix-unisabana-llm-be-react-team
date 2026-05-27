import { env } from "../config/env.js";
import { fetchJsonWithRetry, fetchWithRetry } from "../utils/llm-http.js";
import { LlmError } from "../utils/llm-error.js";

const META = { provider: "ollama" };

export async function complete({ model, messages }) {
  const payload = {
    model,
    messages,
    stream: false
  };

  return fetchJsonWithRetry(
    `${env.OLLAMA_OPENAI_BASE_URL}/chat/completions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    },
    { ...META, model }
  );
}

export async function stream({ model, messages, onChunk }) {
  const response = await fetchWithRetry(
    `${env.OLLAMA_BASE_URL}/api/chat`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages,
        stream: true
      })
    },
    { ...META, model }
  );

  if (!response.body) {
    throw new LlmError("Ollama stream body is empty", { statusCode: 502 });
  }

  const decoder = new TextDecoder();
  let buffer = "";

  for await (const chunk of response.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const parsed = JSON.parse(trimmed);
      const content = parsed?.message?.content || "";
      if (content) {
        onChunk(content);
      }
      if (parsed?.done) {
        return { model, usage: null };
      }
    }
  }

  return { model, usage: null };
}
