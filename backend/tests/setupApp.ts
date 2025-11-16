import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// routers under test
import authRouter from "../src/routes/auth.routes";
import postRouter from "../src/routes/post.routes";
import userRouter from "../src/routes/user.routes";

export default function createApp() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use("/auth", authRouter);
  app.use("/post", postRouter);
  app.use("/user", userRouter);

  return app;
}