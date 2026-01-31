import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory
} from "../controllers/categoryController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { validate } from "../middleware/validate";
import { categorySchema } from "../validators/category";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", listCategories);
router.post("/", requireAuth, requireRole(Role.ADMIN), validate(categorySchema), createCategory);
router.put("/:id", requireAuth, requireRole(Role.ADMIN), updateCategory);
router.delete("/:id", requireAuth, requireRole(Role.ADMIN), deleteCategory);

export default router;
