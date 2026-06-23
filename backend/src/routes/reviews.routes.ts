import { Router } from "express";
import { createReview, getDestinationReviews } from "../controllers/reviews.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createReview);
router.get("/destination/:id", getDestinationReviews);

export default router;
