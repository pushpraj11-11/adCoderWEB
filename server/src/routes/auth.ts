import { Router } from "express";
import {
  forgotPassword,
  login,
  logout,
  profile,
  refresh,
  register
} from "../controllers/authController";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  forgotSchema,
  loginSchema,
  refreshSchema,
  registerSchema
} from "../validators/auth";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);
router.post("/logout", logout);
router.post("/forgot-password", validate(forgotSchema), forgotPassword);
router.get("/profile", requireAuth, profile);

export default router;
