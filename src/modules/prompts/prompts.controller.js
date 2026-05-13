import { promptsService } from "./prompts.service.js";
import { apiResponse } from "../../utils/api-response.js";

export const promptsController = {
  async generate(req, res) {
    const { prompt, provider } = req.body;
    const data = await promptsService.generate(prompt, provider);
    return apiResponse(res, { status: 200, message: "OK", data });
  }
};