import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { authController } from "./auth.controller.js";
import { loginSchema, registerSchema, updateMeSchema } from "./auth.validation.js";
import { authMiddleware, requireAuth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/login", validate(loginSchema), asyncHandler(authController.login));
router.post("/register", validate(registerSchema), asyncHandler(authController.register));
router.post("/logout", requireAuth, asyncHandler(authController.logout));
router.get("/me", requireAuth, asyncHandler(authController.me));
router.patch("/me", requireAuth, validate(updateMeSchema), asyncHandler(authController.updateMe));

export default router;
