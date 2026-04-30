import { env } from "../config/env.js";

export async function sendToOllama(messages = []) {
  const payload = {
    model: env.OLLAMA_MODEL,
    messages,
    stream: false
  };

  const response = await fetch(`${env.OLLAMA_OPENAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return response.json();
}

export async function streamFromOllama(messages = [], onChunk) {
  const response = await fetch(`${env.OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: env.OLLAMA_MODEL,
      messages,
      stream: true
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama stream failed (${response.status}): ${text}`);
  }

  if (!response.body) {
    throw new Error("Ollama stream body is empty");
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
        return;
      }
    }
  }
}
