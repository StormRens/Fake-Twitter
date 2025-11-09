import { Router } from "express";
import { createPost, deletePost, fetchAll, fetchFollowingPosts, fetchUserPosts } from "../controllers/post.controllers";
import { requireAuth } from "../middlewares/auth.middlewares";

const router = Router();

// add new routes related to users
// like /posts, /:id (fetch a specific user profile)

router.get("/",requireAuth, fetchAll);
router.get("/:userId",requireAuth, fetchUserPosts);
router.post("/create",requireAuth, createPost);
router.delete("/:id",requireAuth, deletePost);
router.get("/following/:userId",requireAuth, fetchFollowingPosts);


export default router;