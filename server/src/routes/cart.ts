import { Router } from "express";
import {
  addToCart,
  listCart,
  removeCartItem,
  updateCartItem
} from "../controllers/cartController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", listCart);
router.post("/", addToCart);
router.put("/:id", updateCartItem);
router.delete("/:id", removeCartItem);

export default router;
