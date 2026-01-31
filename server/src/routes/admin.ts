import { Router } from "express";
import { getAnalytics } from "../controllers/adminController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { Role } from "@prisma/client";

const router = Router();

router.use(requireAuth, requireRole(Role.ADMIN));
router.get("/analytics", getAnalytics);

export default router;
