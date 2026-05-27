import { env } from "../../config/env.js";
import { apiResponse } from "../../utils/api-response.js";
import { LlmError } from "../../utils/llm-error.js";
import { chatService } from "./chat.service.js";

function writeSse(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

export const chatController = {
  async completion(req, res, next) {
    try {
      const data = await chatService.createCompletion(req.body);
      return apiResponse(res, { message: "Chat completion generated", data });
    } catch (error) {
      return next(error);
    }
  },

  async stream(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    let keepaliveTimer;

    if (env.SSE_ENABLED) {
      keepaliveTimer = setInterval(() => {
        res.write(": keepalive\n\n");
      }, env.SSE_KEEPALIVE_MS);
    }

    try {
      const meta = await chatService.streamCompletion(req.body, (chunk) => {
        writeSse(res, "chunk", { content: chunk });
      });

      writeSse(res, "done", meta);
    } catch (error) {
      const statusCode = error instanceof LlmError ? error.statusCode : 502;
      writeSse(res, "error", {
        message: error.message || "Stream failed",
        code: error.code || "stream_error",
        statusCode
      });
    } finally {
      if (keepaliveTimer) {
        clearInterval(keepaliveTimer);
      }
      res.end();
    }
  }
};
