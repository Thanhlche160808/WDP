import ChatService from "../services/chat.service";

// ** Utils
import { response } from "../utils/baseResponse";

// ** Helpers
import { ApiError } from "../helpers/errorHandle";
import { message } from "../helpers/message";
import ChatBucket from "../models/chatBucket";

class ChatController {
  async getChatContent(req, res, next) {
    const { page, chatId } = req.query;

    try {
      const chat = await ChatService.getChatContent({ chatId, page });

      res.status(200).json(
        response.success({
          data: { chat },
        })
      );
    } catch (err) {
      next(new ApiError(400, err?.message));
    }
  }

  async sendMessage(req, res, next) {
    const { id } = req.user;
    const { content, images = [], target_user_id, replyTo = null } = req.body;

    try {
      if (id === target_user_id)
        throw new Error("You can't send messages to yourself");
    
      const message = await ChatService.insertChatMessage({
        targetUserId: target_user_id,
        senderId: id,
        message: {
          content,
          images,
          replyTo,
          user: id,
        },
      });

      res.status(200).json(
        response.success({
          data: { message },
        })
      );
    } catch (err) {
      next(new ApiError(400, err?.message));
    }
  }

  async getChatsOfUser(req, res, next) {
    const { id }= req.user;
    const { limit, offset } = req.query;

    try {
      const chats = await ChatService.getChats({ limit, offset, userId: id });

      res.status(200).json(
        response.success({
          data: { chats },
        })
      );
    }catch (err) {
      next(new ApiError(400, err?.message))
    }
  }
}

export default new ChatController();
