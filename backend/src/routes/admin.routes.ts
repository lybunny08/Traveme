import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import adminMiddleware from "../middleware/admin.middleware";
import {
  createDestination,
  updateDestination,
  deleteDestination,
} from "../controllers/destinations.controller";
import { upload, uploadImage } from "../controllers/media.controller";
import { getAllBookings, updateBookingStatus } from "../controllers/bookings.controller";
import { createPost, updatePost, deletePost } from "../controllers/blog.controller";

const router = Router();

// All admin routes require auth + admin
router.use(authMiddleware, adminMiddleware);

// Destinations management
router.post("/destinations", createDestination);
router.patch("/destinations/:id", updateDestination);
router.delete("/destinations/:id", deleteDestination);

// Media upload
router.post("/media/upload", upload.single("image"), uploadImage);

// Bookings management
router.get("/bookings", getAllBookings);
router.patch("/bookings/:id/status", updateBookingStatus);

// Blog management
router.post("/blog", createPost);
router.patch("/blog/:id", updatePost);
router.delete("/blog/:id", deletePost);

export default router;
