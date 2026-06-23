import { Router } from "express";
import { createBooking, getMyBookings } from "../controllers/bookings.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createBooking);
router.get("/me", authMiddleware, getMyBookings);

export default router;
