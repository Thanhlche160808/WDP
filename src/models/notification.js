import mongoose from "mongoose";

const { Boolean, ObjectId } = mongoose.Schema.Types;

const Notification = mongoose.model(
  "Notification",
  new mongoose.Schema(
    {
      user: {
        type: ObjectId,
        ref: "User",
      },
      title: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ["friend_request", "tag", "post"],
        required: true
      },
      is_read: {
        type: Boolean,
        default: false
      },
      is_trash: {
        type: Boolean,
        default: false
      },
      meta_data: {
        sender: {
            type: ObjectId,
            ref: 'User'
        },
        subject: String
      }
    },
    { timestamps: true }
  )
);

export default Notification;
