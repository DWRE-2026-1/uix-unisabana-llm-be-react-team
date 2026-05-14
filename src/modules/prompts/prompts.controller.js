import { promptsService } from "./prompts.service.js";
import { apiResponse } from "../../utils/api-response.js";

export const promptsController = {
  async generate(req, res) {
    const { prompt, provider } = req.body;
    const data = await promptsService.generate(prompt, provider);
    return apiResponse(res, { status: 200, message: "OK", data });
  },

  async stream(req, res) {
    const { prompt, provider } = req.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    try {
      await promptsService.stream(prompt, provider, (chunk) => {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      });
      res.write("data: [DONE]\n\n");
    } catch (err) {
      res.write(`event: error\ndata: ${JSON.stringify({ message: err.message })}\n\n`);
    } finally {
      res.end();
    }
  }
};