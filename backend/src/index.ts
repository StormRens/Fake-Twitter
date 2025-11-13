import express from "express";
import cors from "cors";
import routes from "./server.routes";
import { connectDB } from "./db";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
}));

app.use(express.json())

app.use(cookieParser());

// Prefixes the endpoint with /
app.use('/',routes);

// REVERT BACK WHEN MONGO IS SET UP
(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error("Failed to start server due to DB error:", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
})();