import { Router } from "express";
import { createPost, deletePost, fetchAll, fetchFollowingPosts, fetchUserPosts, editPost } from "../controllers/post.controllers";
import { requireAuth } from "../middlewares/auth.middlewares";

const router = Router();

// add new routes related to users
// like /posts, /:id (fetch a specific user profile)

router.get("/", requireAuth, fetchAll);

router.get("/:userId/following", requireAuth, fetchFollowingPosts);

router.get("/:userId", requireAuth, fetchUserPosts);

//front-end added, but still not working 
router.put("/:id", requireAuth, editPost);

router.post("/create", requireAuth, createPost);
router.delete("/:id", requireAuth, deletePost);;


export default router;