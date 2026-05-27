import { env } from "../config/env.js";
import { LlmError } from "./llm-error.js";
import { logger } from "./logger.js";

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableNetworkError(error) {
  return (
    error?.name === "TimeoutError" ||
    error?.name === "AbortError" ||
    error instanceof TypeError
  );
}

export async function fetchWithRetry(url, options = {}, meta = {}) {
  const maxAttempts = env.LLM_MAX_RETRIES + 1;
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const startedAt = Date.now();

    try {
      logger.info("[LLM] request", {
        provider: meta.provider,
        model: meta.model,
        attempt,
        method: options.method || "GET",
        url
      });

      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(env.REQUEST_TIMEOUT_MS)
      });

      const durationMs = Date.now() - startedAt;

      logger.info("[LLM] response", {
        provider: meta.provider,
        model: meta.model,
        attempt,
        status: response.status,
        durationMs
      });

      if (!response.ok) {
        const text = await response.text();
        const bodyPreview = text.slice(0, 500);
        logger.warn("[LLM] error response body", { provider: meta.provider, bodyPreview });

        if (RETRYABLE_STATUS.has(response.status) && attempt < maxAttempts) {
          await delay(env.LLM_RETRY_DELAY_MS * attempt);
          continue;
        }

        throw new LlmError(`LLM request failed (${response.status})`, {
          statusCode: response.status >= 500 ? 502 : response.status,
          details: bodyPreview
        });
      }

      return response;
    } catch (error) {
      lastError = error;
      logger.error("[LLM] request failed", {
        provider: meta.provider,
        model: meta.model,
        attempt,
        message: error.message
      });

      if (error instanceof LlmError) {
        throw error;
      }

      if (isRetryableNetworkError(error) && attempt < maxAttempts) {
        await delay(env.LLM_RETRY_DELAY_MS * attempt);
        continue;
      }

      throw new LlmError(error.message || "LLM request failed", {
        statusCode: 502,
        code: error?.name === "TimeoutError" ? "llm_timeout" : "llm_network_error"
      });
    }
  }

  throw lastError;
}

export async function fetchJsonWithRetry(url, options = {}, meta = {}) {
  const response = await fetchWithRetry(url, options, meta);
  const data = await response.json();
  logger.info("[LLM] response parsed", {
    provider: meta.provider,
    model: meta.model,
    usage: data?.usage || null
  });
  return data;
}
