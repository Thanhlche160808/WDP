// ** Express
import express from "express";

// ** Controllers
import ChatController from "../../controllers/chat.controller";

// ** Middleware
import { chatValidation } from "../../middlewares/validate-data/chat";
import { authChat } from "../../middlewares/auth/chat";

const router = express.Router();

router.get(
  "/",
  chatValidation.chatContent(),
  authChat.canGetChatContent,
  ChatController.getChatContent
);

router.get("/list", chatValidation.getChats(), ChatController.getChatsOfUser);

router.post(
  "/message",
  chatValidation.sendMessage(),
  ChatController.sendMessage
);

export default router;
