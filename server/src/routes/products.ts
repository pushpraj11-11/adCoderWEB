import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct
} from "../controllers/productController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { validate } from "../middleware/validate";
import { productSchema } from "../validators/product";
import { Role } from "@prisma/client";

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", requireAuth, requireRole(Role.ADMIN), validate(productSchema), createProduct);
router.put("/:id", requireAuth, requireRole(Role.ADMIN), updateProduct);
router.delete("/:id", requireAuth, requireRole(Role.ADMIN), deleteProduct);

export default router;
