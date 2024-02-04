import UserService from "../services/user.service";
import { response } from "../utils/baseResponse";
import { ApiError } from "../helpers/errorHandle";

class UserController {
    async profile(req, res, next) {
        const { userId } = req.params;
        try {
            const user = await UserService.profile(userId);
            res.status(200).json(
                response.success({
                    data: { user },
                })
            );
        } catch (err) {
            next(new ApiError(400, err?.message));
        }
    }

    async editProfile (req, res, next) {
        const userId = req.user.id;
        const data = req.body;
        console.log(data);
        try {
            const user = await UserService.editProfile(userId, data);
            res.status(200).json(
                response.success({
                    data: { user },
                })
            );
        } catch (err) {
            next(new ApiError(400, err?.message));
        }
    }

    async follow (req, res, next) {
        const userId = req.user.id;
        const { friendId } = req.params;
        try {
            const user = await UserService.follow(userId, friendId);
            res.status(200).json(
                response.success({
                    data: { user },
                })
            );
        } catch (err) {
            next(new ApiError(400, err?.message));
        }
    }

    async changePassword (req, res, next) {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        try {
            const user = await UserService.changePassword(userId, currentPassword, newPassword);
            res.status(200).json(
                response.success({
                    data: { user },
                })
            );
        } catch (err) {
            next(new ApiError(400, err?.message));
        }
    }

    async getFollowers (req, res, next) {
        const { userId } = req.params;
        try {
            const user = await UserService.getFollowers(userId);
            res.status(200).json(
                response.success({
                    data: { user },
                })
            );
        } catch (err) {
            next(new ApiError(400, err?.message));
        }
    }

    async getFollowing (req, res, next) {
        const { userId } = req.params;
        try {
            const user = await UserService.getFollowing(userId);
            res.status(200).json(
                response.success({
                    data: { user },
                })
            );
        } catch (err) {
            next(new ApiError(400, err?.message));
        }
    }

    async unFollow (req, res, next) {
        const userId = req.user.id;
        const { friendId } = req.params;
        try {
            await UserService.unFollow(userId, friendId);
            res.status(200).json(
                response.success({
                    data: { friendId },
                })
            );
        } catch (err) {
            next(new ApiError(400, err?.message));
        }
    }
}

export default new UserController();
