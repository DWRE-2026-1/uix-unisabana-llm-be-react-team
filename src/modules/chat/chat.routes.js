import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { chatController } from "./chat.controller.js";
import { chatSchema } from "./chat.validation.js";

const router = Router();

router.post("/", validate(chatSchema), asyncHandler(chatController.completion));
router.post("/stream", validate(chatSchema), asyncHandler(chatController.stream));

export default router;
