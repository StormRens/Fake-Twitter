import { Router } from "express";
import { login, verify, register } from "../controllers/auth.controllers";

const router = Router();

// add new routes related to users
// like /posts, /:id (fetch a specific user profile)

router.post("/login", login);
router.post("/register", register);
router.get("/verify", verify);

export default router;