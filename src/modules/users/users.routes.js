import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { usersController } from "./users.controller.js";
import { createUserSchema } from "./users.validation.js";
import { authMiddleware, requireAdmin } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.get("/", asyncHandler(usersController.list));
router.get("/:id", asyncHandler(usersController.getById));
router.post("/", validate(createUserSchema), asyncHandler(usersController.create));
router.patch("/:id", asyncHandler(usersController.update));
router.delete("/:id", asyncHandler(usersController.remove));

export default router;
