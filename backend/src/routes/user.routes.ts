import { Router } from "express";
import { userExample } from "../controllers/user.controllers";

const router = Router();

// add new routes related to users
// like /posts, /:id (fetch a specific user profile)

router.get("/example", userExample);

export default router;