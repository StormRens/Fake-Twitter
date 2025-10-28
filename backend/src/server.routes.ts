// Combines all the routes here to use in index.ts
// update this everytime you add a new route

import { Router } from "express";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import { sendVerificationEmail } from "./email";

const router = Router();

// prefix each route with what it will do: auth, user

// will be localhost:3000/user/{whatever you chose in routes directory}
router.use("/user", userRoutes); // will be localhost:3000/user/example
router.use("/auth", authRoutes);

// Test email route
router.get("/test-email", async (req, res) => {
  try {
    await sendVerificationEmail('mo212125@ucf.edu');
    res.json({ message: 'Test email sent! Check your inbox.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', details: error });
  }
});

export default router;