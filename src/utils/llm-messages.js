import { LlmError } from "./llm-error.js";

const CHARS_PER_TOKEN_ESTIMATE = 4;

export function normalizeMessages({ prompt, messages }) {
  if (Array.isArray(messages) && messages.length > 0) {
    return messages.map((message) => ({
      role: message.role,
      content: message.content
    }));
  }

  if (typeof prompt === "string" && prompt.trim().length > 0) {
    return [{ role: "user", content: prompt.trim() }];
  }

  throw new LlmError("Either prompt or messages is required", {
    statusCode: 400,
    code: "invalid_messages"
  });
}

function estimateTokens(text) {
  return Math.ceil((text || "").length / CHARS_PER_TOKEN_ESTIMATE);
}

export function truncateMessages(messages, contextWindow) {
  if (!contextWindow || contextWindow <= 0) {
    return messages;
  }

  const systemMessages = messages.filter((message) => message.role === "system");
  const conversational = messages.filter((message) => message.role !== "system");

  let totalTokens =
    systemMessages.reduce((sum, message) => sum + estimateTokens(message.content), 0) +
    conversational.reduce((sum, message) => sum + estimateTokens(message.content), 0);

  if (totalTokens <= contextWindow) {
    return [...systemMessages, ...conversational];
  }

  const trimmed = [...conversational];
  while (trimmed.length > 0 && totalTokens > contextWindow) {
    const removed = trimmed.shift();
    totalTokens -= estimateTokens(removed.content);
  }

  if (trimmed.length === 0 && systemMessages.length === 0) {
    const last = messages[messages.length - 1];
    const maxChars = contextWindow * CHARS_PER_TOKEN_ESTIMATE;
    return [{ ...last, content: last.content.slice(-maxChars) }];
  }

  return [...systemMessages, ...trimmed];
}
