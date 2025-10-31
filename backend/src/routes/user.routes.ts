import { Router } from "express";
import { fetchAllUsers } from "../controllers/user.controllers";

const router = Router();

// add new routes related to users
// like /posts, /:id (fetch a specific user profile)

router.get("/all", fetchAllUsers);

export default router;