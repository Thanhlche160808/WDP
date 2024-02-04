"use strict";

// ** Express
import express from "express";
import http from "http";

// ** Socket
import { Server } from "socket.io";

// ** Config
import configApp from "./configs/config";
import { bootstrap } from "./configs/bootstrap";

// ** Middleware
import { verifyAccessToken } from "./middlewares/auth.jwt";
import { privateRouter, publicRouter } from "./routes";

// ** Helper
import { ErrorHandler } from "./helpers/errorHandle";

// ** Service
import SocketService from "./services/socket.service";

const app = express();
configApp(app);
const server = http.createServer(app);
const io = new Server(server);
global._io = io;

global._io.on("connection", SocketService.connection);

// ** Public API here
app.use("/api/public", publicRouter);

// ** Private API here
app.use("/api/*", verifyAccessToken);

app.use("/api", privateRouter);

/*
 * Keep error-handler as last middleware
 */
app.use(ErrorHandler);

app.use("/*", (req, res) => {
  res.status(200).json({
    code: 404,
    message: "API not found",
  });
});

bootstrap(app);

export { server };
