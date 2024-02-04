import Chat from "../models/chat";
import ChatBucket from "../models/chatBucket";

const LIMIT_MESSAGE = 15;

class ChatService {
  async canGetChatContent({ userId, chatId }) {
    return !!(await Chat.findOne({
      $or: [{ user_1: userId }, { user_2: userId }],
      _id: chatId,
    }));
  }

  async getOrCreateChat({ user_1, user_2 }) {
    return await Chat.findOneAndUpdate(
      {
        $or: [
          { $and: [{ user_1 }, { user_2 }] },
          { $and: [{ user_1: user_2, user_2: user_1 }] },
        ],
      },
      {
        user_1,
        user_2,
      },
      { upsert: true, new: true }
    );
  }

  async insertChatMessage({ targetUserId, senderId, message = {} }) {
    const chat = await this.getOrCreateChat({
      user_1: targetUserId,
      user_2: senderId,
    });

    const chatBucket = await ChatBucket.findOneAndUpdate(
      {
        chat: new RegExp(`^${chat.id}_`),
        count: { $lt: LIMIT_MESSAGE },
      },
      {
        $push: { messages: message },
        $inc: { count: 1 },
        $setOnInsert: {
          chat: `${chat.id}_${new Date().valueOf()}`,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    if (chatBucket.messages.length === 1) {
      const prevBucket = await ChatBucket.findOne({
        chat: new RegExp(`^${chat.id}_`),
      })
        .sort({ chat: -1 })
        .skip(chatBucket.page);

      if (prevBucket) {
        chatBucket.page = prevBucket?.page + 1;
        await chatBucket.save();
      }
    }

    return chatBucket;
  }

  async getChatContent({ chatId, page = 1 }) {
    return await ChatBucket.findOne({ chat: new RegExp(`^${chatId}_`), page });
  }

  async getLastMessageOfChat({ chatId }) {
    const bucket = await ChatBucket.findOne({
      chat: new RegExp(`^${chatId}_`),
    }).sort({ chat: -1 });

    return bucket.messages[bucket.messages.length - 1];
  }

  async getChats({ limit, offset, userId }) {
    const selectUser = "_id firstName lastName gender picture role isActive";

    let chats = await Chat.find({
      $or: [{ user_1: userId }, { user_2: userId }],
    })
      .populate("user_1", selectUser)
      .populate("user_2", selectUser)
      .exec();

    chats = await Promise.all(chats.map(async (chat) => {
      const lastMessage = await this.getLastMessageOfChat({
        chatId: chat.id,
      });

      return {
        _id: chat._id,
        user: chat.user_1.id === userId ? chat.user_2 : chat.user_1,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        lastMessage
      };
    }));

    return chats;
  }
}

export default new ChatService();
