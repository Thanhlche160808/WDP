import mongoose from "mongoose";

const { Boolean, ObjectId } = mongoose.Schema.Types;

export const  React = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["Like", "Love", "Haha", "Wow", "Sad", "Angry"],
      default: "Like",
    },
  },
  { timestamps: true }
);

const Post = mongoose.model(
  "Post",
  new mongoose.Schema(
    {
      user: {
        type: ObjectId,
        ref: "User",
      },
      content: String,
      images: [String],
      is_public: {
        type: Boolean,
        default: true,
      },
      reacts: [React],
      shared: {
        type: Number,
        default: 0,
      },
      isDelete: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);

export default Post;
