// ** Express
import express from "express";

// ** Controllers
import PostController from "../../controllers/post.controller";

import { postValidation } from "../../middlewares/validate-data/post";
const router = express.Router();

router.get("/getPosts", PostController.newFeed);
router.post("/createPost", postValidation.contentPost(), PostController.createPost);
router.get("/personalPosts", PostController.personalPosts);
router.patch("/reactPost", PostController.reactPost);
router.put("/editPost/:postId", postValidation.contentPost(), PostController.editPost);
router.get("/postDetail/:postId", PostController.getPostDetail)

export default router;