import { Router } from "express";
import { login, verify, register, loginMobile, verifyMobile, registerMobile, logout } from "../controllers/auth.controllers";

const router = Router();

// add new routes related to users
// like /posts, /:id (fetch a specific user profile)

// web routes for auth (set cookies and redirect)
router.post("/login", login);
router.post("/register", register);
router.get("/verify", verify);
router.post("/logout", logout);

// Mobile routes for auth (dont set cookies, just return JSON token)
router.post("/login/mobile", loginMobile);
router.get("/verify/mobile", verifyMobile);
router.post("/register/mobile", registerMobile);

export default router;