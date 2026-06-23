import { Router } from "express";
import { listPosts, getPost } from "../controllers/blog.controller";

const router = Router();

router.get("/", listPosts);
router.get("/:slug", getPost);

export default router;
