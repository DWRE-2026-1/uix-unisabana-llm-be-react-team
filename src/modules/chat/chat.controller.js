import { scaffoldResponse } from "../../utils/scaffold-response.js";

export const chatController = {
  async completion(_req, res) {
    return scaffoldResponse(res, "chat", "completion");
  },
  async stream(_req, res) {
    // Scaffolding SSE shape for future implementation.
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
    res.write("event: error\ndata: {\"message\":\"Scaffolding endpoint\"}\n\n");
    res.end();
  }
};
