import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { rolesController } from "./roles.controller.js";
import { createRoleSchema } from "./roles.validation.js";
import { authMiddleware, requireAdmin } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.get("/", asyncHandler(rolesController.list));
router.post("/", validate(createRoleSchema), asyncHandler(rolesController.create));

export default router;
