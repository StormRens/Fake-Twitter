import { Router } from "express";
import { createPost, deletePost, fetchAll, fetchFollowingPosts, fetchUserPosts } from "../controllers/post.controllers";

const router = Router();

// add new routes related to users
// like /posts, /:id (fetch a specific user profile)

router.get("/", fetchAll);
router.get("/:userId", fetchUserPosts);
router.post("/create", createPost);
router.delete("/:id", deletePost);
router.get("/following/:userId", fetchFollowingPosts);


export default router;