// ** Libs
import { body, query } from "express-validator";

// ** Validate
import { validate } from "./validation-request";

// ** Helpers
import { message } from "../../helpers/message";

export const chatValidation = {
  chatContent: () =>
    validate([
      query("page")
        .notEmpty()
        .withMessage(message.required("page"))
        .isInt({ min: 1 })
        .withMessage(
          message.mustBeNumberAndGreaterThanOrEqual({ field: "page", value: 1 })
        ),
      query("chatId").notEmpty().withMessage(message.required("chatId")),
    ]),
  sendMessage: () =>
    validate([
      body("content").optional().isString(),
      body("images").optional().isArray({ min: 0, max: 10 }),
      body("target_user_id")
        .notEmpty()
        .withMessage(message.required("target_user_id")),
      body("replyTo").optional().isString(),
    ]),
  getChats: () =>
    validate([
      query("limit").notEmpty().withMessage(message.required("limit")),
      query("offset").notEmpty().withMessage(message.required("offset")),
    ]),
};
