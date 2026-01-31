import { Router } from "express";
import { addReview, listReviews } from "../controllers/reviewController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/:productId", listReviews);
router.post("/", requireAuth, addReview);

export default router;
