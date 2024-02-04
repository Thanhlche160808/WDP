import mongoose from "mongoose";
import { Message } from "./chatBucket";

const { Boolean, ObjectId } = mongoose.Schema.Types;

const ChatGroupBucket = mongoose.model(
  "ChatGroupBucket",
  new mongoose.Schema(
    {
      chat_group: {
        type: ObjectId,
        ref: "ChatGroup",
        required: true,
      },
      page: {
        type: Number,
        required: true,
      },
      count: {
        type: Number,
        default: 0,
        max: 20,
      },
      messages: [Message]
    },
    { timestamps: true }
  )
);

export default ChatGroupBucket;
