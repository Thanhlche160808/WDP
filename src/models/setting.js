import mongoose from "mongoose";

const { Boolean, ObjectId } = mongoose.Schema.Types;

const Setting = mongoose.model(
  "Setting",
  new mongoose.Schema(
    {
      user: {
        type: ObjectId,
        ref: "User",
      },
      notification_like: {
        type: Boolean,
        default: true,
      },
      notification_comment: {
        type: Boolean,
        default: true,
      },
      stranger_can_add: {
        type: Boolean,
        default: true,
      },
      stranger_can_follow: {
        type: Boolean,
        default: true,
      },
      stranger_can_message: {
        type: Boolean,
        default: true,
      },
      people_can_tag: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  )
);

export default Setting;
