import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { promptsController } from "./prompts.controller.js";
import { promptSchema } from "./prompts.validation.js";

const router = Router();

router.post("/", validate(promptSchema), asyncHandler(promptsController.generate));

export default router;