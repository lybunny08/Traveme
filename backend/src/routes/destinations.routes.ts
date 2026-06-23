import { Router } from "express";
import { listDestinations, getDestination } from "../controllers/destinations.controller";

const router = Router();

router.get("/", listDestinations);
router.get("/:slug", getDestination);

export default router;
