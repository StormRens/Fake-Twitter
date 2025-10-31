// Combines all the routes here to use in index.ts
// update this everytime you add a new route

import { Router } from "express";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";

const router = Router();

// prefix each route with what it will do: auth, user

// will be localhost:3000/user/{whatever you chose in routes directory}
router.use("/user", userRoutes); // will be localhost:3000/user/example
router.use("/auth", authRoutes);
router.use("/post", postRoutes);

export default router;