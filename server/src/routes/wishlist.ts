import { Router } from "express";
import {
  addWishlist,
  listWishlist,
  removeWishlist
} from "../controllers/wishlistController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);
router.get("/", listWishlist);
router.post("/", addWishlist);
router.delete("/:id", removeWishlist);

export default router;
