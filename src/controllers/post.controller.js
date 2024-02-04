import PostService from "../services/post.service";
import { response } from "../utils/baseResponse";

import { ApiError } from "../helpers/errorHandle";
import { jwtService } from "../utils/jwt";

class PostController {
    async newFeed(req, res, next) {
        const userId = req.user.id;
        try {
            const posts = await PostService.getNewFeed(userId);
            res.status(200).json(
                response.success({
                    data: { posts }
                })
            );
        } catch (err) {
            next(new ApiError(400, err?.message));
        }
    }

    async createPost(req, res, next) {
        const data = req.body;
        const userId = req.user.id;
        try {
            const post = await PostService.createPost(data, userId);
            res.status(200).json(
                response.success({
                    data: { post },
                })
            );
        } catch (err) {
            next(new ApiError(409, err?.message));
        }
    }

    async personalPosts(req, res, next) {
        const userId = req.user.id;
        try {
            const posts = await PostService.personalPosts(userId);
            res.status(200).json(
                response.success({
                    data: { posts },
                })
            );
        } catch (err) {
            next(new ApiError(400, err?.message));
        }
    }

    async reactPost(req, res, next) {
        const userId = req.user.id;
        const { postId, type } = req.body;
        try {
            const post = await PostService.reactPost(userId, postId, type);
            res.status(200).json(
                response.success({
                    data: { post },
                })
            );
        } catch (err) {
            next(new ApiError(400, err?.message));
        }
    };

    async editPost(req, res, next) {
        const { postId } = req.params;
        const dataEdit = req.body;
        try {
            const postEdited = await PostService.editPost(postId, dataEdit);
            res.status(200).json(
                response.success({
                    data: { postEdited },
                })
            );

        } catch (error) {
            next(new ApiError(400, error?.message));
        }
    }

    async getPostDetail(req, res, next) {
        try {
            const { postId } = req.params;
            const post = await PostService.getPostById(postId);
            res.status(200).json(
                response.success({
                    data: { post },
                })
            );
        } catch (error) {
            next(new ApiError(400, error?.message));
        }
    }
}

export default new PostController();
