import mongoose from "mongoose";
import { React } from "./post";

const { Boolean, ObjectId } = mongoose.Schema.Types;

const CommentBucket = mongoose.model(
  "CommentBucket",
  new mongoose.Schema(
    {
      commentId: {
        type: String,
        required: true,
      },
      post: {
        type: ObjectId,
        ref: "Post",
        required: true,
      },
      page: {
        type: Number,
        default: 1,
      },
      count: {
        type: Number,
        default: 0,
        max: 5,
      },
      comments: [
        {
          user: {
            type: ObjectId,
            ref: "User",
            required: true,
          },
          content: String,
          image: String,
          replies: [
            {
              user: {
                type: ObjectId,
                ref: "User",
                required: true,
              },
              content: String,
              image: String,
              reacts: [React],
            },
          ],
          reacts: [React],
        },
      ],
    },
    { timestamps: true }
  )
);

export default CommentBucket;
