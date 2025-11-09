import { Router } from "express";
import { fetchAllUsers, deleteUserByUsername, followUser, unfollowUser, getFollowers, getFollowing, getUserProfile } from "../controllers/user.controllers";
import { requireAuth } from "../middlewares/auth.middlewares";

const router = Router();

// add new routes related to users
// like /posts, /:id (fetch a specific user profile)

// test routes
router.get("/all", fetchAllUsers);
router.delete("/:username", deleteUserByUsername);


router.post("/:username/follow", requireAuth, followUser);
router.post("/:username/unfollow", requireAuth, unfollowUser);


router.get("/:username/followers", requireAuth, getFollowers);
router.get("/:username/following", requireAuth, getFollowing);
router.get("/:username/profile", requireAuth, getUserProfile);

export default router;