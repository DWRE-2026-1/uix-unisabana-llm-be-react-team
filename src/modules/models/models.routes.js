import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { modelsController } from "./models.controller.js";
import { setDefaultProviderSchema } from "./models.validation.js";

const router = Router();

router.get("/", asyncHandler(modelsController.list));
router.patch("/default-provider", validate(setDefaultProviderSchema), asyncHandler(modelsController.setDefaultProvider));

export default router;
