import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import usersRoutes from "../modules/users/users.routes.js";
import rolesRoutes from "../modules/roles/roles.routes.js";
import chatRoutes from "../modules/chat/chat.routes.js";
import conversationsRoutes from "../modules/conversations/conversations.routes.js";
import messagesRoutes from "../modules/messages/messages.routes.js";
import modelsRoutes from "../modules/models/models.routes.js";
import healthRoutes from "../modules/health/health.routes.js";
import promptsRoutes from "../modules/prompts/prompts.routes.js";
const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "UIX API root" });
});

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/roles", rolesRoutes);
router.use("/chat", chatRoutes);
router.use("/conversations", conversationsRoutes);
router.use("/messages", messagesRoutes);
router.use("/models", modelsRoutes);
router.use("/prompts", promptsRoutes);

export default router;
