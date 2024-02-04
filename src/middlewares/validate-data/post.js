// ** Libs
import { body, validationResult } from "express-validator";

// ** Validate
import { validate } from "./validation-request";

// ** Helpers
import { message } from "../../helpers/message";


export const postValidation = {
    contentPost: () =>
        validate([
            body("content").optional().isString().withMessage(message.invalid("content")),
            body("images").optional().isArray().withMessage(message.invalid("images")),
            body("is_public").isBoolean().withMessage(message.invalid("is_public")),
        ]),
}