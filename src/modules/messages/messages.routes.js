import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { messagesController } from "./messages.controller.js";
import { createMessageSchema } from "./messages.validation.js";

const router = Router();

router.get("/", asyncHandler(messagesController.list));
router.post("/", validate(createMessageSchema), asyncHandler(messagesController.create));

export default router;
