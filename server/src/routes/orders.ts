import { Router } from "express";
import {
  createOrder,
  listAllOrders,
  listOrders,
  trackOrder,
  updateOrderStatus
} from "../controllers/orderController";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/role";
import { validate } from "../middleware/validate";
import { orderSchema } from "../validators/order";
import { Role } from "@prisma/client";

const router = Router();

router.use(requireAuth);
router.post("/", validate(orderSchema), createOrder);
router.get("/", listOrders);
router.get("/track/:id", trackOrder);
router.get("/admin", requireRole(Role.ADMIN), listAllOrders);
router.patch("/:id/status", requireRole(Role.ADMIN), updateOrderStatus);

export default router;
