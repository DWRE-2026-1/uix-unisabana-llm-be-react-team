import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { conversationsController } from "./conversations.controller.js";
import { createConversationSchema } from "./conversations.validation.js";

const router = Router();

router.get("/", asyncHandler(conversationsController.list));
router.post("/", validate(createConversationSchema), asyncHandler(conversationsController.create));
router.get("/:id", asyncHandler(conversationsController.getById));
router.patch("/:id", asyncHandler(conversationsController.rename));
router.delete("/:id", asyncHandler(conversationsController.remove));

export default router;
