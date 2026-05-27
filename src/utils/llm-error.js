export class LlmError extends Error {
  constructor(message, { statusCode = 502, code = "llm_error", details = null } = {}) {
    super(message);
    this.name = "LlmError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
