import { Router } from "express";
import { fetchAllUsers, deleteUserByUsername } from "../controllers/user.controllers";

const router = Router();

// add new routes related to users
// like /posts, /:id (fetch a specific user profile)

router.get("/all", fetchAllUsers);
router.delete("/:username", deleteUserByUsername);

export default router;