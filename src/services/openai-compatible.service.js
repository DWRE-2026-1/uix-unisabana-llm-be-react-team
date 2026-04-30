import { env } from "../config/env.js";

export async function sendToOpenAICompatible(messages = []) {
  const payload = {
    model: env.OPENAI_MODEL,
    messages,
    stream: false
  };

  const response = await fetch(`${env.OPENAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  return response.json();
}
