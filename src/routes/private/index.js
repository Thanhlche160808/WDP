// ** Express
import express from "express";

// ** Routes
import userRouter from "./user.router";
import postRouter from "./post.router";
import authRouter from "./auth.router";
import chatRouter from "./chat.router";
import chatGroupRouter from "./chat-group.router";
import notificationRouter from "./notification.router";

const privateRouter = express.Router();

privateRouter.use("/auth", authRouter);
privateRouter.use("/user", userRouter);
privateRouter.use("/post", postRouter);
privateRouter.use("/chat", chatRouter);
privateRouter.use("/chat-group", chatGroupRouter);
privateRouter.use("/notification", notificationRouter);

export { privateRouter };
