import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authMiddleware, requireAuth, requireOwnership } from "../../middlewares/auth.middleware.js";
import { conversationsController } from "./conversations.controller.js";
import { createConversationSchema } from "./conversations.validation.js";
import { conversationsRepository } from "./conversations.repository.js";

const router = Router();

router.use(authMiddleware);
router.use(requireAuth);

const ownsConversation = requireOwnership(async (req) => {
  const conversation = await conversationsRepository.findById(req.params.id);
  return conversation?.user;
});

router.get("/", asyncHandler(conversationsController.list));
router.post("/", validate(createConversationSchema), asyncHandler(conversationsController.create));
router.get("/:id", ownsConversation, asyncHandler(conversationsController.getById));
router.patch("/:id", ownsConversation, asyncHandler(conversationsController.rename));
router.delete("/:id", ownsConversation, asyncHandler(conversationsController.remove));

export default router;